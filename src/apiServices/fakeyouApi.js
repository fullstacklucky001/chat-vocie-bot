import axios from 'axios';

import store from '../store';

class ApiService {
    constructor() {
        this.service = axios.create({
            baseURL: process.env.REACT_APP_CORS_HEADER + process.env.REACT_APP_SERVER_API_URL + `/api`,
            headers: {
                'Content-Type': 'application/json'
            }
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

    signIn = (formData) => {
        return new Promise((resolve, reject) => {
            this.service.post('/login', formData).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        })
    }

    signUp = (formData) => {
        return new Promise((resolve, reject) => {
            this.service.post('/user', formData).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        })
    }

    pwdResetCreate = (email) => {
        return new Promise((resolve, reject) => {
            this.service.post('/password_reset/create', {
                email: email
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }

    pwdResetUpdate = (token, email, password, confPassword) => {
        return new Promise((resolve, reject) => {
            this.service.post('/password_reset/update', {
                reset_token: token,
                email: email,
                password: password,
                password_confirmation: confPassword
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }

    setTokenInHeader = (token) => {
        this.service.defaults.headers.common['Token'] = token;
    }

    removeTokenInHeader = () => {
        delete this.service.defaults.headers.common['Token'];
    }

    // get top session
    getTopSession = () => {
        return new Promise((resolve, reject) => {
            this.service.get('/session', {
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }
}

const service = new ApiService();

export default service;