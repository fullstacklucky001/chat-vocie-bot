const axios = require("axios")
const mongoose = require("mongoose")
const MessageModel = require("../models/MessageModel")

const insertUserMessage = async (req, res) => {
  try {
    let { userMessage } = req.body;

    // create user message
    let result = await MessageModel.create({
      owner: 1,
      seed: false,
      message: userMessage
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
    let messages = await MessageModel.find().sort("_id")
    messages.forEach(element => {
      mlMessages.push(element.message)
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
      model: 'gpt-3.5-turbo',
      messages: mlMessages,
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

    let result = await MessageModel.create({
      owner: 0,
      seed: false,
      message: rickMessage
    })

    if (result)
      res.status(200).json({ status: 'success', data: result });

  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

const getMessages = async (req, res) => {
  try {
    let messages = await MessageModel.find({ seed: false }).sort("_id")
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

module.exports = {
  insertUserMessage,
  insertRickMessage,
  getMessages,
  deleteMessage
}