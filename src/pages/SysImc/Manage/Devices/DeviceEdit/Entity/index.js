import loadBasicInfo from './basic';
import loadVideoInfo from './video';
import loadTransformerInfo from './transformer';
import loadDoorInfo from './door';
import loadElectricityInfo from './electricity';
import loadFirefightingInfo from './firefighting';
import loadLedInfo from './led';
import loadCommonInfo from './common';

const loadData = (dType = '01', subType, res = {}) => {
  const { deviceCCTV = {}, deviceTransformer = {}, deviceDoor = {}, data = {}, ...device } = res;
  let basicInfo = []; // { mark: '', info:  } 对象，mark: 'card'，'image', 'space' 三种类型
  const dTtypeStr = `${dType}`;
  switch (dTtypeStr) {
    case '01':
    case '04': {
      // 01消防，04火灾 下面的所有子类型，都有扩展属性
      basicInfo = loadFirefightingInfo(data, device);
      break;
    }
    case '02': {
      // 02视频监控下面的所有子类型都有扩展属性
      basicInfo = loadVideoInfo(deviceCCTV, device);
      break;
    }
    case '05': {
      // 05）安全
      if (`${subType}` === '0501') {
        // 门禁设备
        basicInfo = loadDoorInfo(deviceDoor, device);
      } else if (`${subType}` === '0503') {
        // 视频告警设备
        basicInfo = loadVideoInfo(deviceCCTV, device);
      } else {
        basicInfo = loadBasicInfo(device);
      }
      break;
    }
    case '07': {
      if (`${subType}` === '0701') {
        // 气象站
        basicInfo = loadElectricityInfo(data, device);
      } else {
        basicInfo = loadBasicInfo(device);
      }
      break;
    }
    case '09': {
      // (09）物联网：
      if (
        `${subType}` === '0901' ||
        `${subType}` === '0902' ||
        `${subType}` === '0903' ||
        `${subType}` === '0904'
      ) {
        // （0901）智能水表 （0902）智能电表 （0903）智能井盖 （0904）水位计
        basicInfo = loadElectricityInfo(data, device);
      } else {
        basicInfo = loadBasicInfo(device);
      }
      break;
    }
    case '10': {
      // 广播大屏
      if (`${subType}` === '1002') {
        // 大屏设备
        basicInfo = loadLedInfo(data, device);
      } else {
        basicInfo = loadBasicInfo(device);
      }
      break;
    }
    case '11': {
      // 配电
      if (`${subType}` === '1101') {
        // 变压器
        basicInfo = loadTransformerInfo(deviceTransformer, device);
      } else {
        basicInfo = loadBasicInfo(device);
      }
      break;
    }
    default:
      basicInfo = loadBasicInfo(device);
      break;
  }

  const commonInfo = loadCommonInfo(dType, subType, deviceTransformer, device);

  return {
    basicInfo,
    commonInfo,
  };
};

export default loadData;
