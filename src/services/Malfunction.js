import request from '@/utils/request';
import { WarningStatus } from '../pages/SysIop/config';

const pref = '/services/monitor';

// 获取报警数
export async function getWarnings(areaId) {
  return request(`${pref}/malfunction/count/${areaId}`);
}

// 获取报警列表
export async function getWarningList({ areaId, page, pageSize, warningType }) {
  return request(`${pref}/malfunction/list/${areaId}/${page}/${pageSize}?Q=type_EQ=${warningType}`);
}

// 误报
export async function setFalsePositive({ id, attachmentId }) {
  return request(`${pref}/malfunction/update`, {
    method: 'put',
    data: {
      id,
      attachmentId,
      status: WarningStatus.processed,
    },
  });
}

// 获取流程树
export async function getProcessTree() {
  return request(`${pref}/flow/getOrderFlow`);
}

// 获取责任人和派工人员
// type  1 责任人 2 派工人员
export async function getMemberByType(type) {
  return request(`${pref}/person/listPersonByType/${type}`);
}

// 获取部门列表
export async function getDepartmentList() {
  return request(`${pref}/company/listDepartment`);
}

// 获取区域树（区域/建筑/楼层/房间）
export async function getAreaTreeWithRoom() {
  return request(`${pref}/area/listAreas/4?Q=fid_EQ=1`);
}

// 创建表单
export async function createOrder({ id, data }) {
  return request(`${pref}/malfunction/createOrder/${id}`, {
    method: 'post',
    data,
  });
}
