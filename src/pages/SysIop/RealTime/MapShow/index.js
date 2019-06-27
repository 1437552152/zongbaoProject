/* eslint-disable camelcase */
/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
import { Card, Tabs, Timeline, Select, Modal } from 'antd';
import { connect } from 'dva';
// eslint-disable-next-line import/no-unresolved
import BMap from 'BMap';
import ReactEcharts from 'echarts-for-react';
import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';

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
      currentdevice: '02',
      selectTab: '1',
      modalStatus: false,
      zbmodalStatus: false,
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
          sorter: (a, b) => this.sortcolums(a.flag, b.flag),
          sortOrder: 'descend',
          render: (text, record) => {
            let returnObj = '正常';
            if (record.flag === '0') {
              returnObj = '故障';
            }
            return returnObj;
          },
        },
      ],
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

  sortcolums = (a, b) => {
    return a ? a.localeCompare(b) : ''.localeCompare(b);
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
      let status = '01';
      if (item.malfunctionDeviceCount > 0) {
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
    dispatch({
      type: 'home/fetchDeviceByareaAndtype',
      payload: { type: currentdevice, id: currentArea },
    });
    dispatch({
      type: 'home/fetchDevicePoint',
      payload: { type: currentdevice, id: currentArea },
    });
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
    // 创建点图层数据
    const pt = new BMap.Point(point.lat, point.lon);
    let myIcon = new BMap.Icon('./mapicon/lan.png', new BMap.Size(28, 28));
    if (point.status !== '01') {
      myIcon = new BMap.Icon('./mapicon/cheng.png', new BMap.Size(28, 28));
    }
    const marker = new BMap.Marker(pt, { icon: myIcon }); // 创建标注
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
    const that = this;
    marker.addEventListener('click', function get() {
      that.setState({
        modalStatus: true,
        mainConfigList,
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

  getitemdotstyle = item => {
    let dotstyle = styles.sliderdotlan;
    if (item.status !== '01') {
      dotstyle = styles.sliderdotcheng;
    }
    return dotstyle;
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
      mainConfigList,
      mainmidList,
    } = this.state;

    let personTotal = 0;
    personCountList.forEach(item => {
      personTotal += item.value;
    });

    this.addDevicePoints();

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <Modal className={styles.mapModal} visible={modalStatus} onCancel={this.modalonCancel}>
            <div style={{ paddingTop: 20 }}>
              <SimpleTable columns={deviceTcolumns} dataSource={mainConfigList} />
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
                  defaultValue="02"
                >
                  {supportTypes.map(item => {
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
                        <Timeline.Item dot={<div className={this.getitemdotstyle(item)} />}>
                          <div style={{ paddingLeft: 20 }} onClick={() => this.clickPoint(item)}>
                            <li className={styles.thetitle}>{item.name}</li>
                            <li>{item.address}</li>
                            <li>{item.detail}</li>
                            <li>{item.malfunctionTime}</li>
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
              <div className={styles.maplegendoutcheng} />
              <span className={styles.maplegendsp}>故障</span>
            </div>
            <div className={styles.maplegenleftDiv}>
              <div className={styles.maplegendoutlan} />
              <span className={styles.maplegendsp}>正常</span>
            </div>
          </div>
          <div className={styles.mapcardDiv}>
            <div className={styles.cardDiv}>
              <Card size="small" bordered title="故障信息" style={{ width: 500, height: 'auto' }}>
                {deviceCountList.map(item => {
                  return (
                    <div>
                      {item.DEVICE_TOTALCOUNT !== 0 && (
                        <div className={styles.cardul}>
                          <span style={{ width: 120 }}>{item.DESP}</span>
                          <div className={styles.cardline}>
                            <div
                              className={styles.carddotbored}
                              style={{
                                width: (item.MALFUNCTION_COUNT * 300) / item.DEVICE_TOTALCOUNT,
                              }}
                            />
                          </div>
                          <span>
                            {item.MALFUNCTION_COUNT}/{item.DEVICE_TOTALCOUNT}
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
        showTrigger
        content={this.renderContent()}
      />
    );
  }
}
export default Home;
