import { queryBasicRecordview, queryAdvancedRecordview,getAreaTreeWithDevices, getWarnings} from '@/services/record';
import { message } from 'antd';

const judge = ({ code, msg }) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};
export default {
  namespace: 'Recordview',

  state: {
    basicGoods: [],
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
    advancedOperation4: [],
  },

  effects: {
    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(queryBasicRecordview, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *fetchAdvanced(_, { call, put }) {
      const response = yield call(queryAdvancedRecordview);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *fetchAreaTree({ payload }, { call, put }) {
      const response = yield call(getAreaTreeWithDevices);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'show',
        payload: {
          areaTree: root,
        },
      });
    },
    *fetchWarnings({ payload }, { call, put }) {
      const response = yield call(getWarnings, payload);
      if (!judge(response)) {
        return;
      }
      const warnings = response.data;
      yield put({
        type: 'show',
        payload: {
          ...warnings,
        },
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
