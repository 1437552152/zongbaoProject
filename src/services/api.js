/* eslint-disable no-unreachable */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable no-else-return */
/* eslint-disable camelcase */
import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

// 导出excel
function exportExcelService1(path, fileName) {
  return new Promise((resolve, rej) => {
    fetch(path, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'default',
      dataType: 'application/excel;charset=utf-8',
    }).then(function(response) {
      localStorage.setItem('selectedRowKeys', '');
      if (response.status === 403) {
        message.error('无权操作');
      } else if (response.status === 200) {
        response
          .blob()
          .then(blob => {
            if (blob.size < 500) {
              message.error('文件下载失败，请稍后再试');
              return;
            }
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            if (fileName == null) {
              fileName = 'default_excel_name';
            }
            a.download = `${fileName}.xls`;
            if (document.all) {
              a.click();
              resolve(false);
            } else {
              const evt = document.createEvent('MouseEvents');
              evt.initEvent('click', true, true);
              a.dispatchEvent(evt);
              resolve(false);
            }
          })
          .catch(error => {
            console.log(error);
            resolve(false);
          });
      }
    });
  }).catch(err => {
    console.log(err);
  });
}
// 导出
export async function exportData(params) {
  const {
    page,
    pageSize,
    alarmTime,
    lastUpdateDate,
    handlePicStatus,
    deviceCode,
    deviceAddress,
    status,
    areaId
  } = params;
  const path = `/services/monitor/alarm/export`;
  const path1 = `/services/monitor/alarm/export?Q=status_EQ=01`;
  if (
    params.alarmTime ||
    params.lastUpdateDate ||
    params.handlePicStatus ||
    params.deviceCode ||
    params.deviceAddress ||
    params.status ||
    params.areaId
  ) {
    exportExcelService1(path1, '导出excel').then();
  } else {
    exportExcelService1(path, '导出excel').then();
  }
}

export async function FireControlListqy(params) {
  const {
    page,
    pageSize,
    areaId,
    alarmTime,
    lastUpdateDate,
    handlePicStatus,
    deviceCode,
    deviceAddress,
    status,
  } = params;
  console.log('params==>', params);
  return request(`/services/monitor/alarm/getAlarmByAreaId/${areaId}/${page}/${pageSize}`);
}

export async function FireDeviceControlList(params) {
  const {
    page,
    pageSize,
    deviceId,
    alarmTime,
    deviceAddress,
    lastUpdateDate,
    handlePicStatus,
    status,
  } = params;
  let finaltext = '';
  let text = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const n in params) {
    if (n === 'alarmTime' && alarmTime != '' && alarmTime != undefined) {
      text = `${text}Q=alarmTime_D_GE=${alarmTime}&`;
    } else if (n === 'lastUpdateDate' && lastUpdateDate != '' && lastUpdateDate != undefined) {
      text = `${text}Q=lastUpdateDate_D_LE=${lastUpdateDate}&`;
    } else if (n === 'deviceAddress' && deviceAddress != '' && deviceAddress != undefined) {
      text = `${text}Q=deviceAddress_LK=${deviceAddress}&`;
    } else if (n === 'handlePicStatus' && handlePicStatus != '' && handlePicStatus != undefined) {
      text = `${text}Q=handlePicStatus_EQ=${handlePicStatus}&`;
    } else if (n === 'status' && status != '' && status != undefined) {
      text = `${text}Q=status_EQ=${status}&`;
    } else if (n === 'deviceId' && deviceId != '' && deviceId != undefined) {
      text = `${text}Q=deviceId_EQ=${deviceId}&`;
    }
  }
  finaltext = text.substring(0, text.lastIndexOf('&'));
  if (finaltext && finaltext.length > 0) {
    return request(`/services/monitor/alarm/list/${page}/${pageSize}?${finaltext}`);
  } else {
    return request(`/services/monitor/alarm/list/${page}/${pageSize}`);
  }
}

