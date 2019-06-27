/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { 
  getAllProcess,
  getAllArea,
  getnewProcess
} from '@/services/processApprovalS'

import { message } from 'antd'

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true
  }
  message.error(msg)
  return false
}

const emptyState={
  delcode:400,
  addcode:400,
  updatecode:400,
  areaList:[],
  deviceList: []
}

export default {
  namespace: 'processAS',

  state: emptyState,

  effects: {
    *fetchAllArea({ payload }, { call, put }){
      const resp = yield call(getAllArea, payload)
      if (!judge(resp)) {
        return
      }
      const areaList = resp.data

      yield put({
        type: 'save',
        payload: {
          areaList
        }
      })
    },
    *fetchAllProcess ({ payload }, { call, put }) {
      const resp = yield call(getAllProcess, payload)
      if (!judge(resp)) {
        return
      }
      const deviceList = resp.data
      // console.log(deviceList)
      yield put({
        type: 'save',
        payload: {
          deviceList
        }
      })
    },
    *getnewProcess({ payload, callback }, { call, put }) {
      const response = yield call(getnewProcess, payload);
      console.log(response.data);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (response.code === 200) {
        callback(response);
      }
    },
  },

  reducers: {
    save (state, {payload}) {
      return {
        ...state,
        ...payload
      }
    },
    clear (state, { payload }) {
      return {
        emptyState
      }
    },
  }
}
