import { schedulelist } from '@/services/operation';

export default {
  namespace: 'workforceManagement',
  state: {
    data: [],
  },

  effects: {
    *schedulelist({ payload, callback }, { call, put }) {
      const response = yield call(schedulelist, payload);
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
