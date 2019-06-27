import request from '@/utils/request';


const pref = '/services/monitor/area';
export async function queryBasicRecordview(id) {
    return request(`/api/profile/basic?id=${id}`);
  }
  
export async function queryAdvancedRecordview() {
    return request('/api/profile/advanced');
  }

export async function getAreaTreeWithDevices() {
    return request(`${pref}/listAreaMenus`);
  }

  export async function getWarnings(areaId) {
    return request(`/services/monitor/malfunction/count/${areaId}`);
  }