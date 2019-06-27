import request from '@/utils/request';

const pref = '/services/monitor';

/**
 * 获取警报设备数据
 * @param {*} id 设备id
 */
export async function getErrorEquipment(val) {
  return request(`${pref}/device/get/${val.type}/${val.id}`);
}

/**
 * 获取报警设备方案信息
 * @param {*} id   方案id
 */
export async function getPlanByDevice(id) {
  return request(`${pref}/plan/get/${id}`);
}

/**
 * 获取报警设备周边摄像头信息
 * @param {*} id  设备id
 */
export async function getAllVideoByDevice(id) {
  return request(`${pref}/DeviceRelation/list?Q=deviceId_EQ=${id}`);
}
