import request from '@/utils/request';

const pref = '/services/monitor';

/**  获取首页设备统计信息
 */
export async function getDeviceCountList({ type, id }) {
  return request(`${pref}/lookup/getAllDeviceTypeById/${type}/${id}`);
}
/**  获取首页设备统计信息
 */
export default async function queryError(code) {
  return request(`/api/${code}`);
}
