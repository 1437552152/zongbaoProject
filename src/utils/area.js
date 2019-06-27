// 红色001，黄色002，灰色003，绿色004.
export const getStatusColor = status => {
  let cl;
  switch (status) {
    case '001':
      cl = 'r';
      break;
    case '002':
      cl = 'y';
      break;
    case '003':
      cl = 'g';
      break;
    case '004':
      cl = 'lv';
      break;
    default:
      cl = 'g';
      break;
  }
  return cl;
};

// 设备类型 DEVICETYPE 视频监控设备01 消防喷淋设备02 周界告警设备 03 门禁设备 04 智能照明05 消防气体06
export const getTypeStr = typs => {
  let cl = 'sxt';
  switch (typs) {
    case '01':
      cl = 'sx';
      break;
    case '02':
      cl = 'penlin';
      break;
    case '03':
      cl = 'sxt';
      break;
    case '04':
      cl = 'men';
      break;
    case '05':
      cl = 'zm';
      break;
    case '06':
      cl = 'yanwu';
      break;
    default:
      break;
  }
  return cl;
};

export const getBg = (pid, floor) => `./assets/areas/${pid}/${floor}.png`;

export const getBgArea = areaId => `./assets/areas/${areaId}/area.png`;
