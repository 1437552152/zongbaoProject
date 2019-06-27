/*
 * @Desc: 设备图标(可拖动)
 * @Author: Jackie
 * @Date: 2019-05-15 20:13:35
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-15 20:18:41
 */
import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import styles from './index.less';
import { getStatusColor, getTypeStr } from '@/utils/area';

export default class DeviceIcon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
    };
  }

  fn = ev => {
    const disx = ev.pageX;
    const disy = ev.pageY;
    document.onmousemove = evs => {
      this.setState({
        x: evs.pageX - disx,
        y: evs.pageY - disy,
      });
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmousedown = null;
      const { item, onMouseUp } = this.props;
      if (onMouseUp) {
        const ele = document.getElementById(item.id);
        if (ele) {
          const parEle = ele.parentElement;
          if (parEle) {
            const left = ((ele.clientWidth / 2 + ele.offsetLeft) / parEle.clientWidth) * 100;
            const top = ((ele.clientHeight / 2 + ele.offsetTop) / parEle.clientHeight) * 100;
            if (left !== item.xAxis || top !== item.yAxis) {
              item.xAxis = left;
              item.yAxis = top;
              onMouseUp(item);
              this.setState({ x: 0, y: 0 });
            }
          }
        }
      }
    };
  };

  render() {
    const {
      item: { type, status, xAxis, yAxis, id, name },
      onClick,
      onMouseUp,
    } = this.props;
    const { x, y } = this.state;
    // 根据设备状态以及设备类别，找到唯一设备图片
    const src = `./assets/watchdogs/${getTypeStr(type)}_${getStatusColor(status)}.png`;
    // 根据设备位置，生成百分比布局
    let top = yAxis === undefined ? 5 : yAxis;
    let left = xAxis === undefined ? 5 : xAxis;
    if (onMouseUp) {
      const ele = document.getElementById(id);
      if (ele) {
        const parEle = ele.parentElement;
        if (parEle) {
          left += (x / parEle.clientWidth) * 100;
          top += (y / parEle.clientHeight) * 100;
        }
      }
    }
    top += '%';
    left += '%';

    const showPointerStyle = onClick ? { cursor: 'pointer' } : {};
    const style = { top, left, ...showPointerStyle };
    return (
      <Tooltip title={name}>
        <img
          id={id}
          onMouseDown={e => onMouseUp && this.fn(e)}
          alt="temp"
          className={styles.watchdog}
          src={src}
          style={style}
          onClick={onClick}
        />
      </Tooltip>
    );
  }
}
