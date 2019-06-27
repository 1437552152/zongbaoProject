import request from '@/utils/request';
// import { stringify } from 'qs';
// 获取设备类型列表
// eslint-disable-next-line import/prefer-default-export
export async function getPlanList(params) {
  const { page, pageSize } = params;
  return request(`/services/monitor/scheme/list/${page}/${pageSize}`);
}
export async function addPlan(params) {
  return request(`/services/monitor/scheme/create`, {
    method: 'POST',
    data: { params },
  });
}

export async function schedulelist(params) {
  const { schemeId, startTime, endTime } = params;
  return request(
    `/services/monitor/schedule/list?Q=schemeId_I_EQ=${schemeId}&Q=startTime_D_EQ=${startTime}&Q=endTime_D_EQ=${endTime}`
  );
}

// 得到流程树
export async function getnewProcess(params) {
  return request(`/services/monitor/flow/getFlow`);
}

// 增加流程
export async function addProcess(params) {
  return request(`/services/monitor/flow/create`, {
    method: 'POST',
    data: params,
  });
}

// 删除流程
export async function deteleProcess(params) {
  const { id } = params;
  return request(`/services/monitor/flow/delete/${id}`, {
    method: 'DELETE',
  });
}

// 步骤
export async function flowstep(params) {
  const { flowId } = params;
  return request(`/services/monitor/flowstep/getByFlow/${flowId}`);
}

// 更新步骤
export async function flowstepUpdate(params) {
  return request(`/services/monitor/flowstep/update`, {
    method: 'PUT',
    data: params,
  });
}

// 删除步骤
export async function flowstepDelete(params) {
  const { id } = params;
  return request(`/services/monitor/flowstep/delete/${id}`, {
    method: 'DELETE',
  });
}

// 新增步骤
export async function flowstepCreate(params) {
  return request(`/services/monitor/flowstep/create`, {
    method: 'POST',
    data: params,
  });
}

// 提交步骤审核
export async function commitstep(params) {
  const { flowId } = params;
  return request(`/services/monitor/flowstep/commit/${flowId}`, {
    method: 'POST',
    data: {},
  });
}

// 获得组数据
export async function getGroupData() {
  return request(`/services/monitor/group/list`);
}

// 获取tree中的人员信息列表
export async function listBindPersonGroup(params) {
  const { groupId, positionLevel } = params;
  if (positionLevel) {
    return request(
      `/services/monitor/person/listBindPersonGroup/${groupId}?Q=positionLevel_EQ=${positionLevel}`
    );
  }
  return request(`/services/monitor/person/listBindPersonGroup/${groupId}`);
}
