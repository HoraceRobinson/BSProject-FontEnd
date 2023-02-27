import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import router from'./router'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.css'
import axios from "axios";
import Vuex from "vuex"
import store from "./store"
// import picture from  "vue-picture-bd-marker"
axios.defaults.url='/api'
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);
// Vue.use(picture)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
