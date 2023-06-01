import axios from "axios"

export const makeMessage = async (req, res) => {
  try {
    let { mlMessage } = req.body;
    const axiosRequest = axios.create({
      baseURL: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + global.env.CHAT_API_KEY
      }
    })

    let result = await axiosRequest.post('', {
      model: 'gpt-3.5-turbo',
      messages: mlMessage,
      stream: true
    })
    res.status(200).json({ status: 'success', data: result.data });

  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}