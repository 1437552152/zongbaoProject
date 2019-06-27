import request from '@/utils/request';

const pref = '/services/monitor';

// 获取工单类型可选值列表
export async function getOrderTypes() {
  return request(`${pref}/lookup/getAllById/1318`);
}

// 获取工单状态可选值列表
export async function getOrderStates() {
  return request(`${pref}/lookup/getAllById/1338`);
}

export async function getOrderDetail(orderId) {
  return request(`${pref}/workorder/detail/${orderId}`);
}

export async function getOrderAreaTree({ type, state, beginDate, endDate }) {
  return request(
    `${pref}/workorder/getArea?Q=type_EQ=${type}&Q=status_EQ=${state}&Q=orderTime_D_GE=${beginDate}&Q=orderTime_D_LE=${endDate}`
  );
}

export async function getOrderList({ areaId, type, state, beginDate, endDate, page, pageSize }) {
  return request(
    `${pref}/workorder/list/${areaId}/${page}/${pageSize}?Q=type_EQ=${type}&Q=status_EQ=${state}&Q=orderTime_D_GE=${beginDate}&Q=orderTime_D_LE=${endDate}`
  );
}

// 工单结果录入时工单详情
export async function getOrderResultDetail(id) {
  return request(`${pref}/workorderresult/detail/${id}`);
}

// 获取字典表数据
export async function getDictList(code) {
  return request(`${pref}/lookup/list?Q=groupCode_EQ=${code}&Q=parentId_NE=0`);
}

// 派工单录入
export async function recordWorkOrder(values) {
  return request(`${pref}/workorderresult/save`, {
    method: 'post',
    data: {
      ...values,
    },
  });
}

// 获取工单录入详情
export async function getOrderRecordDetail(id) {
  return request(`${pref}/workorderresultcheck/getOrderCheck/${id}`);
}

// 工单详情
export async function getWorkOrderDetail(id) {
  return request(`${pref}/workorder/detail/${id}`);
}

// 工单查验
export async function checkOrder(payload) {
  return request(`${pref}/workorderresultcheck/update`, {
    method: 'put',
    data: {
      ...payload,
    },
  });
}

export async function updateStep({ orderId, stepId }) {
  return request(`${pref}/flowstep/action/${orderId}/${stepId}`, {
    method: 'post',
  });
}

// 工单处理步骤详情列表
export async function getOrderProcessRecord(id) {
  return request(`${pref}/flowstepapprovaldetails/getDetailFlow/${id}`);
}
