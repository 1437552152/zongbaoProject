import { listAreas } from '@/services/area';
import { getParkingManagement } from '@/services/mock'
import { judge } from '@/utils/resp';

const emptyState = {
  bg: '',
  datas: [],
  treeList: [],
  curTreeItem: {}, // 选中的树
  showContent: false, // 是否显示内容
};

export default {
  namespace: 'opCardpark',

  state: emptyState,

  effects: {
    *treeList(_, { call, put }) {
      // 获取区域树
      const resp = yield call(listAreas, { type: 1, id_EQ: 1 });
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
    *loadData({ payload }, { call, put }) {
      const resp = yield call(getParkingManagement, 1); // todo 1 = payload.id
      if (!judge(resp)) {
        return;
      }

      let datas = resp.data.floors || []
      datas = datas.map((item, i) => {
        // todo 放假数据
        const areaId = 72 // payload.id
        return {
          src: `./assets/areas/${areaId}/un/${i + 1}.png`,
          ...item
        }
      })
      yield put({
        type: 'save',
        payload: {
          datas
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
    clear() {
      return {
        ...emptyState,
      };
    },
  },
};
