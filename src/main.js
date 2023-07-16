import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
 
Vue.use(VueAxios, axios)

// Agregamos la URL base de nuestra API
//axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.baseURL = 'mongodb+srv://MEVN-2023:8TLOdCd7c0ulMg9m@cluster0.ztd5zkf.mongodb.net/?retryWrites=true&w=majority';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
