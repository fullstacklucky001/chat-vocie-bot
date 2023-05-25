import axios from 'axios';

import { SIGNOUT } from '../actions/config';
import store from '../store';

class AuthService {
    constructor() {
        this.service = axios.create({
            baseURL: process.env.REACT_APP_SERVER_API_URL + `/api/users`,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        this.service.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err.response.status === 401) {
                    store.dispatch({ type: SIGNOUT });
                }
                return Promise.reject(err);
            }
        )
    }

    loadUser = () => {
        return new Promise((resolve, reject) => {
            this.service.get('/user').then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }

    signIn = (formData) => {
        return new Promise((resolve, reject) => {
            this.service.post('/signin', formData).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        })
    }

    signUp = (formData) => {
        return new Promise((resolve, reject) => {
            this.service.post('/signup', formData).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }

    signInGoogle = (tokenRes) => {
        return new Promise((resolve, reject) => {
            this.service.post('/signin/google', {
                googleToken: tokenRes
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }

    signUpGoogle = (tokenRes, country, role) => {
        return new Promise((resolve, reject) => {
            this.service.post('/signup/google', {
                googleToken: tokenRes,
                country: country,
                role: role
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }

    signOut = () => {
        return new Promise((resolve, reject) => {
            this.service.post('/signout').then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }

    setTokenInHeader = (token) => {
        this.service.defaults.headers.common['x-auth-token'] = token;
    }

    removeTokenInHeader = () => {
        delete this.service.defaults.headers.common['x-auth-token'];
    }
}

const service = new AuthService();

export default service;