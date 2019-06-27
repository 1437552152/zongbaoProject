import { message } from 'antd';
import {
  getWarnings,
  getWarningList,
  setFalsePositive,
  getProcessTree,
  getMemberByType,
  getDepartmentList,
  getAreaTreeWithRoom,
  createOrder,
} from '@/services/Malfunction';
import { getAreaTreeWithDevices } from '@/services/area';
import { upload } from '@/services/file';
import { getDictList, getOrderTypes } from '@/services/WorkOrder';
import { WarningType } from '@/pages/SysIop/config';

const judge = ({ code, msg }) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

const emptyState = {
  areaTree: [],
  totalAlarm: 0, // 总报警数
  realTimeAlarm: 0, // 未处理实时报警数
  loadRateAlarm: 0, // 未处理负荷率报警数
  lineLossAlarm: 0, // 未处理线损报警数
  contractLoadRateAlarm: 0, // 未处理契约负荷率报警数
  energyAlarm: 0, // 未处理能耗报警数
  realTimeAlarms: {
    // 实时报警
    length: 0,
    list: [],
  },
  loadRateAlarms: {
    // 负荷率报警
    length: 0,
    list: [],
  },
  lineLossAlarms: {
    // 线损报警
    length: 0,
    list: [],
  },
  contractLoadRateAlarms: {
    // 契约负荷率报警
    length: 0,
    list: [],
  },
  energyAlarms: {
    // 能耗报警
    length: 0,
    list: [],
  },
  orderTypes: [], // 工单类型可选值列表
  processTree: [], // 流程树
  responsibleMember: [], // 责任人列表
  departmentList: [], // 部门列表
  levelList: [], // 派工级别列表
  memberList: [], // 派工人员列表
  areaTreeWithRoom: [], // 区域树（区域/建筑/楼层/房间）
};

export default {
  namespace: 'malfunction',
  state: emptyState,

  effects: {
    // eslint-disable-next-line no-unused-vars
    *fetchAreaTree({ payload, callback }, { call, put }) {
      const response = yield call(getAreaTreeWithDevices);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      if (callback) {
        callback(root);
      }
      yield put({
        type: 'save',
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
        type: 'save',
        payload: {
          ...warnings,
        },
      });
    },

    *fetchWarningList({ payload }, { call, put }) {
      const response = yield call(getWarningList, payload);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      const { warningType } = payload;
      const { length } = data;
      const list = data.data;
      if (warningType === WarningType.realTime) {
        yield put({
          type: 'save',
          payload: { realTimeAlarms: { length, list } },
        });
      } else if (warningType === WarningType.load) {
        yield put({
          type: 'save',
          payload: { loadRateAlarms: { length, list } },
        });
      } else if (warningType === WarningType.cable) {
        yield put({
          type: 'save',
          payload: { lineLossAlarms: { length, list } },
        });
      } else if (warningType === WarningType.maximumDemand) {
        yield put({
          type: 'save',
          payload: { contractLoadRateAlarms: { length, list } },
        });
      } else if (warningType === WarningType.energy) {
        yield put({
          type: 'save',
          payload: { energyAlarms: { length, list } },
        });
      }
    },

    *uploadFile({ payload, callback }, { call }) {
      const p = { files: [payload], name: 'file' };
      const response = yield call(upload, p);
      if (callback) {
        callback(response.entity);
      }
    },

    *setFalsePositive({ payload, callback }, { call }) {
      const response = yield call(setFalsePositive, payload);
      if (!judge(response)) {
        return;
      }
      if (callback) {
        callback();
      }
    },

    // eslint-disable-next-line no-unused-vars
    *fetchOrderTypes({ payload }, { call, put }) {
      const response = yield call(getOrderTypes);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          orderTypes: data,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchProcess({ payload }, { call, put }) {
      const response = yield call(getProcessTree);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          processTree: data,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchResponsibleMember({ payload }, { call, put }) {
      const response = yield call(getMemberByType, '1');
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          responsibleMember: data,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchDepartment({ payload }, { call, put }) {
      const response = yield call(getDepartmentList);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          departmentList: data,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchfLevel({ payload }, { call, put }) {
      const response = yield call(getDictList, 'DISPATCHLEVEL');
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          levelList: data,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchMember({ payload }, { call, put }) {
      const response = yield call(getMemberByType, '2');
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          memberList: data,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *fetchAreaTreeWithRoom({ payload }, { call, put }) {
      const response = yield call(getAreaTreeWithRoom);
      if (!judge(response)) {
        return;
      }
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          areaTreeWithRoom: data,
        },
      });
    },

    *createOrder({ payload, callback }, { call }) {
      const response = yield call(createOrder, payload);
      if (!judge(response)) {
        return;
      }
      if (callback) {
        callback();
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    clear() {
      return {
        emptyState,
      };
    },
  },
};
