import { routerRedux } from 'dva/router'
import { stringify } from 'qs'
import { message } from 'antd'
import { login } from '@/services/security'
import { getPageQuery } from '@/utils/utils'
import { reloadAuthorized } from '@/utils/Authorized'
import * as loginServices from '@/services/login'

export default {
  namespace: 'login',

  state: {
    menuList: {},
    initialStatus:0,
    status: undefined
  },

  effects: {
    * login ({ payload }, { call, put }) {
      const response = yield call(login, payload)
      console.log('======login==', response)
      if (response) {
        let isSuccess = false
        switch (response.status) {
          case 400: {
            message.error('账号不存在或密码错误!')
            break
          }
          case 409: {
            message.error('账号状态无效，请联系管理员启用账户后重新登录!')
            break
          }
          case 403: {
            message.error('无权操作!')
            break
          }
          case 200: {
            isSuccess = true
            break
          }
          default:
            break
        }
        // localStorage.setItem('username', payload.username)
        // Login successfully
        if (isSuccess) {
          reloadAuthorized()
          const urlParams = new URL(window.location.href)
          const params = getPageQuery()
          let { redirect } = params
          if (redirect) {
            const redirectUrlParams = new URL(redirect)
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length)
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1)
              }
            } else {
              redirect = null
            }
          }
          const { sysName } = process.env
          const defPath = sysName ? `/${sysName}` : '/home'
          yield put(routerRedux.replace(redirect || defPath))
        }
      }
    },

    * logout (_, { put }) {
      localStorage.removeItem('username')
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest'
        }
      })
      reloadAuthorized()
      const { redirect } = getPageQuery()
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href
            })
          })
        )
      }
    },
    * goLoginPage (_, { put }) {
      const { redirect } = getPageQuery()
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href
            })
          })
        )
      }
    },

    * getUserInfo ({ callback }, { call }) {
      const response = yield call(loginServices.getUserInfo)
      callback(response)
    },

    * getRoutes ({ callback }, { call, put }) {
      const response = yield call(loginServices.getRoutes)
      callback(response)
      yield put({
        type: 'getMenuList',
        payload: response!==undefined?response.data:{}
      })
    },
    * newLoginOut (_, { put }) {
      yield put({
        type: 'getout',
      })
    },
  },

  reducers: {
    changeLoginStatus (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    getMenuList (state, action) {
      return {
        ...state,
        newMenuList: action.payload,
        initialStatus:1
      }
    },
    getout (state) {
      return {
        ...state,
        initialStatus:0
      }
    },
  }
}
