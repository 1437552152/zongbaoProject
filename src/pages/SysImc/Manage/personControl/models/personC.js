/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import {
  getAllPerson,
  getAllArea,
  addPerson,
  updatePerson,
  delByPersonId,
} from '@/services/personC';

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
  personList: [],
};

export default {
  namespace: 'personC',

  state: emptyState,

  effects: {
    *fetchAllArea({ payload }, { call, put }) {
      const resp = yield call(getAllArea, payload);
      if (!judge(resp)) {
        return;
      }
      let areaList = [];
      if (resp.code === 200) {
        areaList = resp.data;
      }
      yield put({
        type: 'save',
        payload: {
          areaList,
        },
      });
    },
    *fetchAllPerson({ payload }, { call, put }) {
      // 获取所有人员信息
      const resp = yield call(getAllPerson, payload);
      if (!judge(resp)) {
        return;
      }
      const personList = resp.data;
      personList.forEach((item, index) => {
        item.key = item.id;
        item.index = index;
      });

      yield put({
        type: 'save',
        payload: {
          personList,
        },
      });
    },
    *addthePerson({ payload, callback }, { call, put }) {
      // 新增人员信息
      const resp = yield call(addPerson, payload);
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

    *updatethePerson({ payload, callback }, { call, put }) {
      // 修改人员信息
      const resp = yield call(updatePerson, payload);
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

    *delthePerson({ payload, callback }, { call, put }) {
      // 删除人员信息
      const resp = yield call(delByPersonId, payload);
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
