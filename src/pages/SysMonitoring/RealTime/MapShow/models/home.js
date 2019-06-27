/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { getAreaTree } from '@/services/area';
import { getDeviceTypes } from '@/services/device';
import {
  getSearchTree,
  fetchAjDeviceByarea,
  fetchmidperson,
  fetchAjwxperson,
  fetchDevicePointByarea,
  fetchmidPoint,
  queryAjhomedevice,
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
  deviceList: [],
  zbpersonList: [],
  pdpersonList: [],
  devicePointList: [],
  zbpersonPointList: [],
  pdpersonPointList: [],
  wxpersonList: [],
  supportTypes: [],
  deviceCountList: [],
  mainCountList: [],
  personCountList: [],
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
      const response = yield call(fetchAjDeviceByarea, payload);
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

    *fetchzhPerson({ payload }, { call, put }) {
      const response = yield call(fetchmidperson, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          zbpersonList: root,
        },
      });
    },

    *fetchpdPerson({ payload }, { call, put }) {
      const response = yield call(fetchmidperson, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          pdpersonList: root,
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

    *fetchzhPoint({ payload }, { call, put }) {
      const response = yield call(fetchmidPoint, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          zbpersonPointList: root,
        },
      });
    },

    *fetchpdPoint({ payload }, { call, put }) {
      const response = yield call(fetchmidPoint, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          pdpersonPointList: root,
        },
      });
    },

    *fetchwxPerson({ payload }, { call, put }) {
      const response = yield call(fetchAjwxperson, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          wxpersonList: root,
        },
      });
    },

    *queryHomeDevice({ payload }, { call, put }) {
      const response = yield call(queryAjhomedevice);
      const root = response;
      yield put({
        type: 'save',
        payload: {
          deviceCountList: root,
        },
      });
    },

    *queryHomeMain({ payload }, { call, put }) {
      const response = yield call(queryhomemain, payload);
      const root = response;
      const mainCountList = [];
      root.forEach(item => {
        item.name = item.DEVICESTATUS;
        item.value = item.DEVICE_COUNT;
        item.color = item.COLOR;
        mainCountList.push(item);
      });
      yield put({
        type: 'save',
        payload: {
          mainCountList,
        },
      });
    },

    *queryHomePerson({ payload }, { call, put }) {
      const response = yield call(queryhomeperson);
      const root = response;
      const personCountList = [];
      root.forEach(item => {
        if (item.PERSON !== '总人数') {
          item.name = item.PERSON;
          item.value = item.PERSON_COUNT;
          personCountList.push(item);
        }
      });
      yield put({
        type: 'save',
        payload: {
          personCountList,
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
