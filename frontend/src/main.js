import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import axios from 'axios'
import vSelect from 'vue-select'
import Multiselect from 'vue-multiselect'


import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-select/dist/vue-select.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.component('v-select', vSelect)
Vue.component('multiselect', Multiselect)


new Vue({
  router,
  store,

  created () {
    const userString = sessionStorage.getItem('user')  
    if (userString != undefined|| userString) {
      const userData = JSON.parse(userString)
      this.$store.commit('SET_USER_DATA', userData)
    }
    axios.interceptors.response.use(
      (response) => {return response},
      error => {
        if (error.response.status === 401) {
          this.$store.dispatch('logout')
        }
        return Promise.reject(error)
      }
    )
  },

  render: h => h(App)
}).$mount('#app')