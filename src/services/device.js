import { stringify } from 'qs';
import request from '@/utils/request';

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
export async function setFalsePositive(id) {
  return request(`${pref}/malfunction/update`, {
    method: 'put',
    data: {
      id,
      status: '02',
    },
  });
}

// 获取工单类型可选值列表
export async function getOrderTypes() {
  return request(`${pref}/lookup/getAllById/1318`);
}

// 获取工单状态可选值列表
export async function getOrderStates() {
  return request(`${pref}/lookup/getAllById/1338`);
}

// 获取设备列表
export async function getDeviceList() {
  return request('/services/monitor/device/list');
}

// 获取设备详情
export async function getDeviceInfo(id) {
  return request(`/services/monitor/device/get/${id}`);
}

// 新增设备
export async function createDevice(params) {
  return request('/services/monitor/device/create', {
    method: 'POST',
    data: params,
  });
}

// 修改设备
export async function updateDevice(params) {
  return request('/services/monitor/device/update', {
    method: 'PUT',
    data: params,
  });
}

// 获取区域信息
export async function getAreasTree() {
  return request(`/services/monitor/area/listAllAreas`);
}

// 获取设备类型列表
export async function getDeviceTypes() {
  return request('/services/monitor/lookup/getFirstFloorById/1083');
}

// 查询所有已关联设备
export async function getAssociateDevices({ id, query }) {
  const param = [`deviceId_S_LK=${id}`];
  if (query) {
    const pid = query.floor || query.building || query.area;
    if (pid) {
      param.push(`areaId_S_LK=${pid}`);
    }
    if (query.type) {
      param.push(`type_S_LK=${query.type}`);
    }
  }

  return request(
    `/services/monitor/DeviceRelation/list?${stringify({ Q: param }, { indices: false })}`
  );
}

// 删除设备的关联设备 => 这里的 id 为设备关联表的 id
export async function deleteAssociateDevice(id) {
  return request(`/services/monitor/DeviceRelation/delete/${id}`, {
    method: 'delete',
  });
}

// 关联设备
export async function createDeviceAssociate({ id, lid }) {
  return request('/services/monitor/DeviceRelation/create', {
    method: 'POST',
    data: {
      deviceId: id,
      deviceRelationId: lid,
    },
  });
}

// 可关联设备查询 todo:
export async function getLinkableDevices({ id, floor, type }) {
  return request(
    `/services/monitor/DeviceRelation/unrelationDevices/${id}?Q=areaId_S_LK=${floor}&Q=type_S_LK=${type}`
  );
}
// 自助联动管理列表
export async function planNodelist() {
  return request(`/services/monitor/planNode/list`);
}

// 设备状态维护
export async function getAllDeviceTypeById(param) {
  const { id } = param;
  return request(`/services/monitor/lookup/getAllDeviceTypeById/${id}`);
}

// 发布自助联动管理以及推荐联动管理公用一个接口
export async function planCreate(param) {
  const { planIds, alarmId, areaId, detail } = param;
  return request('/services/monitor/plan/create', {
    method: 'POST',
    data: {
      planIds,
      alarmId,
      areaId,
      detail,
    },
  });
}

// 推荐联动管理列表
export async function recommondlist(param) {
  const { type } = param;
  return request(`/services/monitor/plan/getRecommendPlan/${type}`);
}

// 运行状态维护
export async function getAllDeviceStatus(param) {
  const { id } = param;
  return request(`rvices/monitor/lookup/getAllDeviceStatusById/${id}`);
}

// 流程审批
export async function queryBasicProfile(id) {
  return request(`${pref}/flowstep/get/${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}
export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}
export async function getAllProcess(areaId) {
  return request(`${pref}/flowstep/getStep/${areaId}`);
}

export async function ProcessNode(parmas) {
  const { keypoint, approvalStatus, id } = parmas;
  console.log(parmas);
  return request(`${pref}/flowstep/audit`, {
    method: 'PUT',
    data: {
      keypoint,
      approvalStatus,
      id,
    },
  });
}

export async function getStepStep(stepId) {
  return request(`${pref}/flowstepapprovaldetails/getStepFlow/${stepId}`);
}

export async function getStepDetail(id) {
  return request(`${pref}/flow/detail/${id}`);
}

// 大审批添加保存
export async function BigProcessNode(parmas) {
  const { id, approvalStatus, approvalOpinion } = parmas;
  console.log(parmas);
  return request(`${pref}/flow/update`, {
    method: 'PUT',
    data: {
      id,
      approvalStatus,
      approvalOpinion,
    },
  });
}

export async function getStDetail(id) {
  return request(`${pref}/flowstep/get/${id}`);
}
