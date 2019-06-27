import { getAreaTree } from '@/services/area';
import { getSearchTree } from '@/services/homeMapindex';
import { getDeviceCountList } from '@/services/gkFirsthome';

import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

const emptyState = {
  deviceCountList: [],
  areaTree: [],
  buildTree: [],
  companyTree: [],
  searchTree: [],
};

export default {
  namespace: 'firsthome',

  state: emptyState,

  effects: {
    *fetchAreaTree({ payload }, { call, put }) {
      const response = yield call(getAreaTree, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          areaTree: root,
        },
      });
    },

    *fetchBuildTree({ payload }, { call, put }) {
      const response = yield call(getAreaTree, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          buildTree: root,
        },
      });
    },

    *fetchCompanyTree({ payload }, { call, put }) {
      const response = yield call(getAreaTree, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          companyTree: root,
        },
      });
    },

    *treeSearch({ payload }, { call, put }) {
      const response = yield call(getSearchTree, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          searchTree: root,
        },
      });
    },

    *fetchDeviceAllByAreaid({ payload, callback }, { call, put }) {
      // 获取设备汇总信息
      const resp = yield call(getDeviceCountList, payload);
      if (!judge(resp)) {
        return;
      }
      const deviceCountList = resp.data;

      yield put({
        type: 'save',
        payload: {
          deviceCountList,
        },
      });
      callback(resp.data);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        emptyState,
      };
    },
  },
};
