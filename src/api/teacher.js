import request from '@/utils/request'

export function upl(username, password) {
  return request({
    url: '/hart/kss/admin/login',
    method: 'post',
    data: {
      adminNo: username,
      pwd: password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/hart/kss/admin/exitLogin',
    method: 'get'
  })
}
