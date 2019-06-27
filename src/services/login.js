import request from '@/utils/request'

// 获取用户权限   http://10.110.200.145:8080/services/cas/UserInfo/routes
export async function getRoutes () {
  return request(`/services/cas/UserInfo/routes`, {
    method: 'get',
    expirys: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取用户个人信息
export async function getUserInfo () {
  return request(`/services/security/authInfo`, {
    method: 'get',
    expirys: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
