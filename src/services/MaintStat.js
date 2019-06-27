import request from '@/utils/request';

const pref = '/services/monitor';

/**
 * 获取所有设备数据
 */
export async function getAllDevice() {
  return request(`${pref}/lookup/getAllDeviceTypeById/1083`);
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
  console.log(equipment);
  return request(`${pref}/lookup/create`, {
    method: 'post',
    data: {
      parentId: 1083,
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
