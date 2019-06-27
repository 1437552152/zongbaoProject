import {
  getDeviceByFloor,
  listAreas2,
  update,
  listBindPerson,
  listUnBindPerson,
  bindPerson,
  delBindPerson,
  listBindCom,
  listUnBindCom,
  bindCom,
  delBindCom,
} from '@/services/area';

import { updateDevice } from '@/services/device';

import { getBg, getBgArea } from '@/utils/area';
import { judge } from '@/utils/resp';

const emptyState = {
  bg: '',
  treeList: [],
  inputType: 0, // 1 注意事项模板，2 处理方案模板
  inputModalVisible: false,
  deviceList: [],
  curTreeItem: {}, // 选中的树
  showContent: false, // 是否显示内容

  bindPersonData: {
    // 绑定的人员列表
    list: [],
    pagination: {},
  },
  unBindPersonData: {
    // 未绑定的人员列表
    list: [],
    pagination: {},
  },

  bindComData: {
    // 绑定的公司列表
    list: [],
    pagination: {},
  },
  unBindComData: {
    // 未绑定的公司列表
    list: [],
    pagination: {},
  },
};

export default {
  namespace: 'promises',

  state: emptyState,

  effects: {
    *listAllAreas(_, { call, put }) {
      // 获取区域、楼栋、楼层树结构信息列表
      const resp = yield call(listAreas2);
      if (!judge(resp)) {
        return;
      }
      yield put({
        type: 'save',
        payload: {
          treeList: resp.data || [],
        },
      });
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
    *update({ payload }, { call, put }) {
      const resp = yield call(update, payload);
      if (!judge(resp)) {
        return;
      }
      yield put({
        type: 'saveUpdate',
        payload,
      });
    },
    *updateDevice({ payload }, { call }) {
      const resp = yield call(updateDevice, payload);
      judge(resp);
    },
    *listBindPerson({ payload }, { select, call, put }) {
      // 获取楼层绑定的人员信息列表
      const promises = yield select(state => state.promises);
      const params = {
        page: 1,
        pageSize: 5,
        id: promises.curTreeItem.id,
        ...payload,
      };
      const resp = yield call(listBindPerson, params);
      if (!judge(resp)) {
        return;
      }
      const { data, page, pageSize, length } = resp.data;
      const bindPersonData = {
        list: data,
        pagination: {
          current: page,
          pageSize,
          total: length,
        },
      };
      yield put({
        type: 'save',
        payload: {
          bindPersonData,
        },
      });
    },
    *listUnBindPerson({ payload }, { select, call, put }) {
      // 获取楼层未绑定的人员信息列表
      const promises = yield select(state => state.promises);
      const params = {
        page: 1,
        pageSize: 5,
        id: promises.curTreeItem.id,
        ...payload,
      };
      const resp = yield call(listUnBindPerson, params);
      if (!judge(resp)) {
        return;
      }
      const { data, page, pageSize, length } = resp.data;
      const unBindPersonData = {
        list: data,
        pagination: {
          current: page,
          pageSize,
          total: length,
        },
      };
      yield put({
        type: 'save',
        payload: {
          unBindPersonData,
        },
      });
    },
    *bindPerson({ payload, callback }, { call }) {
      // 绑定人员
      const resp = yield call(bindPerson, payload);
      if (!judge(resp)) {
        return;
      }
      if (callback) callback();
    },
    *delBindPerson({ payload, callback }, { call }) {
      // 解除绑定人员
      const resp = yield call(delBindPerson, payload);
      if (!judge(resp)) {
        return;
      }
      if (callback) callback();
    },

    *listBindCom({ payload }, { select, call, put }) {
      // 获取楼层绑定的公司信息列表
      const promises = yield select(state => state.promises);
      const params = {
        page: 1,
        pageSize: 5,
        id: promises.curTreeItem.id,
        ...payload,
      };
      const resp = yield call(listBindCom, params);
      if (!judge(resp)) {
        return;
      }
      const { data, page, pageSize, length } = resp.data;
      const bindComData = {
        list: data,
        pagination: {
          current: page,
          pageSize,
          total: length,
        },
      };
      yield put({
        type: 'save',
        payload: {
          bindComData,
        },
      });
    },
    *listUnBindCom({ payload }, { select, call, put }) {
      // 获取楼层未绑定的公司信息列表
      const promises = yield select(state => state.promises);
      const params = {
        page: 1,
        pageSize: 5,
        id: promises.curTreeItem.id,
        ...payload,
      };
      const resp = yield call(listUnBindCom, params);
      if (!judge(resp)) {
        return;
      }
      const { data, page, pageSize, length } = resp.data;
      const unBindComData = {
        list: data,
        pagination: {
          current: page,
          pageSize,
          total: length,
        },
      };
      yield put({
        type: 'save',
        payload: {
          unBindComData,
        },
      });
    },
    *bindCom({ payload, callback }, { call }) {
      // 绑定公司
      const resp = yield call(bindCom, payload);
      if (!judge(resp)) {
        return;
      }
      if (callback) callback();
    },
    *delBindCom({ payload, callback }, { call }) {
      // 解除绑定公司
      const resp = yield call(delBindCom, payload);
      if (!judge(resp)) {
        return;
      }
      if (callback) callback();
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveUpdate(state, { payload }) {
      const { curTreeItem } = state;
      Object.assign(curTreeItem, payload);
      return {
        ...state,
        curTreeItem,
      };
    },
    setBg(state, { payload }) {
      const bg = payload.type === '001' ? getBgArea(payload.id) : getBg(payload.fid, payload.sort);
      return {
        ...state,
        bg,
      };
    },
    clear() {
      return {
        ...emptyState,
      };
    },
    showInputModal(state, { payload }) {
      return {
        ...state,
        inputType: payload,
        inputModalVisible: true,
      };
    },
    hideInputModal(state) {
      return {
        ...state,
        inputModalVisible: false,
      };
    },
    changeSelectedPersonModalVisible(state) {
      return {
        ...state,
        selPersonModalVisible: !state.selPersonModalVisible,
      };
    },
    changeUnSelectedPersonModalVisible(state) {
      return {
        ...state,
        unSelPersonModalVisible: !state.unSelPersonModalVisible,
      };
    },
  },
};
