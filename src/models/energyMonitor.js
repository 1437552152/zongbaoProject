import * as energyServices from '@/services/energyMonitor'
import { getAreaTree } from '@/services/area'

import { message } from 'antd'

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true
  }
  message.error(msg)
  return false
}

export default {
  namespace: 'energyServices',
  state: {
    areaTree: [],
    newMenuList: []
  },

  effects: {
    * getDataList ({ payload, callback }, { call }) {
      const response = yield call(energyServices.getDataList, payload)
      callback(response)
    },

    * postDataList ({ payload, callback }, { call }) {
      const response = yield call(energyServices.postDataList, payload)
      callback(response)
    },

    * fetchAreaTree ({ payload }, { call, put }) {
      const response = yield call(getAreaTree, payload)
      if (!judge(response)) {
        return
      }
      const root = response.data
      yield put({
        type: 'save',
        payload: {
          areaTree: root
        }
      })
    },

    * getNewMenuData ({ callback }, { call, put }) {
      const response = yield call(energyServices.getNewMenuData)
      callback(response)
      yield put({
        type: 'getNewList',
        payload: response
      })
    },

    * getScreen ({ callback }, { call }) {
      const response = yield call(energyServices.getScreen)
      callback(response)
    },

    * getScreenData ({ payload, callback }, { call }) {
      const response = yield call(energyServices.getScreenData, payload)
      callback(response)
    },

    * updataScreenData ({ payload, callback }, { call }) {
      const response = yield call(energyServices.updataScreenData, payload)
      callback(response)
    }

    // * getRoutes ({ callback }, { call }) {
    //   const response = yield call(energyServices.getRoutes)
    //   callback(response)
    // }
  },
  reducers: {
    save (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    getNewList (state, action) {
      return {
        ...state,
        newMenuList: action.payload.imc
      }
    }
  }
}
