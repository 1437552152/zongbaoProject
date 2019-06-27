import { message } from 'antd';
import { getAllProcess, queryBasicProfile, ProcessNode } from '@/services/device';

const judge = ({ code, msg }) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

export default {
  namespace: 'processAS1',
  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
  },

  effects: {
    *fetchAllProcess({ payload }, { call, put }) {
      const resp = yield call(getAllProcess, payload);
      if (!judge(resp)) {
        return;
      }
      const deviceList = resp.data;
      yield put({
        type: 'save',
        payload: {
          deviceList,
        },
      });
    },
    // 点击审批按钮 ==> 审批界面详情
    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(queryBasicProfile, payload);
      if (!judge(response)) {
        return;
      }
      const stepData = response.data;
      console.log(stepData)
      yield put({
        type: 'save',
        payload: { stepData },
      });
    },
    *fetchProcessNode({ payload ,callback}, { call, put }) {
      const response = yield call(ProcessNode, payload);
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
      callback(processCode);
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
