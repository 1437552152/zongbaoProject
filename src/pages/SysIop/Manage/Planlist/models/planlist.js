import { getPlanList } from '@/services/operation';

export default {
  namespace: 'PlanList',
  state: {
    data: {},
  },

  effects: {
    *getPlanList({ payload, callback }, { call, put }) {
      const response = yield call(getPlanList, payload);
      console.log(response.data);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (response.code === 200) {
        callback(response);
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
