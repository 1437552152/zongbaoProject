import request from '@/utils/request'

import api from '../../mock/testMenu'

// 所有接口get
export async function getDataList (val) {
  return request(`/services/monitor/home/thirdInterface?url=${val}`, {
    method: 'get',
    expirys: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 所有接口post
export async function postDataList (val) {
  return request(
    `/services/monitor/home/thirdInterfacePost?Q=url_S_EQ=${val.url}`,
    {
      method: 'post',
      expirys: true,
      body: JSON.stringify(val.params),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

// 路由权限列表
export async function getNewMenuData () {
  return api['GET /api/getTestMenu']
}

// 信息屏列表获取
export async function getScreen () {
  return request(`/services/monitor/device/list?Q=type_EQ=1002`, {
    method: 'get',
    expirys: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 信息屏内容获取
export async function getScreenData (val) {
  return request(`/services/monitor/device/get/${val}`, {
    method: 'get',
    expirys: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 更新信息屏内容
export async function updataScreenData (val) {
  return request(`/services/monitor/device/update`, {
    method: 'put',
    expirys: true,
    body: JSON.stringify(val),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
