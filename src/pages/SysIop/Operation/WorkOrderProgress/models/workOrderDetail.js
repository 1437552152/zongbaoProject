import { message } from 'antd';
import { getWorkOrderDetail, updateStep, getOrderProcessRecord } from '@/services/WorkOrder';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

export default {
  namespace: 'workOrderDetail',
  state: {
    data: {},
    orderProcessRecord: [], // 工单处理步骤详情列表
  },
  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(getWorkOrderDetail, payload);
      if (!judge(response)) {
        return;
      }

      const { data } = response;
      yield put({
        type: 'updateState',
        payload: { data },
      });
    },

    *fetchOrderProcessRecord({ payload }, { call, put }) {
      const response = yield call(getOrderProcessRecord, payload);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'updateState',
        payload: {
          orderProcessRecord: data,
        },
      });
    },

    *updateStep({ payload, callback }, { call }) {
      const response = yield call(updateStep, payload);
      if (!judge(response)) {
        return;
      }
      if (callback) {
        callback();
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
