import request from '@/utils/request';

const pref = '/services/monitor';

/**
 * 获取搜索查询结果树
 * @param val 关键字 val
 */
export async function getSearchTree(val) {
  return request(`${pref}/area/listAreasByName?name=${val}`);
}

/**
 * 获取运维设备信息
 * @param {*}
 */
export async function fetchDeviceByarea({ type, id }) {
  return request(`${pref}/home/getMalFunctionsByAreaId/${id}?Q=deviceType_S_LK=${type}`);
}

/**
 * 获取安监设备信息
 * @param {*}
 */
export async function fetchAjDeviceByarea({ type, id }) {
  return request(`${pref}/alarm/getAlarmsByAreaId/${id}?Q=deviceType_S_LK=${type}`);
}

/**
 * 获取运维管控的二级设备统计信息
 * @param {*}
 */
export async function fetchDeviceByareaType({ type, id }) {
  return request(`${pref}/home/getDeviceCountList/${id}/${type}`);
}

/**
 * 获取安监设备地图上点信息
 * @param {*}
 */
export async function fetchDevicePointByarea({ type, id }) {
  return request(`${pref}/alarm/getOptionDevicesByAreaId/${id}/${type}`);
}

/**
 * 获取值班室和配电房地图上点信息
 * @param {*}
 */
export async function fetchmidPoint({ type, id }) {
  return request(`${pref}/area/getAreaOptionsByAreaId/${id}/${type}`);
}

/**
 * 获取值班室和配电房人员信息
 * @param {*}
 */
export async function fetchmidperson({ type, id }) {
  return request(`${pref}/home/selectBindPersonByAreaIdType/${id}/${type}`);
}

/**
 * 获取运维维修人员信息
 * @param {*}
 */
export async function fetchwxperson(id) {
  return request(`${pref}/home/getMaintainersByAreaId/${id}`);
}

/**
 * 获取安监维修人员信息
 * @param {*}
 */
export async function fetchAjwxperson(id) {
  return request(`${pref}/alarm/getListAlarmPersonsByAreaId/${id}`);
}

/**
 * 获取首页设备状态统计数据
 * @param deviceId
 */
export async function queryhomemain(id) {
  return request(`${pref}/home/getDeviceStatusCountListByType/${id}`);
}

/**
 * 获取运维首页所有报警设备统计
 *
 */
export async function queryhomedevice() {
  return request(`${pref}/home/getMalfunctionCountList`);
}

/**
 * 获取安监首页所有报警设备统计
 *
 */
export async function queryAjhomedevice() {
  return request(`${pref}/alarm/getAlarmCountList`);
}

/**
 * 获取首页人员分布统计
 *
 */
export async function queryhomeperson() {
  return request(`${pref}/home/getPersonCountList`);
}
