import axios from "axios";

const http = axios.create({
    baseURL: "https://rick-gpt.online",
    // baseURL: "http://localhost:5001",
    // timeout: 15000,
    headers: {
    }
});

http.interceptors.response.use(function (response) {
    return response;
}, function (err) {
    // if (err.response.status === 401 || err.response.status === 403 || err.response.status === 406) {
    //     window.localStorage.clear();
    //     window.location.href = "/";
    // }
    console.log(err)
    return Promise.reject(err);
});

export default http;