/**
 * 与文件操作相关的modal
 */
import { upload } from '../services/file';

export default {
  namespace: 'fileModal',
  state: {},
  effects: {
    // 上传文件到文件服务器上
    *upload({ payload, callback }, { call }) {
      const response = yield call(upload, payload);
      if (callback) callback(response);
    },
  },
};
