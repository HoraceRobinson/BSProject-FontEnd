import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        islogin: false,
        currentid: 0,
        currentuser: '',
        currentsex: '',
        currentemail: '',
        currentphone: '',
        currentava: require('@/assets/logo/男.png'),
        currentprojid: 0,
        currentprojname: '',
        currenttype: '',
        video: 0,
        videoname: ''
    },
    mutations: {
        changestate(state, data){
            state.currentid = data.id;
            state.currentuser = data.username;
            state.currentsex = data.sex;
            state.currentemail = data.email;
            state.currentphone = data.phone;
            state.islogin = true;
        },
        changeproj(state, data){
            state.currentprojid = data.project_id;
            state.currentprojname = data.project_name;
        },
        settask(state){
            state.currenttype = 'task';
        },
        setproj(state){
            state.currenttype = 'project';
        },
        setpic(state){
            state.video = 0;
        },
        setvideo(state, data){
            state.video = 1
            state.videoname = data.name
        },
        exit(state){
            state.islogin = false;
            state.currentid = 0;
            state.currentsex = '';
            state.currentemail = '';
            state.currentphone = '';
            state.currentuser = '';
            state.currentsex = '';
            state.currentprojid = 0;
            state.currentprojname = '';
            state.currenttype = '';
        },
    }
})