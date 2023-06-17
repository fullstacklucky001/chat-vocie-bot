const axios = require("axios")
const mongoose = require("mongoose")
const MessageModel = require("../models/MessageModel")
const PromptModel = require("../models/PromptModel")

const insertUserMessage = async (req, res) => {
  try {
    let { userMessage } = req.body;

    // create user message
    let result = await MessageModel.create({
      owner: 1,
      message: userMessage,
      summarized_message: userMessage   // It is possible to summarize
    })

    res.status(200).json({ status: 'success', data: result });

  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

const insertRickMessage = async (req, res) => {
  try {

    // prepare mlmessages : Read all user and rick message and filter message
    let mlMessages = []

    // prepare system_content
    let prompts = await PromptModel.find({ active: true }, { title: 1, summarized_prompt: 1 })
    let systemContentStr = ''
    prompts.forEach(prompt => {
      systemContentStr += prompt.title + ':' + prompt.summarized_prompt
    })

    let systemContent = {
      'role': 'system',
      'content': systemContentStr   // 2556 letters
    }

    mlMessages.push(systemContent)

    // prepare user and rick's messages
    let messages = await MessageModel.find({}, { summarized_message: 1 }).sort({ _id: -1 }).limit(20)
    let reversedMessages = messages.reverse()
    reversedMessages.forEach(element => {
      mlMessages.push(element.summarized_message)
    });

    // create Axios request 
    const axiosRequest = axios.create({
      baseURL: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + global.env.CHAT_API_KEY
      }
    })

    let rawData = await axiosRequest.post('', {
      model: 'gpt-3.5-turbo-0301',
      messages: mlMessages,
      max_tokens: 100,
      stream: true
    })

    const lines = rawData.data?.toString()?.split("\n").filter((line) => line.trim() !== "");
    let resultStr = "";
    for (const line of lines) {
      const msg = line.replace(/^data: /, "");
      if (msg === "[DONE]") {
      } else {
        let token = '';
        try {
          token = JSON.parse(msg)?.choices?.[0]?.delta?.content;
          if (token !== undefined) {
            resultStr += token;
          }
        } catch {
          console.log("Error");
          return;
        }
      }
    }

    // create rick message
    let rickMessage = {
      'role': 'assistant',
      'content': resultStr
    }

    let summarizedRickMessageStr = await summarizeText(resultStr)

    // create rick summarized message
    let rickSummarizedMessage = {
      'role': 'assistant',
      'content': summarizedRickMessageStr
    }

    await MessageModel.create({
      owner: 0,
      message: rickMessage,
      summarized_message: rickSummarizedMessage
    })

    let result = await MessageModel.find({}, { _id: 1, owner: 1, message: 1 }).sort({ _id: -1 }).limit(1)

    if (result.length > 0)
      res.status(200).json({ status: 'success', data: result[0] });

  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

const insertRickStaticMessage = async (req, res) => {
  try {
    let message = req.body.message
    let rickMessage = {
      'role': 'assistant',
      'content': message
    }

    // create rick summarized message
    let rickSummarizedMessage = {
      'role': 'assistant',
      'content': rickMessage
    }

    await MessageModel.create({
      owner: 0,
      message: rickMessage,
      summarized_message: rickSummarizedMessage
    })

    let result = await MessageModel.find({}, { _id: 1, owner: 1, message: 1 }).sort({ _id: -1 }).limit(1)

    if (result.length > 0)
      res.status(200).json({ status: 'success', data: result[0] });

  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}


const getMessages = async (req, res) => {
  try {
    let messages = await MessageModel.find({}, { owner: 1, message: 1 }).sort("_id")
    res.status(200).json({ status: 'success', data: messages });

  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

const deleteMessage = async (req, res) => {
  const id = req.body.messageId
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No message with that ID')

    await MessageModel.findByIdAndDelete({ _id: id })
    res.status(200).json({ msg: 'success' })

  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const getPrompts = async (req, res) => {
  try {
    let prompts = await PromptModel.find({ seed: false }, { _id: 1, title: 1, prompt: 1, active: 1 }).sort("_id")
    res.status(200).json({ status: 'success', data: prompts });

  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

const activePrompt = async (req, res) => {
  const id = req.body.promptId
  let active = req.body.active
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No message with that ID')

    await PromptModel.findByIdAndUpdate({ _id: id }, { active: active })
    res.status(200).json({ msg: 'success' })

  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const updatePrompt = async (req, res) => {
  const id = req.body.promptId
  let prompt = req.body.prompt
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No message with that ID')
    let summarizedPrompt = await summarizeText(prompt)
    await PromptModel.findByIdAndUpdate({ _id: id }, { prompt: prompt, summarized_prompt: summarizedPrompt })
    let result = await PromptModel.findById({ _id: id }, { _id: 1, title: 1, prompt: 1, active: 1 })
    res.status(200).json({ msg: 'success', data: result })

  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

const summarizeText = async (text) => {
  try {
    let systemContent = [{
      'role': 'system',
      'content': 'Summarize and condense the following sentences with the most meaningful words. The newly summarized sentences must be 1/4 smaller than the original. Compress text as much as possible. My sentences are below: ' + text
    }]

    // create Axios request 
    const axiosRequest = axios.create({
      baseURL: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + global.env.CHAT_API_KEY
      }
    })

    let rawData = await axiosRequest.post('', {
      model: 'gpt-3.5-turbo-0301',
      messages: systemContent,
      stream: true
    })

    const lines = rawData.data?.toString()?.split("\n").filter((line) => line.trim() !== "");
    let resultStr = "";
    for (const line of lines) {
      const msg = line.replace(/^data: /, "");
      if (msg === "[DONE]") {
      } else {
        let token = '';
        try {
          token = JSON.parse(msg)?.choices?.[0]?.delta?.content;
          if (token !== undefined) {
            resultStr += token;
          }
        } catch {
          console.log("Error");
          return;
        }
      }
    }
    return resultStr
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  insertUserMessage,
  insertRickMessage,
  getMessages,
  deleteMessage,
  getPrompts,
  activePrompt,
  updatePrompt,
  insertRickStaticMessage
}