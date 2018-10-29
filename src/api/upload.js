import request from '@/utils/request'

export const uploadFileUrl = '/hart/kss/file/upload'
export const uploadSignatureUrl = '/hart/kss/file/getSignature'
export function uploadFile(params) {
  return request({
    url: uploadFileUrl,
    method: 'post',
    data: params
  })
}

export function uploadFileGet(token) {
  return request({
    url: uploadSignatureUrl,
    method: 'get',
    params: { token }
  })
}

