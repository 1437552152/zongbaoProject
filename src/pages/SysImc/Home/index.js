/* eslint-disable global-require */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import router from 'umi/router';
import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';
import StandardCard from '@/components/StandardCard';
import styles from './index.less';

@connect(({ firsthome, loading }) => ({
  firsthome,
  loading: loading.models.firsthome,
}))
class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentArea: '1',
    };
  }

  componentDidMount() {
    this.getdata();
  }

  getdata = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'firsthome/fetchAreaTree',
      payload: { type: '2', id: '1' },
    });
    this.getmainData();
  };

  getmainData = () => {
    const { dispatch } = this.props;
    const { currentArea } = this.state;
    dispatch({
      type: 'firsthome/fetchDeviceAllByAreaid',
      payload: { type: currentArea, id: '1083' },
    });
  };

  fetchbuild = areaId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'firsthome/fetchBuildTree',
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
      type: 'firsthome/fetchCompanyTree',
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
      type: 'firsthome/treeSearch',
      payload: value,
    });
  };

  clickDevice = devicecode => {
    const { currentArea } = this.state;
    router.push({
      pathname: `/imc/realtime`,
      query: {
        currentArea,
        currentDevice: devicecode,
      },
    });
  };

  renderContent = () => {
    const pic1 = './assets/imc/jiashiqi.png';
    const pic2 = './assets/imc/shipin.png';
    const pic3 = './assets/imc/jifang.png';
    const pic4 = './assets/imc/huozai.png';
    const pic5 = './assets/imc/anquan.png';
    const pic6 = './assets/imc/air.png';
    const pic7 = './assets/imc/tianqi.png';
    const pic8 = './assets/imc/hujiao.png';
    const pic9 = './assets/imc/wulian.png';
    const pic10 = './assets/imc/huanjing.png';
    const pic11 = './assets/imc/daping.png';
    const pic12 = './assets/imc/peidian.png';
    // const pic1 = require("@/assets/imc/jiashiqi.png");
    // const pic2 = require("@/assets/imc/shipin.png");
    // const pic3 = require("@/assets/imc/jifang.png");
    // const pic4 = require("@/assets/imc/huozai.png");
    // const pic5 = require("@/assets/imc/anquan.png");
    // const pic6 = require("@/assets/imc/air.png");
    // const pic7 = require("@/assets/imc/tianqi.png");
    // const pic8 = require("@/assets/imc/hujiao.png");
    // const pic9 = require("@/assets/imc/wulian.png");
    // const pic10 = require("@/assets/imc/huanjing.png");
    // const pic11 = require("@/assets/imc/daping.png");
    // const pic12 = require("@/assets/imc/peidian.png");

    const {
      firsthome: { deviceCountList },
    } = this.props;
    const devicelist = {};
    deviceCountList.forEach(item => {
      devicelist[item.code] = item.deviceCount;
    });
    const pic = require("@/assets/setting.png");

    return (
      <StandardCard className="card_container" src={pic}>
        <div className={styles.monitor_right}>
          <div className={styles.monitor_right_content}>
            <Row span={24} gutter={20}>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left} onClick={() => this.clickDevice('01')}>
                    <img src={pic1} alt="" />
                    <div>消防</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>喷淋头:</div>
                        <div className={styles.list_right}>
                          {devicelist['0101'] !== undefined ? devicelist['0101'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>气体灭火:</div>
                        <div className={styles.list_right}>
                          {devicelist['0102'] !== undefined ? devicelist['0102'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>抽风:</div>
                        <div className={styles.list_right}>
                          {devicelist['0103'] !== undefined ? devicelist['0103'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left} onClick={() => this.clickDevice('02')}>
                    <img src={pic2} alt="" />
                    <div>视频监控</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>枪机:</div>
                        <div className={styles.list_right}>
                          {devicelist['0201'] !== undefined ? devicelist['0201'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>球机:</div>
                        <div className={styles.list_right}>
                          {devicelist['0202'] !== undefined ? devicelist['0202'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>监控室:</div>
                        <div className={styles.list_right}>
                          {devicelist['0203'] !== undefined ? devicelist['0203'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left} onClick={() => this.clickDevice('03')}>
                    <img src={pic3} alt="" />
                    <div>机房</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>漏水检测:</div>
                        <div className={styles.list_right}>
                          {devicelist['0301'] !== undefined ? devicelist['0301'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>机房空调:</div>
                        <div className={styles.list_right}>
                          {devicelist['0302'] !== undefined ? devicelist['0302'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>微模块:</div>
                        <div className={styles.list_right}>
                          {devicelist['0303'] !== undefined ? devicelist['0303'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left} onClick={() => this.clickDevice('04')}>
                    <img src={pic4} alt="" />
                    <div>火灾</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>烟雾报警:</div>
                        <div className={styles.list_right}>
                          {devicelist['0401'] !== undefined ? devicelist['0401'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>声光报警:</div>
                        <div className={styles.list_right}>
                          {devicelist['0402'] !== undefined ? devicelist['0402'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>气体报警:</div>
                        <div className={styles.list_right}>
                          {devicelist['0403'] !== undefined ? devicelist['0403'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left} onClick={() => this.clickDevice('05')}>
                    <img src={pic5} alt="" />
                    <div>安全</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>门禁:</div>
                        <div className={styles.list_right}>
                          {devicelist['0501'] !== undefined ? devicelist['0501'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>周界告警:</div>
                        <div className={styles.list_right}>
                          {devicelist['0502'] !== undefined ? devicelist['0502'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>视频告警:</div>
                        <div className={styles.list_right}>
                          {devicelist['0503'] !== undefined ? devicelist['0503'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left}>
                    <img src={pic6} alt="" />
                    <div>空调新风</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>空调:</div>
                        <div className={styles.list_right}>
                          {devicelist['0601'] !== undefined ? devicelist['0601'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>新风:</div>
                        <div className={styles.list_right}>
                          {devicelist['0602'] !== undefined ? devicelist['0602'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left}>
                    <img src={pic7} alt="" />
                    <div>天气</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>气象站:</div>
                        <div className={styles.list_right}>
                          {devicelist['0701'] !== undefined ? devicelist['0701'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left}>
                    <img src={pic8} alt="" />
                    <div>呼叫</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>求救信号:</div>
                        <div className={styles.list_right}>
                          {devicelist['0801'] !== undefined ? devicelist['0801'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>定位呼叫:</div>
                        <div className={styles.list_right}>
                          {devicelist['0802'] !== undefined ? devicelist['0802'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left}>
                    <img src={pic9} alt="" />
                    <div>物联网</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>智能水表:</div>
                        <div className={styles.list_right}>
                          {devicelist['0901'] !== undefined ? devicelist['0901'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>智能电表:</div>
                        <div className={styles.list_right}>
                          {devicelist['0902'] !== undefined ? devicelist['0902'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>天然气表:</div>
                        <div className={styles.list_right}>
                          {devicelist['0903'] !== undefined ? devicelist['0903'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>智能井盖:</div>
                        <div className={styles.list_right}>
                          {devicelist['0904'] !== undefined ? devicelist['0904'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>水位计:</div>
                        <div className={styles.list_right}>
                          {devicelist['0905'] !== undefined ? devicelist['0905'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left}>
                    <img src={pic10} alt="" />
                    <div>环境</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>温度:</div>
                        <div className={styles.list_right}>
                          {devicelist['1001'] !== undefined ? devicelist['1001'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>湿度:</div>
                        <div className={styles.list_right}>
                          {devicelist['1002'] !== undefined ? devicelist['1002'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>PM2.5:</div>
                        <div className={styles.list_right}>
                          {devicelist['1003'] !== undefined ? devicelist['1003'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left}>
                    <img src={pic11} alt="" />
                    <div>广播大屏</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>广播:</div>
                        <div className={styles.list_right}>
                          {devicelist['1101'] !== undefined ? devicelist['1101'] : 0}个
                        </div>
                      </li>
                      <li>
                        <div className={styles.list_left}>大屏:</div>
                        <div className={styles.list_right}>
                          {devicelist['1102'] !== undefined ? devicelist['1102'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.right_box}>
                  <div className={styles.box_left}>
                    <img src={pic12} alt="" />
                    <div>配电</div>
                  </div>
                  <div className={styles.box_right}>
                    <ul>
                      <li>
                        <div className={styles.list_left}>配电房:</div>
                        <div className={styles.list_right}>
                          {devicelist['1201'] !== undefined ? devicelist['1201'] : 0}个
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </StandardCard>
    );
  };

  renderSider = () => {
    const {
      firsthome: { areaTree, buildTree, companyTree, searchTree },
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
        className={styles.home_box}
        sider={this.renderSider()}
        content={this.renderContent()}
      />
    );
  }
}
export default Home;
