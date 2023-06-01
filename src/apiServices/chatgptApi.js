import axios from 'axios';

class ChatGptApiService {
    constructor() {
        this.service = axios.create({
            baseURL: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-pLEJtwyQeOB1a2jMDT7fT3BIbkFJnaqEo3RLEOMR2YNiTXWE'
            }
        })
    }

    createMessage = (message) => {
        return new Promise((resolve, reject) => {
            this.service.post('', {
                // model: 'gpt-3.5-turbo-0301',
                model: 'gpt-3.5-turbo',
                messages: message,
                stream: true
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }
}

const service = new ChatGptApiService();

export default service;