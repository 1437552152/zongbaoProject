/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

import {
  getAllDevice,
  getAllArea,
  addDevice,
  updateDevice,
  delByDeviceId,
  getDeviceTypes,
  getErrorEquipment,
} from '@/services/equipmentC';

import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

const emptyState = {
  delcode: 400,
  addcode: 400,
  updatecode: 400,
  selectCode: '01',
  areaList: [],
  deviceList: [],
  deviceListLength: 0,
  device: {},
  selectedType: '01',
  supportTypes: [],
};

export default {
  namespace: 'equipmentC',

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
    *fetchAllArea({ payload }, { call, put }) {
      const resp = yield call(getAllArea, payload);
      if (!judge(resp)) {
        return;
      }
      const areaList = resp.data;

      areaList.forEach(item => {
        item.value = item.id;
        item.label = item.name;
        if (item.children) {
          item.children.forEach(item2 => {
            item2.value = item2.id;
            item2.label = item2.name;
            if (item2.children) {
              item2.children.forEach(item3 => {
                item3.value = item3.id;
                item3.label = item.name;
              });
            }
          });
        }
      });

      yield put({
        type: 'save',
        payload: {
          areaList,
        },
      });
    },

    *addtheDevice({ payload, callback }, { call, put }) {
      // 新增设备信息
      const resp = yield call(addDevice, payload);
      if (!judge(resp)) {
        return;
      }
      const addcode = resp.code;
      if (addcode === 200) {
        message.success(resp.msg);
      } else {
        message.error(resp.msg);
      }
      yield put({
        type: 'save',
        payload: {
          addcode,
        },
      });
      callback(resp.code);
    },

    *updatetheDevice({ payload, callback }, { call, put }) {
      // 修改设备信息
      const resp = yield call(updateDevice, payload);
      if (!judge(resp)) {
        return;
      }
      const updatecode = resp.code;
      if (updatecode === 200) {
        message.success(resp.msg);
      } else {
        message.error(resp.msg);
      }
      yield put({
        type: 'save',
        payload: {
          updatecode,
        },
      });
      callback(resp.code);
    },

    *fetchDeviceType({ payload, callback }, { call, put }) {
      const resp = yield call(getDeviceTypes);
      const { data } = resp;
      const supportTypes = [];
      data.forEach(ele => {
        if (ele.parentId === 1083) {
          ele.children = [];
          ele.value = ele.code;
          ele.label = ele.desp;
          supportTypes.push(ele);
        }
      });
      const { length } = supportTypes;
      data.forEach(ele => {
        ele.value = ele.code;
        ele.label = ele.desp;
        if (ele.parentId !== 1083) {
          for (let i = 0; i < length; i += 1) {
            const type = supportTypes[i];
            if (type.id === ele.parentId) {
              type.children.push(ele);
              break;
            }
          }
        }
      });
      if (callback) {
        callback(supportTypes);
      }
      yield put({
        type: 'save',
        payload: {
          supportTypes,
        },
      });
    },

    *deltheDevice({ payload, callback }, { call, put }) {
      // 删除设备信息
      const resp = yield call(delByDeviceId, payload);
      if (!judge(resp)) {
        return;
      }
      const delcode = resp.code;

      yield put({
        type: 'save',
        payload: {
          delcode,
        },
      });
      callback(resp.code);
    },

    // 根据类型获取设备列表
    *fetchDeviceListBySubType({ payload }, { call, put }) {
      const resp = yield call(getAllDevice, payload);
      if (!judge(resp)) {
        return;
      }
      const { data } = resp;
      yield put({
        type: 'save',
        payload: {
          deviceList: data.data,
          deviceListLength: data.length,
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
    clear(state, { payload }) {
      return {
        emptyState,
      };
    },
  },
};
