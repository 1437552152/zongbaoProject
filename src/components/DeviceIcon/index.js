/*
 * @Desc: 设备图标
 * @Author: Jackie
 * @Date: 2019-05-15 20:13:35
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-15 20:18:41
 */
import React from 'react';
import styles from './index.less';
import { getStatusColor, getTypeStr } from '@/utils/area';

const DeviceIcon = props => {
  const {
    item: { type, status, xAxis, yAxis },
    onClick,
  } = props;
  // 根据设备状态以及设备类别，找到唯一设备图片
  const src = `./assets/watchdogs/${getTypeStr(type)}_${getStatusColor(status)}.png`;
  // 根据设备位置，生成百分比布局
  const top = yAxis === undefined ? `5%` : `${yAxis}%`;
  const left = xAxis === undefined ? `5%` : `${xAxis}%`;
  const showPointerStyle = onClick ? { cursor: 'pointer' } : {};
  const style = { top, left, ...showPointerStyle };

  return <img alt="temp" className={styles.watchdog} src={src} style={style} onClick={onClick} />;
};
export default DeviceIcon;
