import request from '@/utils/request';
import { getQueryUrl } from '@/utils/queryFilter';

const pref = '/services/monitor/area';

/**
 * 获取楼层错误警报设备数量
 * @param {*} id 楼栋id
 */
export async function getBuildingErrorInfo(id) {
  return request(`${pref}/getBuildingErrorInfo/${id}`);
}

/**
 * 获取楼层对应的设备信息
 * @param {*} id  楼层id
 */
export async function getDeviceByFloor(id) {
  return request(`${pref}/getDeviceByFloor/${id}`);
}

/**
 * 获取所有区域列表
 */

export async function getAllZone() {
  return request(`${pref}/list`);
}

/**
 * 获取区域列表
 * type: 请求类型
 *  1 获取区域树（区域）结构
 *  2 获取建筑树（区域、楼栋、楼层）结构
 *  3 获取公司树（楼层、公司）结构
 * id: 选中的区域的id
 */
export async function getAreaTree({ type, id }) {
  return request(`${pref}/listAreas/${type}?Q=id_EQ=${id}`);
}

// 获取包含设备在内的区域树
export async function getAreaTreeWithDevices() {
  return request(`${pref}/listAreaMenus`);
}

/**
 * 获取区域、楼栋、楼层树结构信息列表
 */
export async function listAllAreas() {
  return request(`${pref}/listAllAreas`);
}

/**
 * 获取区域列表
 * type: 请求类型
 *  1 获取区域树（区域）结构
 *  2 获取建筑树（区域、楼栋、楼层）结构
 *  3 获取公司树（楼层、公司）结构
 * id: 选中的区域的id
 */
export async function listAreas({ type, ...rest }) {
  return request(`${pref}/listAreas/${type}${getQueryUrl(rest)}`);
}

/**
 * 获取区域、楼栋、楼层树结构信息列表(专属楼宇配置中的树)
 */
export async function listAreas2() {
  return request(`${pref}/listAreas/2?Q=id_EQ=1`);
}

/**
 * 更新模板内容
 * @param {*} params
 */
export async function update(params) {
  return request(`${pref}/update`, {
    method: 'PUT',
    data: params,
  });
}

/**
 * 获取楼层绑定的人员信息列表
 */
export async function listBindPerson({ id, page, pageSize, ...rest }) {
  return request(`${pref}/listBindPerson/${id}/${page}/${pageSize}${getQueryUrl(rest)}`);
}

/**
 * 获取楼层未绑定人员信息列表
 */
export async function listUnBindPerson({ id, page, pageSize, ...rest }) {
  return request(`${pref}/listUnBindPerson/${id}/${page}/${pageSize}${getQueryUrl(rest)}`);
}

/**
 * 绑定楼层人员信息
 * @param {*} params
 */
export async function bindPerson(params) {
  return request(`${pref}/bindPerson/${params.id}`, {
    method: 'POST',
    data: params.ids,
  });
}

/**
 * 解除绑定楼层人员信息
 * @param {*} params
 */
export async function delBindPerson(params) {
  return request(`${pref}/delPerson/${params.id}`, {
    method: 'DELETE',
    data: params.ids,
  });
}

/**
 * 获取楼层绑定的公司信息列表
 */
export async function listBindCom({ id, page, pageSize, ...rest }) {
  return request(`${pref}/listBindCompany/${id}/${page}/${pageSize}${getQueryUrl(rest)}`);
}

/**
 * 获取楼层未绑定公司信息列表
 */
export async function listUnBindCom({ id, page, pageSize, ...rest }) {
  return request(`${pref}/listUnBindCompany/${id}/${page}/${pageSize}${getQueryUrl(rest)}`);
}

/**
 * 绑定楼层公司信息
 * @param {*} params
 */
export async function bindCom(params) {
  return request(`${pref}/bindCompany/${params.id}`, {
    method: 'POST',
    data: params.ids,
  });
}

/**
 * 解除绑定楼层公司信息
 * @param {*} params
 */
export async function delBindCom(params) {
  return request(`${pref}/delCompany/${params.id}`, {
    method: 'DELETE',
    data: params.ids,
  });
}
