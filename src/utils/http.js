import axios from "axios";
import { BASE_URL, HTTP_TIMEOUT } from "@src/config";
import Cookies from 'js-cookie';

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = HTTP_TIMEOUT;
axios.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' };

// 添加请求拦截器
axios.interceptors.request.use(
    config => {
        if (config.url === "/login") {
            return config;
        }
        if (Cookies.get('token')) {
            // 为除了登陆的请求在header里添加token
            config.headers.Authorization = Cookies.get('token')
            return config;
        } else {
            return Promise.reject(new Error("token失效"));
        }
    },
    error => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export default (config = {}) => {
    if (config.method === "post") {
        config = Object.assign({
            headers: {
                'Content-Type': 'application/json'
            }
        }, config)
    }
    return new Promise((resolve, reject) => {
        axios({
            ...config,
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error)
        })
    })
}