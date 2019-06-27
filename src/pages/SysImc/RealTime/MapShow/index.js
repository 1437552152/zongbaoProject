/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Select, Modal } from 'antd';
// eslint-disable-next-line import/no-unresolved
import BMap from 'BMap';
// import ReactEcharts from 'echarts-for-react';
import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';
import MonitorStream from '@/components/MonitorStream';
import SimpleTable from '@/components/SimpleTable';
import styles from './index.less';

const { Option } = Select;
let map;
@connect(({ home, loading }) => ({
  home,
  loading: loading.models.home,
}))
class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentArea: '1',
      currentdevice: '02',
      modalStatus: false,
      videovisible: 'none',
      tablevisible: 'block',
      deviceTcolumns: [
        {
          title: `编号`,
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: `名称`,
          dataIndex: 'name',
        },
        {
          title: '状态',
          dataIndex: 'flag',
          render: (text, record) => {
            let returnObj = '报警';
            if (record.flag === '0') {
              returnObj = '故障';
            } else if (record.flag === '1') {
              returnObj = '正常';
            }
            return returnObj;
          },
        },
        {
          title: '操作',
          dataIndex: 'flag',
          sorter: (a, b) => this.sortcolums(a.flag, b.flag),
          sortOrder: 'descend',
          render: (text, record) => {
            return record.flag === '0' ? (
              '无'
            ) : (
              <div
                style={{ color: '#140fef', cursor: 'pointer' }}
                onClick={() => this.showPlayer(record)}
              >
                [查看]
              </div>
            );
          },
        },
      ],
    };
  }

  componentDidMount() {
    map = new BMap.Map('map', { mapType: BMAP_HYBRID_MAP });
    map.centerAndZoom(new BMap.Point(114.489756, 30.436291), 17);
    const top_right_navigation = new BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      type: BMAP_NAVIGATION_CONTROL_SMALL,
    });
    map.addControl(top_right_navigation);
    const { location } = this.props;
    if (location.query && location.query.currentArea) {
      this.setState(
        {
          currentArea: location.query.currentArea,
          currentdevice: location.query.currentDevice,
        },
        () => {
          this.getdata();
          this.getmainData();
        }
      );
    } else {
      this.getdata();
      this.getmainData();
    }
  }

  getdata = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchDeviceType',
    });
    dispatch({
      type: 'home/fetchAreaTree',
      payload: { type: '1', id: '1' },
    });
  };

  getmainData = () => {
    const { dispatch } = this.props;
    const { currentArea, currentdevice } = this.state;
    dispatch({
      type: 'home/fetchDevicePoint',
      payload: { type: currentdevice, id: currentArea },
    });
    dispatch({
      type: 'home/fetchDTypeByareaAndtype',
      payload: { type: currentdevice, id: currentArea },
    });
  };

  addDevicePoints = () => {
    const {
      home: { devicePointList },
    } = this.props;
    this.clearPoint();
    devicePointList.forEach(item => {
      const point = {};
      point.lat = item.latitude;
      point.lon = item.longitude;
      point.type = 'device';
      point.attr = item;
      let status = '03';
      if (item.alarmDevicesCount > 0) {
        status = '01';
      } else if (item.malfunctionDeviceCount > 0) {
        status = '02';
      }
      point.status = status;
      this.addDevicepoint(point);
    });
  };

  addDevicepoint = point => {
    const mainConfigList = [];
    const pt = new BMap.Point(point.lat, point.lon);
    let myIcon = new BMap.Icon('./mapicon/red.png', new BMap.Size(28, 28));
    switch (point.status) {
      case '01':
        myIcon = new BMap.Icon('./mapicon/red.png', new BMap.Size(28, 28));
        break;
      case '02':
        myIcon = new BMap.Icon('./mapicon/cheng.png', new BMap.Size(28, 28));
        break;
      case '03':
        myIcon = new BMap.Icon('/mapicon/lv.png', new BMap.Size(28, 28));
        break;
      default:
        break;
    }
    point.attr.devices.forEach(item => {
      let { flag } = item;
      if (flag === '2') {
        flag = '0';
      }
      const maindevice = {
        name: item.name,
        flag,
        code: item.code,
        videoStream: item.videoStream,
      };
      mainConfigList.push(maindevice);
    });
    const marker = new BMap.Marker(pt, { icon: myIcon });
    map.addOverlay(marker);
    this.addDeviceClickHandler(mainConfigList, marker);
  };

  addDeviceClickHandler = (mainConfigList, marker) => {
    const { deviceTcolumns } = this.state;
    const that = this;
    marker.addEventListener('click', function get() {
      that.setState({
        modalStatus: true,
        videovisible: 'none',
        tablevisible: 'block',
        mainConfigList,
        deviceTcolumns,
      });
    });
  };

  modalonCancel = () => {
    this.setState({ modalStatus: false });
  };

  changeType = value => {
    this.setState(
      {
        currentdevice: value,
      },
      () => {
        this.getmainData();
      }
    );
  };

  getstatusOption = statusChartData => {
    const arrayName = [];
    const arrayValue = [];
    const arrayColor = [];
    for (let i = 0; i < statusChartData.length; i += 1) {
      const item = statusChartData[i];
      arrayName.push(item.name);
      arrayValue.push({ value: item.value, name: item.name });
      arrayColor.push(item.color);
    }
    const statusOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      calculable: true,
      series: [
        {
          type: 'pie',
          radius: '75%',
          center: ['50%', '45%'],
          startAngle: 180,
          itemStyle: {
            normal: {
              color(params) {
                return arrayColor[params.dataIndex];
              },
              label: {
                textStyle: {
                  fontWeight: 200,
                  fontSize: 16,
                },
                formatter: '{b} ：{c}',
              },
            },
          },
          data: arrayValue,
        },
      ],
    };
    return statusOption;
  };

  clearPoint = () => {
    if (map) {
      map.clearOverlays();
    }
  };

  fetchbuild = areaId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchBuildTree',
      payload: { type: '2', id: areaId },
    });
  };

  onAreaTreeSelect = selectedKeys => {
    const key = selectedKeys[0];
    this.setState(
      {
        currentArea: key,
      },
      () => {
        this.getmainData();
      }
    );
    this.fetchbuild(key);
  };

  fetchFloor = floorId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchCompanyTree',
      payload: { type: '3', id: floorId },
    });
  };

  onBuildTreeSelect = selectedKeys => {
    const key = selectedKeys[0];
    this.setState(
      {
        currentArea: key,
      },
      () => {
        this.getmainData();
      }
    );
    this.fetchFloor(key);
  };

  onCompanyTreeSelect = selectedKeys => {
    const key = selectedKeys[0];
    this.setState(
      {
        currentArea: key,
      },
      () => {
        this.getmainData();
      }
    );
  };

  onSearchTreeSelect = selectedKeys => {
    const key = selectedKeys[0];
    this.setState(
      {
        currentArea: key,
      },
      () => {
        this.getmainData();
      }
    );
  };

  onSearch = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/treeSearch',
      payload: value,
    });
  };

  renderContent() {
    const {
      home: { supportTypes, deviceListfirst },
    } = this.props;
    const {
      modalStatus,
      deviceTcolumns,
      selectVideoUrl,
      mainConfigList,
      videovisible,
      tablevisible,
      currentdevice,
    } = this.state;
    const deviceAll = [];
    deviceListfirst.forEach(item => {
      const device = {};
      device.name = item.DESP;
      device.hasfun = item.DEVICE_COUNT;
      device.total = item.DEVICE_TOTALCOUNT;
      device.rate = item.RATE;
      device.img = `./mapicon/zhGkong/${item.CODE}.png`;
      deviceAll.push(device);
    });

    this.addDevicePoints();
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <Modal className={styles.mapModal} visible={modalStatus} onCancel={this.modalonCancel}>
            <div style={{ paddingTop: 20, display: tablevisible }}>
              <SimpleTable columns={deviceTcolumns} dataSource={mainConfigList} />
            </div>
            <div style={{ display: videovisible }}>
              <img
                style={{ cursor: 'pointer' }}
                alt=""
                src="./mapicon/fanhui.png"
                onClick={this.hidePlayer}
              />
              <MonitorStream width={850} height={600} rtsp={selectVideoUrl} />
            </div>
          </Modal>
          <div id="map" className={styles.mapDiv} />
          <div className={styles.carDiv}>
            <div className={styles.tabTitleSle}>
              <p>请选择类型</p>
              <Select
                style={{ width: 180, marginLeft: 90 }}
                onChange={this.changeType}
                value={currentdevice}
              >
                {supportTypes.map(item => {
                  return <Option value={item.code}>{item.desp}</Option>;
                })}
              </Select>
            </div>
            {deviceAll.map(item => {
              return (
                <div className={styles.carTab}>
                  <div className={styles.carTableft}>
                    <li className={styles.carImg}>
                      <img alt="" src={item.img} />
                    </li>
                    <li className={styles.carTitle}>{item.name}</li>
                  </div>
                  <div className={styles.carTabright}>
                    <li>
                      <p>运行数：</p>
                      {item.hasfun}
                    </li>
                    <li>
                      <p>设备数：</p>
                      {item.total}
                    </li>
                    <li>
                      <p>资源使用率：</p>
                      {item.rate}
                    </li>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  renderSider = () => {
    const {
      home: { areaTree, buildTree, companyTree, searchTree },
    } = this.props;
    const { currentArea } = this.state;
    return (
      <CommonSiderBar
        isMuti
        buildTreeList={buildTree}
        onCompanyTreeSelect={this.onCompanyTreeSelect}
        onSearchTreeSelect={this.onSearchTreeSelect}
        companyTreeList={companyTree}
        areaTreeList={areaTree}
        searchTreeList={searchTree}
        onBuildTreeSelect={this.onBuildTreeSelect}
        onAreaTreeSelect={this.onAreaTreeSelect}
        onSearch={this.onSearch}
        selectedKeys={[currentArea]}
      />
    );
  };

  render() {
    return (
      <SiderContent
        className={styles.homemapparent}
        sider={this.renderSider()}
        content={this.renderContent()}
      />
    );
  }
}
export default Home;
