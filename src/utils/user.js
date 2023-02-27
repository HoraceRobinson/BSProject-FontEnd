import {request} from "@/utils/index"
export function register(username, password, sex, email, phone){
    return request({
        url: '/register',
        method: 'POST',
        params: {
            username, password, sex, email, phone
        }
    })
}
export function login(username, password){
    return request({
        url: '/login',
        method: 'POST',
        params: {
            username, password
        }
    })
}
export function edituser(id, username, sex, email, phone){
    return request({
        url: '/edituser',
        method: 'POST',
        params: {
            id, username, sex, email, phone
        }
    })
}