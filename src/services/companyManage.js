import request from '@/utils/request';
import { getQueryUrl } from '@/utils/queryFilter';

const pref = '/services/monitor/area';
const firstpref = '/services/monitor';

/**
 * 获取区域所有的公司
 */
export async function getCompanysByArea() {
  return request(`${pref}/getCompanysByArea`);
}

/**
 * 获取公司信息
 */
export async function getCompanyInfo(id) {
  return request(`/services/monitor/company/get/${id}`);
}

/**
 * 获取公司所有部门
 * id 公司ID
 */
export async function listDepartmentByCompany(id) {
  return request(`${pref}/listDepartmentByCompany/${id}`);
}

/**
 * 获取公司所有区域
 * 类型 001区域 002楼栋 003楼层 004值班室 005工作室 006配电房
 */
export async function getAreasByType() {
  return request(`${pref}/getAreasByType/001`);
}

/**
 * 跟新公司信息
 * @returns {Promise<void>}
 */
export async function updateCompanyInfo(param) {
  return request(`/services/monitor/company/update`, {
    method: 'put',
    data: {
      ...param,
    },
  });
}

/**
 * 删除公司
 */
export async function deleteCompany(id) {
  return request(`/services/monitor/company/delete/${id}`, {
    method: 'delete',
  });
}

/**
 * 添加公司或部门
 */
export async function addCompanyOrDepartment(params) {
  return request(`/services/monitor/company/create`, {
    method: 'post',
    data: {
      ...params,
    },
  });
}

/**
 * 查询部门的组
 */
export async function getGroupByDepart(param) {
  return request(`${firstpref}/group/list?Q=companyId_EQ=${param}`);
}

/**
 * 添加部门的组
 */
export async function addGroup(params) {
  return request(`${firstpref}/group/create`, {
    method: 'post',
    data: {
      ...params,
    },
  });
}

/**
 * 删除部门的组
 */
export async function deleteGroup(params) {
  return request(`${firstpref}/group/delete/${params.id}`, {
    method: 'delete',
  });
}

/**
 * 获取分组绑定的人员信息列表
 */
export async function listBindPerson({ id, page, pageSize, ...rest }) {
  return request(
    `${firstpref}/person/listBindPersonGroup/${id}/${page}/${pageSize}${getQueryUrl(rest)}`
  );
}

/**
 * 获取分组未绑定人员信息列表
 */
export async function listUnBindPerson({ page, pageSize, ...rest }) {
  return request(
    `${firstpref}/person/listUnBindPersonGroup/${page}/${pageSize}${getQueryUrl(rest)}`
  );
}

/**
 * 绑定分组人员信息
 * @param {*} params
 */
export async function bindPerson(params) {
  return request(`${firstpref}/person/bindPersonGroup/${params.id}`, {
    method: 'POST',
    data: params.ids,
  });
}

/**
 * 解除绑定分组人员信息
 * @param {*} params
 */
export async function delBindPerson(params) {
  return request(`${firstpref}/person/delPersonGroup/${params.id}`, {
    method: 'DELETE',
    data: params.ids,
  });
}
