import {
  getnewProcess,
  addProcess,
  flowstep,
  flowstepUpdate,
  flowstepDelete,
  getGroupData,
  listBindPersonGroup,
  flowstepCreate,
  deteleProcess,
  commitstep,
} from '@/services/operation';
import { message } from 'antd';

export default {
  namespace: 'newProcess',
  state: {
    data: {},
  },

  effects: {
    // 得到流程树
    *getnewProcess({ payload, callback }, { call, put }) {
      const response = yield call(getnewProcess, payload);
      console.log(response.data);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (response.code === 200) {
         callback(response);
      }else{
        message.error(response.msg);
      }
    },
    // 增加流程
    *addProcess({ payload, callback }, { call }) {
      const response = yield call(addProcess, payload);
      if (response.code === 200) {
        callback(response);
      }else{
        message.success(response.msg);
      }
    },

    // 删除流程
    *deteleProcess({ payload, callback }, { call }) {
      const response = yield call(deteleProcess, payload);
      if (response.code === 200) {
        message.success(response.msg);
        callback();
      } else {
        message.error(response.msg);
      }
    },

    // 得到步骤
    *flowstep({ payload, callback }, { call }) {
      const response = yield call(flowstep, payload);
      if (response.code === 200) {
        callback(response);
      }
    },
    // 更新步骤
    *flowstepUpdate({ payload, callback }, { call }) {
      const response = yield call(flowstepUpdate, payload);
      if (response.code === 200) {
        message.success(response.msg);
        callback();
      }else{
       message.error(response.msg);
      }
    },
    // 删除步骤
    *flowstepDelete({ payload, callback }, { call }) {
      const response = yield call(flowstepDelete, payload);
      if (response.code === 200) {
        message.success(response.msg);
        callback();
      }else{
        message.error(response.msg);
      }
    },
    // 新增步骤
    *flowstepCreate({ payload, callback }, { call }) {
      const response = yield call(flowstepCreate, payload);
      if (response.code === 200) {
        message.success(response.msg);
        callback();
      } else {
        message.error(response.msg);
      }
    },
    // 提交步骤审核
    *commitstep({ payload, callback }, { call }) {
      const response = yield call(commitstep, payload);
      if (response.code === 200) {
        message.success(response.msg);
        callback();
      } else {
        message.error(response.msg);
      }
    },

    // 获得组数据
    *getGroupData({ payload, callback }, { call }) {
      const response = yield call(getGroupData, payload);
      if (response.code === 200) {
        callback(response);
      }else{
        message.error(response.msg);
      }
    },

    // 获得组数据
    *listBindPersonGroup({ payload, callback }, { call }) {
      const response = yield call(listBindPersonGroup, payload);
      if (response.code === 200) {
        callback(response);
      }else{
        message.error(response.msg);
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
