import { message } from 'antd';
import {
  queryBasicProfile,
  getStepStep,
  getStepDetail,
  BigProcessNode,
  getStDetail,
  getAllProcess
} from '@/services/device';

const judge = ({ code, msg }) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

export default {
  namespace: 'processApprovalX',
  // state: emptyState,
  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
  },

  effects: {
    *clickProcessStep({ payload, callback }, { call, put }) {
      const response = yield call(getStepStep, payload);
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
           data
        },
      });
    },
    *clickProcessDetail({ payload}, { call, put }) {
      const response = yield call(getStepDetail, payload);
      if (!judge(response)) {
        return;
      }
      const detailData = response.data
      yield put({
        type: 'save',
        payload: {
          detailData
        },
      });
    },
    // 点击审批按钮 ==> 审批界面详情
    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(queryBasicProfile, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *BigProcessNode({ payload,callback }, { call, put }) {
      const response = yield call(BigProcessNode, payload);
      if (!judge(response)) {
        return;
      }
      console.log(response);
      const processCode = response.code;
      if(processCode===200){
        message.success('审核成功');
      }else{
        message.error('审核失败');
      }
      yield put({
        type: 'save',
        payload: {
          processCode,
        },
      });
      callback(processCode)
    },
    *fetcDetail({ payload ,callback}, { call, put }) {
      const response = yield call(getStDetail, payload);
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
           data
        },
      });
    },
    // 审批页面
    *fetchAllProcess ({ payload }, { call, put }) {
      const resp = yield call(getAllProcess, payload)
      if (!judge(resp)) {
        return
      }
      const deviceList = resp.data
      // console.log(deviceList)
      yield put({
        type: 'save',
        payload: {
          deviceList
        }
      })
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
