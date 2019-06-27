import { recommondlist, planCreate } from '@/services/device';
import { message } from 'antd';
import router from 'umi/router';
export default {
  namespace: 'recommendationLinkage',
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
    *getRecommondlistlist({ payload }, { call, put }) {
      const response = yield call(recommondlist, payload);
       if (response.code === 200) {
        let list = [];
        list = response.data;
        if(list.length===0){
          message.error("暂无数据")
        }
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
    *planCreate({ payload, callback}, { call, put, select }) {
      const response = yield call(planCreate, payload);
      if (response.code === 200) {
        message.success(response.msg);
        router.push(`/monitoring/realtime/equipment/${payload.alarmId}?type=${payload.type}`);
      } else {
        message.error(response.msg);
      }
      callback();
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
