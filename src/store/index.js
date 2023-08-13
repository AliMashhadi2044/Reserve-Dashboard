import axios from 'axios'
import { createStore } from 'vuex'
import { authToken } from '../assets/js/init'

export default createStore({
  state: {
    userInfo: {},
    isAuthenticated: true,
    token: ''
  },
  getters: {},
  mutations: {
    login(state, token) {
      state.isAuthenticated = true
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['x-access-token'] = `${token}`
    },
    logout(state) {
      state.isAuthenticated = false
      state.token = ''
      localStorage.removeItem('token')
      axios.defaults.headers.common['x-access-token'] = ''
    }
  },
  actions: {
    onStart(context) {
      const token = localStorage.getItem('token')
      axios.defaults.headers.common['x-access-token'] = `${token}`

      if (token) {
        authToken(token)
          .then((res) => {
            if (res.valid) context.commit('login', token)
            else context.commit('logout')
          })
          .catch((err) => {
            context.commit('logout')
            console.log(err)
          })
      } else {
        context.commit('logout')
      }
    },
    setTokenHeadder() {
      const token = localStorage.getItem('token')
      axios.defaults.headers.common['x-access-token'] = `${token}`
    }
  },
  modules: {}
})
