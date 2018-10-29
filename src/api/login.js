import request from '@/utils/request'

export function login(username, password, validatePic) {
  console.log(validatePic)
  return request({
    url: '/hart/kss/admin/login',
    method: 'post',
    data: {
      adminNo: username,
      pwd: password,
      code: validatePic
    }
  })
}

export function getInfo(token) {
  // 获取缓存
  // localStorage.getToken
  var data = {
    picurl: localStorage.picurl,
    roles: localStorage.roles,
    name: localStorage.name
  }
  return data
}

export function logout() {
  return request({
    url: '/hart/kss/admin/exitLogin',
    method: 'get'
  })
}
