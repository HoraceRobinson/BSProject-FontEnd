import {request} from "@/utils/index";
export function addproj(project_name, project_type, project_info, createdtime, user_id){
    return request({
        url: '/project/addproj',
        method: 'POST',
        params:{
            project_name, project_type, project_info, createdtime, user_id
        }
    })
}

export function getallproj(user_id){
    return request({
        url: '/project/getallproj',
        method: 'GET',
        params:{
            user_id
        }
    })
}

export function addtags(project_id, tags){
    return request({
        url: '/project/addtags',
        method: 'POST',
        params:{
            project_id, tags
        }
    })
}

export function maxprojid(user_id){
    return request({
        url: '/project/maxprojid',
        method: 'GET',
        params:{
            user_id
        }
    })
}

export function gettags(project_id){
    return request({
        url: '/project/gettags',
        method: 'GET',
        params:{
            project_id
        }
    })
}

export function changetags(project_id, tags, project_info){
    return request({
        url: '/project/changetags',
        method: 'POST',
        params:{
            project_id, tags, project_info
        }
    })
}

export function uploadfile(file){
    return request({
        url: '/project/uploadfile',
        method: 'POST',
        params:{
            file
        }
    })
}

export function deletefile(file){
    return request({
        url: '/project/deletefile',
        method: 'POST',
        params:{
            file
        }
    })
}

export function changefiles(files, project_id, project_type){
    return request({
        url: '/project/changefiles',
        method: 'POST',
        params:{
            files, project_id, project_type
        }
    })
}

export  function getfiles(project_id){
    return request({
        url: '/project/getfiles',
        method: 'GET',
        params: {
            project_id
        }
    })
}

export function getvideofiles(project_id){
    return request({
        url: '/project/getvideofiles',
        method: 'GET',
        params: {
            project_id
        }
    })
}

export function showwork(user_id){
    return request({
        url: '/project/getworkspace',
        method: 'GET',
        params: {
            user_id
        }
    })
}

export  function updatework(user_id, project_id, work_name){
    return request({
        url: '/project/updatework',
        method: 'POST',
        params: {
            user_id, project_id, work_name
        }
    })
}

export function savelabel(project_id, img_url, alldata){
    return request({
        url: '/project/savelabel',
        method: 'POST',
        data: {
            project_id, img_url, alldata
        }
    })
}

export function getlabel(project_id, img_url){
    return request({
        url: '/project/getlabel',
        method: 'GET',
        params: {
            project_id, img_url
        }
    })
}

export function settask(project_id){
    return request({
        url: '/project/settask',
        method: 'POST',
        params: {
            project_id
        }
    })
}

export function saveJSON(img_name, allInfo, imageinfo, filename, time){
    return request({
        url: '/project/saveJSON',
        method: 'POST',
        data: {
            img_name, allInfo, imageinfo, filename, time
        }
    })
}

export function getuptask(user_id){
    return request({
        url: '/project/getuptask',
        method: 'GET',
        params: {
            user_id
        }
    })
}

export function getmytask(user_id){
    return request({
        url: '/project/getmytask',
        method: 'GET',
        params: {
            user_id
        }
    })
}

export function getonlinetask(){
    return request({
        url: '/project/getonlinetask',
        method: 'GET',
        params: {

        }
    })
}

export function getusername(){
    return request({
        url: '/project/getusername',
        method: 'GET',
        params: {
        }
    })
}

export function updatetask(state, co_user, project_id){
    return request({
        url: '/project/updatetask',
        method: 'POST',
        params: {
            state, co_user, project_id
        }
    })
}

export function updatestate(project_id, state){
    return request({
        url: '/project/updatestate',
        method: 'POST',
        params: {
            project_id, state
        }
    })
}

export function endtask(finished_time, project_id, state){
    return request({
        url: '/project/endtask',
        method: 'POST',
        params: {
            finished_time, project_id, state
        }
    })
}

export function savevideopictures(imgdata, videoname, project_id){
    return request({
        url: '/project/savevideopictures',
        method: 'POST',
        data: {
            imgdata, videoname, project_id
        }
    })
}

export function deleteproj(project_id){
    return request({
        url: '/project/deleteproj',
        method: 'POST',
        params: {
            project_id
        }
    })
}

export function getvideoname(project_id){
    return request({
        url: '/project/getvideoname',
        method: 'GET',
        params: {
            project_id
        }
    })
}

export function getallfiles(){
    return request({
        url: '/project/getallfiles',
        method: 'GET',
        params: {

        }
    })
}

export function saveprojVOC(project_id){
    return request({
        url: '/project/saveprojVOC',
        method: 'POST',
        params: {
            project_id
        }
    })
}

export function  saveprojCOCO(project_id){
    return request({
        url: '/project/saveprojCOCO',
        method: 'POST',
        params: {
            project_id
        }
    })
}