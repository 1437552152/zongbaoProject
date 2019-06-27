/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import {
  getAllDevice,
  getDeviceTypeById,
  addDevice,
  updateDevice,
  delByDeviceId,
} from '@/services/MaintEqui';

import { message } from 'antd';

const judge = ({ code, msg }) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

const emptyState = {
  deviceTypes: [],
  deviceSubTypes: [],
};

export default {
  namespace: 'MaintEqui',

  state: emptyState,

  effects: {
    *fetchDeviceTypes({ payload }, { call, put }) {
      const resp = yield call(getDeviceTypeById, '1083');
      if (!judge(resp)) {
        return;
      }
      const { data } = resp;
      data.forEach(ele => {
        ele.name = ele.desp;
      });
      yield put({
        type: 'save',
        payload: {
          deviceTypes: data,
        },
      });
    },

    *fetchAllDeviceSubTypes({ payload }, { call, put }) {
      const resp = yield call(getAllDevice, '1083');
      if (!judge(resp)) {
        return;
      }
      const { data } = resp;
      yield put({
        type: 'save',
        payload: {
          deviceSubTypes: data,
        },
      });
    },

    *fetchDeviceSubTypesById({ payload }, { call, put }) {
      const resp = yield call(getDeviceTypeById, payload);
      if (!judge(resp)) {
        return;
      }
      const { data } = resp;
      yield put({
        type: 'save',
        payload: {
          deviceSubTypes: data,
        },
      });
    },

    *addDeviceSubType({ payload, callback }, { call }) {
      const resp = yield call(addDevice, payload);
      if (!judge(resp)) {
        return;
      }
      if (callback) {
        callback();
      }
    },

    *updateDeviceSubType({ payload, callback }, { call }) {
      const resp = yield call(updateDevice, payload);
      if (!judge(resp)) {
        return;
      }
      if (callback) {
        callback();
      }
    },

    *deleteDeviceSubType({ payload, callback }, { call }) {
      const resp = yield call(delByDeviceId, payload);
      if (!judge(resp)) {
        return;
      }
      if (callback) {
        callback();
      }
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
