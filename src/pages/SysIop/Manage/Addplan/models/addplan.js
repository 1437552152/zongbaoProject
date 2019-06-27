import { addPlan } from '@/services/operation';
import router from 'umi/router';
import { message } from 'antd';

export default {
  namespace: 'addPlan',
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
    *addPlan({ payload }, { call }) {
      console.log('123', payload);
      const response = yield call(addPlan, payload);
      if (response.code === 200) {
        message.success(response.msg);
        setTimeout(() => {
          router.push(`/operation/planlist`);
        }, 2000000000);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    },
  },
};
