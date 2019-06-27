import { message } from 'antd';
import {
  getOrderTypes,
  getOrderStates,
  getOrderAreaTree,
  getOrderList,
} from '@/services/WorkOrder';

const judge = ({ code, msg }) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

const emptyState = {
  orderTypes: [], // 工单类型可选值列表
  orderStates: [], // 工单状态可选值列表
  orderList: [], // 工单列表
  orderListLength: 0, // 工单列表总条数
  orderAreaTree: [], // 工单区域树
};

export default {
  namespace: 'operationWorkOrder',
  state: emptyState,

  effects: {
    // eslint-disable-next-line no-unused-vars
    *fetchOrderTypes({ payload }, { call, put }) {
      const response = yield call(getOrderTypes);
      if (!judge(response)) {
        return;
      }
      const orderTypes = response.data;
      yield put({
        type: 'save',
        payload: {
          orderTypes,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchOrderStates({ payload }, { call, put }) {
      const response = yield call(getOrderStates);
      if (!judge(response)) {
        return;
      }
      const orderStates = response.data;
      yield put({
        type: 'save',
        payload: {
          orderStates,
        },
      });
    },

    *fetchOrderList({ payload }, { call, put }) {
      const response = yield call(getOrderList, payload);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          orderList: data.data,
          orderListLength: data.length,
        },
      });
    },

    *fetchOrderAreaTree({ payload }, { call, put }) {
      const response = yield call(getOrderAreaTree, payload);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          orderAreaTree: data,
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
  },
};
