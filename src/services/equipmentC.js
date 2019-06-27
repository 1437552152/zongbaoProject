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
 * 获取所有设备数据
 */
export async function getAllDevice({ type, page }) {
  return request(`${pref}/device/list/${page}/10?Q=type_EQ=${type}`);
}

/**
 * 获取所有区域
 */
export async function getAllArea() {
  return request(`${pref}/area/listAllAreas`);
}

/**
 * 获取所有设备类型
 */
export async function getDeviceTypes() {
  return request('/services/monitor/lookup/getAllById/1083');
}

/**
 * 新增设备信息
 * @param {*}
 */
export async function addDevice(equipment) {
  return request(`${pref}/device/create`, {
    method: 'post',
    data: {
      ...equipment,
      method: 'post',
    },
  });
}

/**
 * 修改设备信息
 * @param {*}
 */
export async function updateDevice(equipment) {
  return request(`${pref}/device/update`, {
    method: 'put',
    data: {
      ...equipment,
      method: 'put',
    },
  });
}

/**
 * 删除设备信息
 * @param {*} id  设备id
 */
export async function delByDeviceId(id) {
  return request(`${pref}/device/delete/${id}`, {
    method: 'DELETE',
  });
}
