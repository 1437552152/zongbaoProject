import request from '@/utils/request';
import { getQueryUrl } from '@/utils/queryFilter';

const pref = '/services/security';

/**
 * 登录
 * @param {*} params: {username, password}
 */
export async function login(params) {
  return request(`${pref}/login`, {
    method: 'POST',
    data: params,
  });
}

