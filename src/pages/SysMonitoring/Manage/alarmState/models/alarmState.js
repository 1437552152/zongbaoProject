/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import {
  getAllDevice1,
  getAllArea,
  addDevice,
  updateDevice,
  delByDeviceId,
} from '@/services/MaintEqui';
import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

const emptyState = {
  delcode: 400,
  addcode: 400,
  updatecode: 400,
  areaList: [],
  deviceList: [],
};

export default {
  namespace: 'alarmState',

  state: emptyState,

  effects: {
    *fetchAllArea({ payload }, { call, put }) {
      const resp = yield call(getAllArea, payload);
      if (!judge(resp)) {
        return;
      }
      const areaList = resp.data;

      yield put({
        type: 'save',
        payload: {
          areaList,
        },
      });
    },
    *fetchAllDevice({ payload }, { call, put }) {
      // 获取所有设备信息
      const resp = yield call(getAllDevice1, payload);
      if (!judge(resp)) {
        return;
      }
      const deviceList = resp.data;
      deviceList.forEach(item => {
        item.key = item.id;
      });

      yield put({
        type: 'save',
        payload: {
          deviceList,
        },
      });
    },
    *addtheDevice({ payload, callback }, { call, put }) {
      // 新增设备信息
      const resp = yield call(addDevice, payload);
      if (!judge(resp)) {
        return;
      }
      const addcode = resp.code;
      yield put({
        type: 'save',
        payload: {
          addcode,
        },
      });
      callback(resp.code);
    },

    *updatetheDevice({ payload, callback }, { call, put }) {
      // 修改设备信息
      const resp = yield call(updateDevice, payload);
      if (!judge(resp)) {
        return;
      }
      const updatecode = resp.code;

      yield put({
        type: 'save',
        payload: {
          updatecode,
        },
      });
      callback(resp.code);
    },

    *deltheDevice({ payload, callback }, { call, put }) {
      // 删除设备信息
      const resp = yield call(delByDeviceId, payload);
      if (!judge(resp)) {
        return;
      }
      const delcode = resp.code;

      yield put({
        type: 'save',
        payload: {
          delcode,
        },
      });
      callback(resp.code);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state, { payload }) {
      return {
        emptyState,
      };
    },
  },
};
