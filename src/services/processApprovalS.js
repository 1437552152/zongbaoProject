import request from '@/utils/request'

const pref = '/services/monitor'

/**
 * 
 */
// export async function getAllProcess () {
//   return request(`${pref}/device/list`)
// }

export async function getAllProcess(areaId) {
  return request(`${pref}/flowstep/getStep/${areaId}`);
}

/**
 * 
 */
export async function getAllArea () {
  return request(`${pref}/area/list`)
}

// 得到流程树
export async function getnewProcess() {
  return request(`/services/monitor/flow/getFlow`);
}