/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import { getErrorEquipment, getPlanByDevice, getAllVideoByDevice } from '@/services/equipment';

import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

const emptyState = {
  device: {},
  allVideoList: [],
  devicePlan: {},
};

export default {
  namespace: 'equipment',

  state: emptyState,

  effects: {
    *fetchDeviceByid({ payload, callback }, { call, put }) {
      // 获取报警设备信息
      const resp = yield call(getErrorEquipment, payload);
      if (!judge(resp)) {
        return;
      }
      const device = resp.data;

      yield put({
        type: 'save',
        payload: {
          device,
        },
      });

      callback(resp.data);
    },
    *fetchAllVideoDevice({ payload, callback }, { call, put }) {
      // 获取与该设备关联的其它设备信息
      const resp = yield call(getAllVideoByDevice, payload);
      if (!judge(resp)) {
        return;
      }
      const allVideoList = resp.data;

      allVideoList.forEach(item => {
        switch (item.status) {
          case '001':
            item.status = '设备报警';
            break;
          case '002':
            item.status = '通信错误';
            break;
          case '003':
            item.status = '无法连接';
            break;
          case '004':
            item.status = '通信正常';
            break;
          default:
            break;
        }
      });

      yield put({
        type: 'save',
        payload: {
          allVideoList,
        },
      });

      callback(allVideoList);
    },

    *fetchPlanDevice({ payload, callback }, { call, put }) {
      // 获取报警设备方案信息
      const resp = yield call(getPlanByDevice, payload);
      if (!judge(resp)) {
        return;
      }
      const devicePlan = resp.data;

      yield put({
        type: 'save',
        payload: {
          devicePlan,
        },
      });

      callback(resp.data);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state, { payload }) {
      return {
        emptyState,
      };
    },
  },
};
