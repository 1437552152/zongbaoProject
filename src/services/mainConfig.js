import request from '@/utils/request';

const pref = '/services/monitor';

/**
 * 获取所有运维配置数据
 */
export async function getAllMainConfig(id) {
  return request(`${pref}/lookup/getAllById/${id}`);
}

/**
 * 新增配置信息
 * @param {*}
 */
export async function addMainConfig(mainconfig) {
  return request(`${pref}/lookup/create`, {
    method: 'post',
    data: {
      ...mainconfig,
      method: 'post',
    },
  });
}

/**
 * 修改配置信息
 * @param {*}
 */
export async function updateMainConfig(mainconfig) {
  return request(`${pref}/lookup/update`, {
    method: 'put',
    data: {
      ...mainconfig,
      method: 'put',
    },
  });
}

/**
 * 删除配置信息
 * @param {*} id  配置id
 */
export async function delByMainConfigId(id) {
  return request(`${pref}/lookup/delete/${id}`, {
    method: 'DELETE',
  });
}
