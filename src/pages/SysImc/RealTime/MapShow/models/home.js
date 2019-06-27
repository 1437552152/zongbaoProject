/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { getAreaTree } from '@/services/area';
import { getDeviceTypes } from '@/services/device';
import {
  getSearchTree,
  fetchDeviceByarea,
  fetchDeviceByareaType,
  fetchDevicePointByarea,
  fetchmidperson,
  fetchwxperson,
  queryhomedevice,
  queryhomemain,
  queryhomeperson,
} from '@/services/homeMapindex';
import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

const emptyState = {
  areaTree: [],
  buildTree: [],
  companyTree: [],
  searchTree: [],
  devicePointList: [],
  supportTypes: [],
  deviceListfirst: [],
};

export default {
  namespace: 'home',

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

    *fetchDeviceByareaAndtype({ payload }, { call, put }) {
      const response = yield call(fetchDeviceByarea, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          deviceList: root,
        },
      });
    },

    *fetchDTypeByareaAndtype({ payload }, { call, put }) {
      const response = yield call(fetchDeviceByareaType, payload);
      yield put({
        type: 'save',
        payload: {
          deviceListfirst: response,
        },
      });
    },

    *fetchDevicePoint({ payload }, { call, put }) {
      const response = yield call(fetchDevicePointByarea, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          devicePointList: root,
        },
      });
    },

    *fetchDeviceType({ payload }, { call, put }) {
      const resp = yield call(getDeviceTypes);
      const supportTypes = resp.data;
      yield put({
        type: 'save',
        payload: {
          supportTypes,
        },
      });
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
