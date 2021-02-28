import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    SET_USER_DATA (state, userData) {
      state.user = userData
      sessionStorage.setItem('user', JSON.stringify(userData))
      /*
      axios.defaults.headers.common['auth-token'] = `Bearer ${
        userData.token
      }`
      */
    },
    CLEAR_USER_DATA (state) {
      sessionStorage.removeItem('user')
      location.reload()
      state.user = null
    }
  },

  actions: {
     login({ commit }, credentials) {
      return axios({
        method: "post",
        url: "//localhost:4040/api/user/login",
        headers: {},
        data: {
          email: credentials.email,
          password: credentials.password,
        },
      })
      .then(({ response }) => {
        console.log('Here 44') 
        console.log(response)
        commit('SET_USER_DATA', response)
      })
      .catch((err) => {
          console.log('Login error')
          console.log(err);
      });
    },
    

    /*
    login ({ commit }, credentials) {
      return axios
        .post('//localhost:4040/api/user/login', credentials)
        .then(({ data }) => {
          console.log(data)
          console.log('Here')
          commit('SET_USER_DATA', data)
        })
    },
    */
    

    logout ({ commit }) {
      commit('CLEAR_USER_DATA')
    }
  },
  getters: {
    loggedIn (state) {
      console.log(!!state.user)
      console.log(state.user)

      return !!state.user
    }
  }
})
