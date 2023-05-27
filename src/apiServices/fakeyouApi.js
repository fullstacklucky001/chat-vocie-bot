import axios from 'axios';

import store from '../store';

class FakeYouApiService {
    constructor() {
        this.service = axios.create({
            baseURL: `https://cors-anywhere.herokuapp.com/https://api.fakeyou.com`,
            // baseURL: `https://api.fakeyou.com`,
            headers: {
                // Accept: 'application/json',
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*',
                // Cookie: '_gid=GA1.2.230419203.1684720444; _ga_06ZXE5FTP6=GS1.1.1685117380.11.1.1685118628.0.0.0; _ga=GA1.2.107670347.1684720444; session=eyJhbGciOiJIUzI1NiJ9.eyJjb29raWVfdmVyc2lvbiI6IjIiLCJzZXNzaW9uX3Rva2VuIjoiU0VTU0lPTjpkeTU5c2MzZzh3M2o5eGN5bnM4M3BxOXgiLCJ1c2VyX3Rva2VuIjoiVTpGVkFRMTY4UzJIQ0FQIn0.mdrDSCqhSeGncRpSTEqESn4FjAAgT-ktFXKiA8d13ew'
            },
            // withCredentials: true
        })

        // this.service.interceptors.response.use(
        //     (res) => res,
        //     (err) => {
        //         if (err.response.status === 401) {
        //             store.dispatch({ type: SIGNOUT });
        //         }
        //         return Promise.reject(err);
        //     }
        // )
    }

    getModelList = () => {
        return new Promise((resolve, reject) => {
            this.service.get('/tts/list', {
                // hello: "afaf",
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        })
    }
}

const fakeyou = new FakeYouApiService();

export default fakeyou;