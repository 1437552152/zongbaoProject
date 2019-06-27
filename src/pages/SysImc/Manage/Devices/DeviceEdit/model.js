import { message } from 'antd';
import { createDevice, getDeviceInfo, updateDevice } from '@/services/device';
import { upload } from '@/services/file';
import { listAreas } from '@/services/area';
import Host from '../../../../../../config/url.config';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

export default {
  namespace: 'deviceEdit',
  state: {
    device: {},
    picId: '',
    picUrl: '',
    areaList: [], // 区域选择列表 {id, name}
    buildingList: [], // 建筑选择列表 {id, name}
    floorList: [], // 楼层选择列表 {id, name}
    roomList: [], // 房间选择列表 {id, name}
  },

  effects: {
    *getAreaList(_, { call, put }) {
      const resp = yield call(listAreas, { type: 4, id_EQ: 1 });
      if (!judge(resp)) {
        return;
      }
      const { data = [] } = resp;
      if (data.length > 0 && data[0].children) {
        yield put({
          type: 'save',
          payload: {
            areaList: data[0].children,
          },
        });
      }
    },

    *addDevice({ payload, callback }, { call }) {
      const resp = yield call(createDevice, payload);
      if (!judge(resp)) {
        return;
      }
      const addcode = resp.code;
      if (addcode === 200) {
        message.success(resp.msg);
        if (callback) {
          callback();
        }
      } else {
        message.error(resp.msg);
      }
    },

    *fetchDeviceByid({ payload }, { call, put }) {
      const resp = yield call(getDeviceInfo, payload);
      if (!judge(resp)) {
        return;
      }
      const device = resp.data;
      const { picId = '', area, building, floor } = device;

      yield put({
        type: 'save',
        payload: {
          device,
          picId,
          picUrl: `${Host}/monitor/wdfile/check/${picId}`,
        },
      });

      const listResp = yield call(listAreas, { type: 4, id_EQ: 1 });

      if (listResp.code === 200) {
        const { data = [] } = listResp;
        if (data.length > 0 && data[0].children) {
          const areaList = data[0].children || [];
          let buildingList = [];
          let floorList = [];
          let roomList = [];

          const theArea = areaList.find(item => `${item.id}` === `${area}`);
          if (theArea && theArea.children) {
            buildingList = theArea.children;

            const theBuilding = buildingList.find(item => `${item.id}` === `${building}`);
            if (theBuilding && theBuilding.children) {
              floorList = theBuilding.children;

              const theFloor = floorList.find(item => `${item.id}` === `${floor}`);
              if (theFloor && theFloor.children) {
                roomList = theFloor.children;
              }
            }
          }

          yield put({
            type: 'save',
            payload: {
              areaList,
              buildingList,
              floorList,
              roomList,
            },
          });
        }
      }
    },

    *updatetheDevice({ payload, callback }, { call }) {
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
      callback(resp.code);
    },

    *uploadFile({ payload }, { call, put }) {
      const p = { files: [payload], name: 'file' };
      const response = yield call(upload, p);
      const url = window.URL.createObjectURL(payload);
      yield put({
        type: 'save',
        payload: {
          picId: response.entity || '',
          picUrl: url,
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
  },
};
