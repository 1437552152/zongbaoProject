import request from '@/utils/request';

const pref = '/services/monitor';

// 根据parent ID获取设备类型
export async function getDeviceTypeById(parentId) {
  return request(`${pref}/lookup/getDeviceTypeById/${parentId}`);
}

/**
 * 获取所有设备数据
 */
export async function getAllDevice(id) {
  return request(`${pref}/lookup/getAllDeviceTypeById/${id}`);
}

export async function getAllDevice1(param) {
  const { id } = param;
  return request(`${pref}/lookup/getAllAlarmTypeById/${id}`);
}

/**
 * 获取所有区域
 */
export async function getAllArea() {
  return request(`${pref}/area/list`);
}

/**
 * 新增设备信息
 * @param {*}
 */
export async function addDevice(equipment) {
  return request(`${pref}/lookup/create`, {
    method: 'post',
    data: {
      ...equipment,
      // method: 'post',
    },
  });
}

/**
 * 修改设备信息
 * @param {*}
 */
export async function updateDevice(equipment) {
  return request(`${pref}/lookup/update`, {
    method: 'put',
    data: {
      ...equipment,
    },
  });
}

/**
 * 删除设备信息
 * @param {*} id  设备id
 */
export async function delByDeviceId(id) {
  return request(`${pref}/lookup/delete/${id}`, {
    method: 'DELETE',
  });
}
