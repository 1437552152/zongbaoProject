import { message } from 'antd';
import * as companyManage from '@/services/companyManage';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

const emptyState = {
  departmentList: [],
  companyTree: [],
  companyInfo: {},
  areaList: [],
  groupList: [],
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
};

export default {
  namespace: 'companyManage',

  state: emptyState,

  effects: {
    *fetchCompanyTree(_, { call, put }) {
      const response = yield call(companyManage.getCompanysByArea);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          companyTree: root,
          // departmentList: [],
          // companyInfo: {},
        },
      });
    },

    *fetchCompanyInfo({ payload }, { call, put }) {
      const response = yield call(companyManage.getCompanyInfo, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          companyInfo: root,
        },
      });
    },

    *fetchCompanyDepartments({ payload, callback }, { call, put }) {
      const response = yield call(companyManage.listDepartmentByCompany, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          departmentList: root,
        },
      });
      if (callback) {
        callback(root);
      }
    },

    *fetchAreas(_, { call, put }) {
      const response = yield call(companyManage.getAreasByType);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          areaList: root,
        },
      });
    },

    *updateCompanyInfo({ payload }, { call, put }) {
      const resp = yield call(companyManage.updateCompanyInfo, payload);
      if (!judge(resp)) {
        return;
      }
      const root = resp.data;
      yield put({
        type: 'save',
        payload: {
          companyInfo: root,
        },
      });
      yield put({
        type: 'fetchCompanyTree',
      });
    },

    *deleteCompany({ payload }, { call, put }) {
      const resp = yield call(companyManage.deleteCompany, payload);
      if (!judge(resp)) {
        return;
      }
      yield put({
        type: 'save',
        payload: {
          companyInfo: {},
        },
      });
      // TODO 删除完了，要更新数据
      yield put({
        type: 'fetchCompanyTree',
      });
    },

    *addDepart({ payload }, { call, put }) {
      const resp = yield call(companyManage.addCompanyOrDepartment, payload);
      if (!judge(resp)) {
        return;
      }
      yield put({
        type: 'fetchCompanyDepartments',
        payload: payload.fid,
      });
    },

    *updateDepart({ payload, companyId }, { call, put }) {
      const resp = yield call(companyManage.updateCompanyInfo, payload);
      if (!judge(resp)) {
        return;
      }
      yield put({
        type: 'fetchCompanyDepartments',
        payload: companyId,
      });
    },

    *deleteDepart({ payload, companyId }, { call, put }) {
      const resp = yield call(companyManage.deleteCompany, payload);
      if (!judge(resp)) {
        return;
      }
      yield put({
        type: 'fetchCompanyDepartments',
        payload: companyId,
      });
    },

    *addCompany({ payload }, { call, put }) {
      const resp = yield call(companyManage.addCompanyOrDepartment, payload);
      if (!judge(resp)) {
        return;
      }
      yield put({
        type: 'fetchCompanyTree',
      });
    },

    *addGroup({ payload }, { call, put }) {
      const resp = yield call(companyManage.addGroup, payload);
      const departId = payload.companyId;
      if (!judge(resp)) {
        return;
      }
      yield put({
        type: 'listGroup',
        payload: departId,
      });
    },

    *deleteGroup({ payload }, { call, put }) {
      const resp = yield call(companyManage.deleteGroup, payload);
      const { departId } = payload;
      if (!judge(resp)) {
        return;
      }
      yield put({
        type: 'listGroup',
        payload: departId,
      });
    },

    *listGroup({ payload }, { call, put }) {
      const response = yield call(companyManage.getGroupByDepart, payload);
      if (!judge(response)) {
        return;
      }
      const root = response.data;
      yield put({
        type: 'save',
        payload: {
          groupList: root,
        },
      });
    },

    *listBindPerson({ payload }, { call, put }) {
      // 获取分组绑定的人员信息列表
      const params = {
        page: 1,
        pageSize: 5,
        ...payload,
      };
      const resp = yield call(companyManage.listBindPerson, params);
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
    *listUnBindPerson({ payload }, { call, put }) {
      // 获取分组未绑定的人员信息列表
      const params = {
        page: 1,
        pageSize: 5,
        ...payload,
      };
      const resp = yield call(companyManage.listUnBindPerson, params);
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
      const resp = yield call(companyManage.bindPerson, payload);
      if (!judge(resp)) {
        return;
      }
      if (callback) callback();
    },
    *delBindPerson({ payload, callback }, { call }) {
      // 解除绑定人员
      const resp = yield call(companyManage.delBindPerson, payload);
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
  },
};
