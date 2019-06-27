import { getAlarmInfo, getAlarmlist, getMonitorVideos } from '@/services/home';

export default {
  namespace: 'realtimehome',

  state: {
    statisticsData: [],
    alarmList: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },

    relateDevice: {},

    videos: [],
    selectDevice: null,
  },

  effects: {
    *getAlarmStatistics({ payload }, { put, call }) {
      const response = yield call(getAlarmInfo, payload);
      const { code, ...data } = response;
      if (code === 200) {
        yield put({
          type: 'updateState',
          payload: { statisticsData: data.data || [] },
        });
      }
    },

    *queryAlarmList({ payload }, { put, call }) {
      const response = yield call(getAlarmlist, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'updateState',
          payload: {
            alarmList: data.data || [],
            pagination: {
              page: data.page,
              pageSize: data.pageSize,
              total: data.length,
            },
          },
        });
      }
    },

    *queryMonitorVideo({ payload }, { put, call }) {
      const response = yield call(getMonitorVideos, payload);
      const { code, ...data } = response;
      if (code === 200) {
        // 只取前4条数据
        yield put({
          type: 'updateState',
          payload: { videos: data.data || [] },
        });
      }
    },
  },

  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
