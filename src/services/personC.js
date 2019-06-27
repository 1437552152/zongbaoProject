import request from '@/utils/request';

const pref = '/services/monitor';

/**
 * 获取所有人员数据
 */
export async function getAllPerson() {
  return request(`${pref}/person/list`);
}

/**
 * 获取人员所有区域
 */
export async function getAllArea(id) {
  return request(`${pref}/person/getAreaNameByPerson/${id}`);
}

/**
 * 新增人员信息
 * @param {*}
 */
export async function addPerson(person) {
  return request(`${pref}/person/create`, {
    method: 'post',
    data: {
      ...person,
      method: 'post',
    },
  });
}

/**
 * 修改人员信息
 * @param {*}
 */
export async function updatePerson(person) {
  return request(`${pref}/person/update`, {
    method: 'put',
    data: {
      ...person,
      method: 'put',
    },
  });
}

/**
 * 删除人员信息
 * @param {*} id  人员id
 */
export async function delByPersonId(id) {
  return request(`${pref}/person/delete/${id}`, {
    method: 'DELETE',
  });
}
