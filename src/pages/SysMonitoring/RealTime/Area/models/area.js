import { getBuildingErrorInfo, getDeviceByFloor } from '@/services/area';
import { getBg } from '@/utils/area';
import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.destroy();
  message.error(msg);
  return false;
};

const emptyState = {
  bg: '',
  defaultIndex: 0,
  floorList: [],
  deviceList: [],
};

export default {
  namespace: 'area',

  state: emptyState,

  effects: {
    *fetchFloorList({ payload, callback }, { call, put }) {
      // 获取楼层列表
      const resp = yield call(getBuildingErrorInfo, payload);
      if (!judge(resp)) {
        return;
      }
      let defaultIndex = 0;
      let defaultId = 0;
      let lastErrCount = -1;
      const floorList = resp.data;

      floorList.forEach((item, index) => {
        item.label = item.sort;
        item.value = item.id;
        if (item.errorCount > lastErrCount) {
          lastErrCount = item.errorCount;
          defaultIndex = index;
          defaultId = item.id;
        }
      });

      yield put({
        type: 'save',
        payload: {
          defaultIndex,
          defaultId,
          floorList,
          id: payload,
        },
      });
      if (callback) callback(defaultId);
    },
    *fetchDeviceList({ payload }, { call, put }) {
      // 获取每层的监控列表
      const resp = yield call(getDeviceByFloor, payload);
      if (!judge(resp)) {
        return;
      }

      yield put({
        type: 'save',
        payload: {
          deviceList: resp.data,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setBg(state, { payload }) {
      const { floorList } = state;
      const cur = floorList.find(item => item.id === payload);
      if (cur) {
        const bg = getBg(state.id, cur.sort);
        return {
          ...state,
          bg,
        };
      }
      return {
        ...state,
      };
    },
    clear() {
      return {
        ...emptyState,
      };
    },
  },
};
