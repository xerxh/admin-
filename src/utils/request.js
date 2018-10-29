import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
// import { getToken } from '@/utils/auth'
// const BASE_URL = 'http://h5h5.hartedu.com:8286'
// const BASE_URL = 'http://h5h5h5.hartedu.com:8286'
const BASE_URL = 'http://10.0.192.12:8286'

// 创建axios实例
const service = axios.create({
  baseURL: BASE_URL // api 的 base_url
  // timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.onUploadProgress = function(progressEvent) {
      var progress = Math.ceil((progressEvent.loaded / progressEvent.total) * 100)
      store.dispatch('getProgress', progress)
      console.log(progressEvent)
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    console.log('错误')
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    console.log(res.code)
    if (res.code !== 1) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 2 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 3) {
        console.log(res)
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      console.log('正常')
      return response.data
    }
  },
  error => {
    console.log(error)
    console.log('错误')
    console.log('err' + error) // for debug
    Message({
      message: error,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
