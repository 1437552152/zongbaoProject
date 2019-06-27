import { planNodelist, planCreate } from '@/services/device';
import { message } from 'antd';
import router from 'umi/router';

export default {
  namespace: 'SelfhelpLink',
  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
    },
  },

  effects: {
    *getPlanNodelist({ payload }, { call, put }) {
      const response = yield call(planNodelist, payload);
      console.log('response', response);
      if (response.code === 200) {
        let list = [];
        list = response.data;
        const result = {
          list,
          pagination: {
            total: list.length || 0,
            current: 1,
            pageSize: 100,
          },
        };
        yield put({
          type: 'save',
          payload: result,
        });
      } else {
        message.error(response.msg);
      }
    },
    *planCreate({ payload }, { call }) {
      console.log('payload==>', payload);
      const response = yield call(planCreate, payload);
      if (response.code === 200) {
        message.success(response.msg);
        router.push(`/monitoring/realtime/equipment/${payload.alarmId}?type=${payload.type}`);
      } else {
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
