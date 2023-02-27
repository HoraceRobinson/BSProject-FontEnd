import axios from "axios";
export function request(config){
    const instance = axios.create({
        // 所有请求的BaseUrl
        baseURL:"http://localhost:3000",
        timeout:5000
    })
    return instance(config);
}