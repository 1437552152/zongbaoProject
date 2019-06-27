/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import {
  getAllMainConfig,
  addMainConfig,
  updateMainConfig,
  delByMainConfigId,
} from '@/services/mainConfig';

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
  mainConfigList: [],
};

export default {
  namespace: 'mainConfigModel',

  state: emptyState,

  effects: {
    *fetchAllMain({ payload }, { call, put }) {
      const resp = yield call(getAllMainConfig, payload);
      if (!judge(resp)) {
        return;
      }
      const mainConfigList = resp.data;

      yield put({
        type: 'save',
        payload: {
          mainConfigList,
        },
      });
    },

    *addMainConfig({ payload, callback }, { call, put }) {
      // 新增设备信息
      const resp = yield call(addMainConfig, payload);
      if (!judge(resp)) {
        return;
      }
      const addcode = resp.code;
      if (addcode === 200) {
        message.success(resp.msg);
      } else {
        message.error(resp.msg);
      }
      yield put({
        type: 'save',
        payload: {
          addcode,
        },
      });
      callback(resp.code);
    },

    *updateMainConfig({ payload, callback }, { call, put }) {
      // 修改设备信息
      const resp = yield call(updateMainConfig, payload);
      if (!judge(resp)) {
        return;
      }
      const updatecode = resp.code;
      if (updatecode === 200) {
        message.success(resp.msg);
      } else {
        message.error(resp.msg);
      }
      yield put({
        type: 'save',
        payload: {
          updatecode,
        },
      });
      callback(resp.code);
    },

    *delMainConfig({ payload, callback }, { call, put }) {
      // 删除设备信息
      const resp = yield call(delByMainConfigId, payload);
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
