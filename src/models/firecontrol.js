import {
  FireControlList,
  FireControlListqy,
  getFireControlList,
  FireDeviceControlList,
  deleteData,
  exportData,
  updateStatus,
  wdfilePic,
  // FireDeviceControl
  getPlanDetail
} from '@/services/api';

import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

export default {
  namespace: 'firecontrolhistory',
  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        page: 1,
      },
      areaId: 1,
    },
    loading: false,
  },

  // FireControlDeviceListPage 消防设备历史纪录
  effects: {
    // 分页
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(FireDeviceControlList, payload);
      console.log(response)
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: list.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        // areaId:1
      };
      yield put({
        type: 'save',
        payload: result,
      });
      callback(response)
    },
    *getFireControlList({ payload,callback }, { call, put }) {
      const response = yield call(getFireControlList, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: list.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        // areaId:1
      };
      yield put({
        type: 'save',
        payload: result,
      });
      callback(response)
    },
  
  *getAccessControlByRegionList({ payload }, { call, put }) {
    const response = yield call(FireControlList, payload);
    let list = [];
    list = response.data.data;
    const result = {
      list,
      pagination: {
        total: list.length || 0,
        current: response.data.page,
        pageSize: response.data.pageSize,
      },
      // areaId:1
    };
    yield put({
      type: 'save',
      payload: result,
    });
  },

    // 预览图片
    *wdfilePic({ payload,callback }, { call, put }) {
      const response = yield call(wdfilePic, payload);
      console.log(response);
      if (!judge(response)) {
        return;
      }
      // const updatecode = response.code;

      yield put({
        type: 'save',
        payload: {
          response,
        },
      });
      callback(response); 
    },
    *getAccessControlDeviceList({ payload }, { call, put }) {
      const response = yield call(FireControlList, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: list.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        // areaId:1
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getAccessControlList({ payload }, { call, put }) {
      const response = yield call(FireControlList, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: list.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        // areaId:1
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getFireControlByRegionList({ payload,callback }, { call, put }) {
      const response = yield call(FireControlList, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
      };
      yield put({
        type: 'save',
        payload: result,
      });
      callback(response)
    },
    *getFireControlDeviceList({ payload,callback }, { call, put }) {
      const response = yield call(FireDeviceControlList, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
      };
      yield put({
        type: 'save',
        payload: result,
      });
      callback(response)
    },
    *getVideoMonitorByRegionList({ payload }, { call, put }) {
      const response = yield call(FireControlList, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        // areaId:1
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getVideoMonitorDeviceList({ payload }, { call, put }) {
      const response = yield call(FireControlList, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        // areaId:1
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getVideoMonitorList({ payload }, { call, put }) {
      const response = yield call(FireControlList, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        // areaId:1
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getFireControlListqy({ payload }, { call, put }) {
      const response = yield call(FireControlListqy, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        areaId: 1,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getAccessControlByRegionListqy({ payload }, { call, put }) {
      const response = yield call(FireControlListqy, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        areaId: 1,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getAccessControlDeviceListqy({ payload }, { call, put }) {
      const response = yield call(FireControlListqy, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        areaId: 1,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getAccessControlListqy({ payload }, { call, put }) {
      const response = yield call(FireControlListqy, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        areaId: 1,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getFireControlByRegionListqy({ payload }, { call, put }) {
      const response = yield call(FireControlListqy, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        areaId: 1,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getFireControlDeviceListqy({ payload }, { call, put }) {
      const response = yield call(FireControlListqy, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        areaId: 1,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getVideoMonitorByRegionListqy({ payload }, { call, put }) {
      const response = yield call(FireControlListqy, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        areaId: 1,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getVideoMonitorDeviceListqy({ payload }, { call, put }) {
      const response = yield call(FireControlListqy, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        areaId: 1,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *getVideoMonitorListqy({ payload }, { call, put }) {
      const response = yield call(FireControlListqy, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data.length || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        areaId: 1,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    // 删除
    *deleteData({ payload, callback }, { call, put }) {
      const response = yield call(deleteData, payload.id);
      const delcode = response.code;
      yield put({
        type: 'save',
        payload: {
          delcode,
        },
      });
      callback(response.code);
    },
    // 导出
    *exportsExc({ payload }, { call, put }) {
      const response = yield call(exportData, payload);
      let list = [];
      list = response.data.data;
      const result = {
        list,
        pagination: {
          total: response.data || 0,
          current: response.data.page,
          pageSize: response.data.pageSize,
        },
        // areaId:1
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    // 更改处理状态
    *updatetheStatus({ payload, callback }, { call, put }) {
      const resp = yield call(updateStatus, payload);
      if (!judge(resp)) {
        return;
      }
      const updatecode = resp.code;

      yield put({
        type: 'save',
        payload: {
          updatecode,
        },
      });
      callback(resp.code);
    },
    // 查看方案详情
    *getPlanDetail({ payload,callback }, { call, put }) {
      const response = yield call(getPlanDetail, payload);
      if (!judge(response)) {
        return;
      }
      const {data} = response
      yield put({
        type: 'save',
        payload: {
          data,
        },
      });
      callback(data); 
    },
  },



  reducers: {
    commonSave(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    },
  },
};
