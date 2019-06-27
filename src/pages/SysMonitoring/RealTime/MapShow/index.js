import React, { PureComponent } from 'react';
import { Card, Tabs, Timeline, Select, Modal } from 'antd';
import { connect } from 'dva';
// eslint-disable-next-line import/no-unresolved
import BMap from 'BMap';
import ReactEcharts from 'echarts-for-react';
import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';
import MonitorStream from '@/components/MonitorStream';
import SimpleTable from '@/components/SimpleTable';
import styles from './index.less';

const { TabPane } = Tabs;
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
      currentdevice: '01',
      selectTab: '1',
      selectVideoUrl: '',
      modalStatus: false,
      zbmodalStatus: false,
      videovisible: 'none',
      tablevisible: 'block',
      deviceTcolumns: [],
      midcolumns: [
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: `负责人`,
          dataIndex: 'personName',
        },
        {
          title: `联系电话`,
          dataIndex: 'tel',
        },
      ],
      mainConfigList: [],
      // currentTreePath: '',
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
    this.getdata();
  }

  showPlayer = item => {
    this.setState({
      videovisible: 'block',
      tablevisible: 'none',
      selectVideoUrl: item.videoStream,
    });
  };

  tabChange = key => {
    switch (key) {
      case '1':
        this.addDevicePoints();
        break;
      case '2':
        this.addzbPoints();
        break;
      case '3':
        this.addgzPoints();
        break;
      default:
        this.clearPoint();
        break;
    }
    this.setState({
      selectTab: key,
    });
  };

  addDevicePoints = () => {
    const { selectTab } = this.state;
    if (selectTab !== '1') {
      return;
    }
    this.clearPoint();
    const {
      home: { devicePointList },
    } = this.props;
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

  addzbPoints = () => {
    this.clearPoint();
    const {
      home: { zbpersonPointList },
    } = this.props;
    zbpersonPointList.forEach(item => {
      const point = {};
      point.lat = item.latitude;
      point.lon = item.longitude;
      point.attr = item;
      point.type = 'zhiban';
      this.addzbpoint(point);
    });
  };

  addgzPoints = () => {
    this.clearPoint();
    const {
      home: { pdpersonPointList },
    } = this.props;
    pdpersonPointList.forEach(item => {
      const point = {};
      point.lat = item.latitude;
      point.lon = item.longitude;
      point.attr = item;
      point.type = 'gongzuo';
      this.addzbpoint(point);
    });
  };

  getdata = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetchDeviceType',
    });
    dispatch({
      type: 'home/fetchAreaTree',
      payload: { type: '1', id: '1' },
    });
    dispatch({
      type: 'home/queryHomeDevice',
    });
    dispatch({
      type: 'home/queryHomePerson',
    });
    this.getchartData();
    this.getlocation();
  };

  getmainData = () => {
    const { dispatch } = this.props;
    const { currentArea, currentdevice } = this.state;
    const columns = [
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
          if (record.flag === '2') {
            returnObj = '故障';
          } else if (record.flag === '1') {
            returnObj = '正常';
          }
          return returnObj;
        },
      },
    ];

    const videocolumns = [
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
    ];
    dispatch({
      type: 'home/fetchDeviceByareaAndtype',
      payload: { type: currentdevice, id: currentArea },
    });
    dispatch({
      type: 'home/fetchDevicePoint',
      payload: { type: currentdevice, id: currentArea },
    });
    if (currentdevice === '01') {
      this.resetcolumns(videocolumns);
    } else {
      this.resetcolumns(columns);
    }
  };

  sortcolums = (a, b) => {
    return a ? a.localeCompare(b) : ''.localeCompare(b);
  };

  getlocation = () => {
    const { dispatch } = this.props;
    const { currentArea } = this.state;
    dispatch({
      type: 'home/fetchzhPerson',
      payload: { id: currentArea, type: '004' },
    });
    dispatch({
      type: 'home/fetchpdPerson',
      payload: { id: currentArea, type: '005' },
    });
    dispatch({
      type: 'home/fetchzhPoint',
      payload: { id: currentArea, type: '004' },
    });
    dispatch({
      type: 'home/fetchzhPoint',
      payload: { id: currentArea, type: '005' },
    });
    dispatch({
      type: 'home/fetchwxPerson',
      payload: currentArea,
    });
  };

  getchartData = () => {
    const { dispatch } = this.props;
    const { currentdevice } = this.state;
    dispatch({
      type: 'home/queryHomeMain',
      payload: currentdevice,
    });
    this.getmainData();
  };

  getOption = chartData => {
    const arrayName = [];
    const arrayValue = [];
    // const arrayColor = [];
    const arrayColor = ['#4571e7', '#DF9426'];
    for (let i = 0; i < chartData.length; i += 1) {
      const item = chartData[i];
      arrayName.push(item.name);
      arrayValue.push({ value: item.value, name: item.name });
      // arrayColor.push(item.color);
    }
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      legend: {
        x: 'top',
        data: ['维修人数', '待命人数'],
      },
      series: [
        {
          type: 'pie',
          radius: [60, 80],
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
    return option;
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

  addzbpoint = point => {
    const mainmidList = [];
    const pt = new BMap.Point(point.lat, point.lon);
    const myIcon = new BMap.Icon('./mapicon/fang.png', new BMap.Size(28, 28));
    point.attr.areas.forEach(item => {
      const mainmid = {
        name: item.name,
        personName: item.personName,
        tel: item.tel,
      };
      mainmidList.push(mainmid);
    });
    const marker = new BMap.Marker(pt, { icon: myIcon });
    map.addOverlay(marker);
    this.addMidClickHandler(mainmidList, marker);
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

  addMidClickHandler = (mainmidList, marker) => {
    const that = this;
    marker.addEventListener('click', function get() {
      that.setState({
        zbmodalStatus: true,
        mainmidList,
      });
    });
  };

  clickPoint = item => {
    const point = new BMap.Point(item.latitude, item.longitude);
    map.centerAndZoom(point, 17);
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
        this.getlocation();
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
        this.getlocation();
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
        this.getlocation();
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
        this.getlocation();
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

  modalonCancel = () => {
    this.setState({ modalStatus: false });
  };

  zbmodalonCancel = () => {
    this.setState({ zbmodalStatus: false });
  };

  resetcolumns = tcolumns => {
    this.setState({
      deviceTcolumns: tcolumns,
    });
  };

  changeType = value => {
    this.setState(
      {
        currentdevice: value,
      },
      () => {
        this.getchartData();
      }
    );
  };

  hidePlayer = () => {
    this.setState({
      videovisible: 'none',
      tablevisible: 'block',
    });
  };

  renderContent() {
    // const { chartData, statusChartData } = this.state;
    const {
      home: {
        deviceList,
        zbpersonList,
        pdpersonList,
        wxpersonList,
        supportTypes,
        deviceCountList,
        mainCountList,
        personCountList,
      },
    } = this.props;

    const {
      modalStatus,
      zbmodalStatus,
      deviceTcolumns,
      midcolumns,
      selectVideoUrl,
      mainConfigList,
      mainmidList,
      videovisible,
      tablevisible,
    } = this.state;

    let personTotal = 0;
    personCountList.forEach(item => {
      personTotal += item.value;
    });

    const ajSupporttype = [];
    supportTypes.forEach(item => {
      if (item.code === '01' || item.code === '02' || item.code === '04') ajSupporttype.push(item);
    });

    const ajDeviceCountList = [];
    deviceCountList.forEach(item => {
      if (item.CODE === '01' || item.CODE === '02' || item.CODE === '04')
        ajDeviceCountList.push(item);
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
          <Modal
            className={styles.mapModal}
            visible={zbmodalStatus}
            onCancel={this.zbmodalonCancel}
          >
            <div style={{ paddingTop: 20 }}>
              <SimpleTable columns={midcolumns} dataSource={mainmidList} />
            </div>
          </Modal>
          <div id="map" className={styles.mapDiv} />
          <div className={styles.tabDiv}>
            <div className={styles.tabPaneDiv}>
              <div className={styles.tabTitleSle}>
                <p>请选择类型</p>
                <Select
                  style={{ width: 180, marginLeft: 90 }}
                  onChange={this.changeType}
                  defaultValue="01"
                >
                  {ajSupporttype.map(item => {
                    return <Option value={item.code}>{item.desp}</Option>;
                  })}
                </Select>
              </div>
              <Tabs defaultActiveKey="1" onChange={this.tabChange} tabPosition="left">
                <TabPane
                  tab={
                    <div className={styles.tabTitle}>
                      <div className="tabImgbaojing" />
                      <span>报警信息</span>
                    </div>
                  }
                  key="1"
                >
                  <Timeline className={styles.slidernew}>
                    {deviceList.map(item => {
                      return (
                        <Timeline.Item dot={<div className={styles.sliderdotred} />}>
                          <div style={{ paddingLeft: 20 }} onClick={() => this.clickPoint(item)}>
                            <li className={styles.thetitle}>{item.deviceName}</li>
                            <li>{item.deviceAddress}</li>
                            <li>{item.typeDesp}</li>
                            <li>{item.alarmTime}</li>
                          </div>
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </TabPane>
                <TabPane
                  tab={
                    <div style={{ borderTop: '0' }} className={styles.tabTitle}>
                      <div className="tabImgzhiban" />
                      <span>值班室</span>
                    </div>
                  }
                  key="2"
                >
                  <Timeline className={styles.slidernew}>
                    {zbpersonList.map(item => {
                      return (
                        <Timeline.Item dot={<div className={styles.sliderdotlv} />}>
                          <div style={{ paddingLeft: 20 }} onClick={() => this.clickPoint(item)}>
                            <li className={styles.thetitle}>{item.name}</li>
                            <li>{item.personName}</li>
                            <li>{item.tel}</li>
                          </div>
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </TabPane>
                <TabPane
                  tab={
                    <div style={{ borderTop: '0' }} className={styles.tabTitle}>
                      <div className="tabImgpd" />
                      <span>工作间</span>
                    </div>
                  }
                  key="3"
                >
                  <Timeline className={styles.slidernew}>
                    {pdpersonList.map(item => {
                      return (
                        <Timeline.Item dot={<div className={styles.sliderdotlv} />}>
                          <div style={{ paddingLeft: 20 }} onClick={() => this.clickPoint(item)}>
                            <li className={styles.thetitle}>{item.name}</li>
                            <li>{item.personName}</li>
                            <li>{item.tel}</li>
                          </div>
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </TabPane>
                <TabPane
                  tab={
                    <div style={{ borderTop: '0' }} className={styles.tabTitle}>
                      <div className="tabImgry" />
                      <span>维护人员</span>
                    </div>
                  }
                  key="4"
                >
                  <Timeline className={styles.slidernew}>
                    {wxpersonList.map(item => {
                      return (
                        <Timeline.Item dot={<div className={styles.sliderdotlv} />}>
                          <div style={{ paddingLeft: 20 }} onClick={() => this.clickPoint(item)}>
                            <li className={styles.thetitle}>{item.name}</li>
                            <li>{item.company}</li>
                            <li>{item.tel}</li>
                          </div>
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </TabPane>
              </Tabs>
            </div>
          </div>
          <div className={styles.maplegend}>
            <div className={styles.maplegenleftDiv}>
              <div className={styles.maplegendouthong} />
              <span className={styles.maplegendsp}>报警</span>
            </div>
            <div className={styles.maplegenleftDiv}>
              <div className={styles.maplegendoutlan} />
              <span className={styles.maplegendsp}>正常</span>
            </div>
            <div className={styles.maplegenleftDiv}>
              <div className={styles.maplegendoutcheng} />
              <span className={styles.maplegendsp}>故障</span>
            </div>
          </div>
          <div className={styles.mapcardDiv}>
            <div className={styles.cardDiv}>
              <Card size="small" bordered title="报警信息" style={{ width: 500, height: 'auto' }}>
                {ajDeviceCountList.map(item => {
                  return (
                    <div>
                      {item.DEVICE_TOTALCOUNT !== 0 && (
                        <div className={styles.cardul}>
                          <span style={{ width: 120 }}>{item.DESP}</span>
                          <div className={styles.cardline}>
                            <div
                              className={styles.carddotbored}
                              style={{
                                width: (item.ALARM_COUNT * 300) / item.DEVICE_TOTALCOUNT,
                              }}
                            />
                          </div>
                          <span>
                            {item.ALARM_COUNT}/{item.DEVICE_TOTALCOUNT}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Card>
            </div>
            <div className={styles.cardDiv}>
              <Card size="small" bordered title="状态监控" style={{ width: 500, height: 270 }}>
                <div id="personechart" className={styles.personEchart}>
                  <ReactEcharts
                    option={this.getstatusOption(mainCountList)}
                    style={{ height: '210px', width: '480px' }}
                  />
                </div>
              </Card>
            </div>
            <div className={styles.cardDiv}>
              <Card size="small" bordered title="人员分布" style={{ width: 500, height: 270 }}>
                <div>
                  <div className={styles.carchartcenter}>
                    <li>
                      <span style={{ display: 'block' }}>{personTotal}</span>
                      <span>总人数</span>
                    </li>
                  </div>
                  <div id="personechart" className={styles.personEchart}>
                    <ReactEcharts
                      option={this.getOption(personCountList)}
                      style={{ height: '210px', width: '480px' }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderSider = () => {
    const {
      home: { areaTree, buildTree, companyTree, searchTree },
    } = this.props;
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
