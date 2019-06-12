import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: {
    },
    progress: 0
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },

    SET_PROGRESS: (state, progress) => {
      state.progress = progress
    },

    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.validatePic).then(response => {
          const data = response.data
          console.log(data)
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          commit('SET_ROLES', data)
          commit('SET_NAME', data.nickName)
          commit('SET_AVATAR', data.picurl)
          // 存入缓存
          // localStorage.token = data.token
          localStorage.name = data.nickName
          localStorage.picurl = data.picurl
          localStorage.roles = data
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    getProgress({ commit }, progress) {
      console.log(progress)
      commit('SET_PROGRESS', progress)
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      // return new Promise((resolve, reject) => {
      var data = getInfo()
      getToken()
      console.log(data)
      // commit('SET_TOKEN', data.token)
      commit('SET_ROLES', data)
      commit('SET_NAME', data.name)
      commit('SET_AVATAR', data.picurl)
      // })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          // localStorage.removeItem('token')
          // localStorage.removeItem('name')
          // localStorage.removeItem('picurl')
          // localStorage.removeItem('roles')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        console.log('登出')
        commit('SET_TOKEN', '')
        removeToken()
        // localStorage.removeItem('token')
        // localStorage.removeItem('name')
        // localStorage.removeItem('picurl')
        // localStorage.removeItem('roles')
        resolve()
      })
    }
  }
}

export default user
