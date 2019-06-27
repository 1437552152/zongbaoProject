import lodash from 'lodash';
import pathToRegexp from 'path-to-regexp';

import {
  getAssociateDevices,
  deleteAssociateDevice,
  getLinkableDevices,
  getDeviceInfo,
  getAreasTree,
  getDeviceTypes,
  createDeviceAssociate,
} from '@/services/device';

const namespace = 'associate';

export default {
  namespace,

  state: {
    currentID: 0,
    query: {
      type: '',
      typeOptions: [],
      area: '',
      areaOptions: [],
      building: '',
      buildingOptions: [],
      floor: '',
      floorOptions: [],
    },
    deviceList: [],
    associatingList: [],
    deviceInfo: {},
    selectedInfo: {},
    filter: {
      supportTypes: [],
      supportAreas: [],
      supportDevice: [],
      type: '',
      area: '',
      building: '',
      floor: '',
      selectedDevice: '',
    },
  },

  reducers: {
    updateStatue(state, { payload }) {
      const { filter, ...other } = payload;

      return {
        ...state,
        ...other,
        filter: {
          ...state.filter,
          ...filter,
        },
      };
    },

    updateListQuery(state, { payload }) {
      const findOptions = (id, array) => {
        if (id && array) {
          for (let i = 0; i < array.length; i += 1) {
            const value = array[i];
            if (value.id === id) {
              return value.children;
            }
          }
        }

        return [];
      };

      const update = { ...payload };
      if (payload.area) {
        update.building = '';
        update.buildingOptions = findOptions(payload.area, state.query.areaOptions);
        update.floor = '';
        update.floorOptions = [];
      } else if (payload.building) {
        update.floor = '';
        update.floorOptions = findOptions(payload.building, state.query.buildingOptions);
      }

      return {
        ...state,
        query: {
          ...state.query,
          ...update,
        },
      };
    },

    updateFilterStatue(state, { payload }) {
      const update = { ...payload };

      if (payload.area) {
        update.building = '';
        update.floor = '';
        update.supportDevice = [];
        update.selectedDevice = '';
      } else if (payload.building) {
        update.floor = '';
        update.supportDevice = [];
        update.selectedDevice = '';
      } else if (payload.floor || payload.type) {
        update.supportDevice = [];
        update.selectedDevice = '';
      } else if (payload.selectedDevice !== null) {
        // 如果是 selectedDevice 变化, 则更新设备信息
        const selectedInfo =
          lodash.find(state.filter.supportDevice, o => o.id === update.selectedDevice) || {};
        return {
          ...state,
          selectedInfo,
          filter: {
            ...state.filter,
            ...update,
          },
        };
      }

      return {
        ...state,
        selectedInfo: {},
        filter: { ...state.filter, ...update },
      };
    },
  },

  effects: {
    *updateFilter({ payload }, { put }) {
      yield put({
        type: 'updateFilterStatue',
        payload,
      });

      if (payload.floor || payload.type) {
        yield put({ type: 'loadLinkableDevices' });
      }
    },

    *initialize({ payload }, { call, put }) {
      const { id } = payload;
      const responses = yield [
        call(getDeviceInfo, id),
        call(getAssociateDevices, { id }),
        call(getDeviceTypes),
        call(getAreasTree),
      ];

      if (
        responses[0].code === 200 &&
        responses[1].code === 200 &&
        responses[2].code === 200 &&
        responses[3].code === 200
      ) {
        yield put({
          type: 'updateStatue',
          payload: {
            currentID: id,
            deviceInfo: responses[0].data,
            deviceList: responses[1].data,
            filter: {
              supportTypes: responses[2].data.slice(1),
              supportAreas: responses[3].data,
            },
            query: {
              type: '',
              typeOptions: [{ code: '', desp: '全部' }, ...responses[2].data.slice(1)],
              area: '',
              areaOptions: [{ id: '', name: '全部' }, ...responses[3].data],
              building: '',
              buildingOptions: [],
              floor: '',
              floorOptions: [],
            },
          },
        });
      }
    },

    // 获取已经关联的设备
    *loadAssociateDevice(_, { put, call, select }) {
      const param = yield select(state => ({
        id: state[namespace].currentID,
        query: {
          area: state[namespace].query.area,
          building: state[namespace].query.building,
          floor: state[namespace].query.floor,
          type: state[namespace].query.type,
        },
      }));
      console.log(2);

      const response = yield call(getAssociateDevices, param);
      if (response.code === 200) {
        yield put({
          type: 'updateStatue',
          payload: {
            deviceList: response.data,
            currentID: param.id,
          },
        });
      }
    },

    // 根据当前选择条件获取可以连接的设备列表
    *loadLinkableDevices(_, { select, call, put }) {
      const param = yield select(state => ({
        id: state[namespace].currentID,
        floor: state[namespace].filter.floor,
        type: state[namespace].filter.type,
      }));

      if (param.type && param.floor) {
        const response = yield call(getLinkableDevices, param);
        if (response.code === 200) {
          if (response.data.length === 0) {
            // console.log('没有设备');
          }
          yield put({ type: 'updateFilterStatue', payload: { supportDevice: response.data } });
        }
      }
    },

    // 连接当前选中设备
    *linkDevice({ callback }, { call, put, select }) {
      const param = yield select(state => ({
        id: state[namespace].currentID,
        lid: state[namespace].filter.selectedDevice,
      }));

      const response = yield call(createDeviceAssociate, param);
      if (response.code === 200) {
        yield put({ type: 'updateFilterStatue', payload: { selectedDevice: '' } });
        yield [put({ type: 'loadLinkableDevices' }), put({ type: 'loadAssociateDevice' })];

        if (callback) {
          callback();
        }
      }
    },

    // 删除选定设备
    *unlinkDevice({ payload }, { call, put }) {
      const response = yield call(deleteAssociateDevice, payload.id);
      if (response.code === 200) {
        yield put({
          type: 'loadAssociateDevice',
          payload: {},
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      const idString = pathToRegexp('/manage/device/associate/:id').exec(
        history.location.pathname
      )[1];
      const id = Number(idString);

      if (!id) {
        return;
      }

      dispatch({
        type: 'initialize',
        payload: {
          id,
        },
      });
    },
  },
};
