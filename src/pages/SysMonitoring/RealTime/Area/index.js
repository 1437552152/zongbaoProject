/*
 * @Desc: 区域
 * @Author: Jackie
 * @Date: 2019-05-09 17:46:30
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-06-19 10:59:54
 */
import React, { PureComponent } from 'react';
import {
  // Tooltip,
  Spin,
  // Icon,
  Card,
  Empty,
  message,
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import classnames from 'classnames';
import PickerView from '@/components/PickerView/';
import DeviceIcon from '@/components/DeviceIcon';
import styles from './index.less';

@connect(({ area, loading }) => ({
  area,
  loading: loading.models.area,
}))
class Area extends PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    this.loadData(id);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const nextId = nextProps.match.params.id;
    if (id !== nextId) {
      this.loadData(nextId);
    }
  }

  componentWillUnmount() {
    this.clear();
  }

  loadData = id => {
    this.clear();
    const { dispatch } = this.props;
    dispatch({
      type: 'area/fetchFloorList',
      payload: id,
      callback: areaId => {
        this.loadDeviceListById(areaId);
      },
    });
  };

  clear = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'area/clear',
    });
  };

  // 点击监控
  onDeviceClick = item => {
    router.push(`/monitoring/realtime/equipment/${item.id}?type=device`);
  };

  onChangeBtnClick = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`${id}/control`);
  };

  // 获取楼层信息
  loadDeviceList = index => {
    const {
      area: { floorList },
    } = this.props;
    const curFloor = floorList[index];
    if (curFloor) {
      this.loadDeviceListById(curFloor.id);
    }
  };

  loadDeviceListById = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'area/setBg',
      payload: id,
    });

    dispatch({
      type: 'area/fetchDeviceList',
      payload: id,
    });
  };

  // 楼层初始化
  onSlideInited = index => {
    this.loadDeviceList(index);
  };

  // 楼层切换
  onSlideItemChange = index => {
    if (index !== undefined && index > -1) this.loadDeviceList(index);
  };

  renderCardTitle = () => {
    return (
      <div className={styles.title}>
        <img src="./assets/zone/quyu.png" alt="" />
        <span>区域</span>
      </div>
    );
  };

  renderTag = (backgroundColor, text) => {
    return (
      <>
        <div style={{ backgroundColor }} />
        <span>{text}</span>
      </>
    );
  };

  renderTags = () => {
    return (
      <div className={styles.tags}>
        {this.renderTag('#FF6868', '报警')}
        {this.renderTag('#17B517', '正常')}
        {this.renderTag('#FFA913', '故障')}
        {this.renderTag('#A9A9A9', '离线')}
      </div>
    );
  };

  renderCardExtra = () => {
    return (
      <a
        onClick={() => {
          this.onChangeBtnClick();
        }}
        style={{ fontSize: 15, fontWeight: 'bold' }}
      >
        历史记录
      </a>
      // <Tooltip title="历史记录">
      //   <Icon
      //     type="swap"
      //     onClick={() => {
      //       this.onChangeBtnClick();
      //     }}
      //   />
      // </Tooltip>
    );
  };

  render() {
    const {
      area: { defaultId, floorList, deviceList, bg },
      loading,
      dispatch,
    } = this.props;
    const cls = classnames('card_container', styles.card);
    return (
      <Spin spinning={loading}>
        <Card
          title={this.renderCardTitle()}
          extra={this.renderCardExtra()}
          className={cls}
          bodyStyle={{ paddingTop: 12 }}
        >
          {floorList && floorList.length > 0 ? (
            <div className={styles.contentContainer}>
              <PickerView
                col={1}
                data={[floorList]}
                value={[defaultId]}
                cascade={false}
                listStyle={{
                  width: 60,
                  height: '100%',
                  marginLeft: -1,
                }}
                colWidth={60}
                onChange={value => this.loadDeviceListById(value[0])}
              />
              <div className={styles.mapContainerScroll}>
                <div className={styles.mapContainer}>
                  {bg && (
                    <img
                      className={styles.imgBg}
                      src={bg}
                      alt="alt"
                      onError={() => {
                        message.info('该区域无图层');
                        dispatch({ type: 'area/save', payload: { bg: null } });
                      }}
                    />
                  )}
                  {deviceList &&
                    deviceList.map(item => (
                      <DeviceIcon
                        key={item.id}
                        item={item}
                        onClick={() => this.onDeviceClick(item)}
                      />
                    ))}
                </div>
              </div>
              {this.renderTags()}
            </div>
          ) : (
            <Empty />
          )}
        </Card>
      </Spin>
    );
  }
}

export default Area;
