import { message } from 'antd';
import {
  getOrderTypes,
  getOrderStates,
  getOrderDetail,
  getOrderAreaTree,
  getOrderList,
  getOrderResultDetail,
  getDictList,
  recordWorkOrder,
  getOrderRecordDetail,
  checkOrder,
} from '@/services/WorkOrder';
import { uploadTicket, upload } from '@/services/file';

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
  orderDetail: null, // 工单详情
  orderList: [], // 工单列表
  orderListLength: 0, // 工单列表总条数
  orderAreaTree: [], // 工单区域树
  orderResultDetail: null, // 派工单结果录入时需要显示的工单详情
  repairStateOptions: [], // 维修状态可选值列表
  repairLevelOptions: [], // 维修级别可选值列表
  repairResultOptions: [], // 维修结果可选值列表
  componentTypeOptions: [], // 部件类型可选值列表
  ticketTypeOptions: [], // 工作票和操作票可选值列表
  orderRecordDetail: null, // 工单录入详情
};

export default {
  namespace: 'workOrder',
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

    *fetchOrderDetail({ payload, callback }, { call, put }) {
      const response = yield call(getOrderDetail, payload);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      if (callback) {
        callback(data);
      }
      yield put({
        type: 'save',
        payload: {
          orderDetail: data,
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

    *fetchOrderResultDetail({ payload, callback }, { call, put }) {
      const response = yield call(getOrderResultDetail, payload);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      if (callback) {
        callback(data);
      }
      yield put({
        type: 'save',
        payload: {
          orderResultDetail: data,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchRepairStateOptions({ payload }, { call, put }) {
      const response = yield call(getDictList, 'REPLACEREPAIRSTATUS');
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          repairStateOptions: data,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchRepairLevelOptions({ payload }, { call, put }) {
      const response = yield call(getDictList, 'REPAIRLEVEL');
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          repairLevelOptions: data,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchRepairResultOptions({ payload }, { call, put }) {
      const response = yield call(getDictList, 'REPAIRRESULT');
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          repairResultOptions: data,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchRepairComponentTypeOptions({ payload }, { call, put }) {
      const response = yield call(getDictList, 'PARTTYPE');
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          componentTypeOptions: data,
        },
      });
    },

    *recordWorkOrder({ payload, callback }, { call }) {
      const response = yield call(recordWorkOrder, payload);
      if (!judge(response)) {
        return;
      }
      if (callback) {
        callback();
      }
    },

    // eslint-disable-next-line no-unused-vars
    *fetchTicketTypeOptions({ payload }, { call, put }) {
      const response = yield call(getDictList, 'WORKTICKET');
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          ticketTypeOptions: data,
        },
      });
    },

    // 上传操作票
    *uploadOperationTicket({ payload, callback }, { call }) {
      const params = { ...payload, type: '1' };
      const response = yield call(uploadTicket, params);
      if (!judge(response)) {
        return;
      }
      if (callback) {
        callback();
      }
    },

    // 上传工作票
    *uploadWorkTicket({ payload, callback }, { call }) {
      const params = { ...payload, type: '2' };
      const response = yield call(uploadTicket, params);
      if (!judge(response)) {
        return;
      }
      if (callback) {
        callback();
      }
    },

    *uploadFile({ payload, callback }, { call }) {
      const p = { files: [payload], name: 'file' };
      const response = yield call(upload, p);
      if (callback) {
        callback(response.entity);
      }
    },

    *fetchOrderRecordDetail({ payload, callback }, { call, put }) {
      const response = yield call(getOrderRecordDetail, payload);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      if (callback) {
        callback(data);
      }
      yield put({
        type: 'save',
        payload: {
          orderRecordDetail: data,
        },
      });
    },

    *checkOrder({ payload, callback }, { call }) {
      const response = yield call(checkOrder, payload);
      if (!judge(response)) {
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

    clear() {
      return {
        emptyState,
      };
    },
  },
};
