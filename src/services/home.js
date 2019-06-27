import request from '@/utils/request';

const moduleName = '/services/monitor/home';

/**
 * 首页设备报警记录
 */
export async function getAlarmInfo() {
  return request(`${moduleName}/listAlarmsCount`);
}

export async function getAlarmlist({ type, page, pageSize }) {
  return request(`${moduleName}/listAlarms/${type}/${page}/${pageSize}`);
}
// 获取设备的视频监控信息
export async function getMonitorVideos(params) {
  return request(
    `/services/monitor/DeviceRelation/list?Q=deviceId_S_LK=${params.id}&Q=type_S_ST=02`
  );
}