export async function getFireControlList(params) {
  const { page, pageSize, type, alarmTime, lastUpdateDate, handlePicStatus, status } = params;
  let finaltext = '';
  let text = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const n in params) {
    if (n === 'alarmTime' && alarmTime != '' && alarmTime != undefined) {
      text = `${text}Q=alarmTime_D_GE=${alarmTime}&`;
    } else if (n === 'lastUpdateDate' && lastUpdateDate != '' && lastUpdateDate != undefined) {
      text = `${text}Q=lastUpdateDate_D_LE=${lastUpdateDate}&`;
    } else if (n === 'handlePicStatus' && handlePicStatus != '' && handlePicStatus != undefined) {
      text = `${text}Q=handlePicStatus_EQ=${handlePicStatus}&`;
    } else if (n === 'status' && status != '' && status != undefined) {
      text = `${text}Q=status_EQ=${status}&`;
    }
  }
  finaltext = text.substring(0, text.lastIndexOf('&'));
  if (finaltext && finaltext.length > 0) {
    return request(`/services/monitor/home/listAlarms/${type}/${page}/${pageSize}?${finaltext}`);
  } else {
    return request(`/services/monitor/home/listAlarms/${type}/${page}/${pageSize}`);
  }
}

export async function FireControlList(params) {
  const {
    Q,
    page,
    pageSize,
    areaId,
    alarmTime,
    lastUpdateDate,
    handlePicStatus,
    deviceCode,
    deviceAddress,
    status,
  } = params;
  let finaltext = '';
  let text = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const n in params) {
    if (n === 'alarmTime' && alarmTime != '' && alarmTime != undefined) {
      text = `${text}Q=alarmTime_D_GE=${alarmTime}&`;
    } else if (n === 'lastUpdateDate' && lastUpdateDate != '' && lastUpdateDate != undefined) {
      text = `${text}Q=lastUpdateDate_D_LE=${lastUpdateDate}&`;
    } else if (n === 'deviceAddress' && deviceAddress != '' && deviceAddress != undefined) {
      text=`${text}Q=deviceAddress_LK=${deviceAddress}&`;
    } else if (n === 'handlePicStatus' && handlePicStatus != '' && handlePicStatus != undefined) {
      text = `${text}Q=handlePicStatus_EQ=${handlePicStatus}&`;
    } else if (n === 'deviceCode' && deviceCode != '' && deviceCode != undefined) {
      text = `${text}Q=deviceCode_LK=${deviceCode}&`;
    } else if (n === 'status' && status != '' && status != undefined) {
      text = `${text}Q=status_EQ=${status}&`;
    } else if (n === 'Q' && Q != '' && Q != undefined) {
      text = `${text}Q=${Q}&`;
    }
  }
  finaltext = text.substring(0, text.lastIndexOf('&')); // 这样就获取到了前面的字符串。
  if (finaltext && finaltext.length > 0) {
    return request(
      `/services/monitor/alarm/getAlarmByAreaId/${areaId}/${page}/${pageSize}?${finaltext}`
    );
  } else {
    return request(`/services/monitor/alarm/getAlarmByAreaId/${areaId}/${page}/${pageSize}`);
  }
}

// 删除
export async function deleteData(id) {
  return request(`/services/monitor/alarm/delete/${id}`, {
    method: 'delete',
    // data
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// export async function FireDeviceControl(id) {
//   return request(`/services/monitor/alarm/get/${id}`);
// }
// 更改图片状态
export async function updateStatus(params) {
  return request(`/services/monitor/alarm/update/`, {
    method: 'put',
    data: {
      ...params,
      method: 'put',
    },
  });
}
// 预览图片
export async function wdfilePic(params) {
  const {handlePicId}=params;
  return request(`/services/monitor/wdfile/check/${handlePicId}`)
}

// 查看方案详情
export async function getPlanDetail(params) {
  const {planId}=params;
  return request(`/services/monitor/alarm/getPlanDetail/${planId}`)
}