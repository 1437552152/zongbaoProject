import request from '@/utils/request';
/**
 * 停车场管理假数据
 */
export async function getParkingManagement(id) {
  return request(`/api/ParkingManagement/Get?buildingId=${id}`);
}
