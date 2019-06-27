/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable no-undef-init */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable global-require */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
// import Link from 'umi/link';
import { connect } from "dva";
import StandardCard from "@/components/StandardCard";
import { Form, Row, Col, message, Empty, Spin } from "antd";
// import moment from "moment";
// import router from "umi/router";
import SiderContent from "@/components/SiderContent";
import CommonSiderBar from "@/components/CommonSiderBar";
import Host from "../../../imcUrl";
import styles from "./index.less";

const ElectricityList = `${Host}/api/DynamicRing/get&devicetype=0601`;
// const saveUrl = `${Host}/api/energymanagement/SavePowerThreshold`;

// const { Option } = Select;
// const FormItem = Form.Item;
// const format = "YYYY-MM-DD";
// const getWindowWidth = () =>
//   window.innerWidth || document.documentElement.clientWidth;

@connect(({ energyServices, loading }) => ({
  energyServices,
  tableLoading: loading.effects["energyServices/getDataList"] || false
}))
@Form.create()
class airVentilation extends Component {
  state = {
    meterList: []
  };

  componentDidMount() {
    this.getElectricityList();
    const { dispatch } = this.props;
    dispatch({
      type: "energyServices/fetchAreaTree",
      payload: { type: "2", id: "1" }
    });
  }

  getElectricityList = list => {
    this.props.dispatch({
      type: "energyServices/getDataList",
      payload:
        list === undefined
          ? `${ElectricityList}&areaId=1`
          : `${ElectricityList}&areaId=${list}`,
      callback: data => {
        if (data !== undefined) {
          if (Number(data.code) === 200) {
            this.setState({
              meterList: data.data
            });
          } else {
            message.error(data.msg);
          }
        } else {
          message.error("获取空调通风信息失败，请刷新页面后重试！");
        }
      }
    });
  };

  onAreaTreeSelect = (selectedKeys, info) => {
    this.setState(
      {
        // eslint-disable-next-line react/no-unused-state
        selectList: info.node.props.dataRef
      },
      () => {
        this.getElectricityList(selectedKeys[0]);
      }
    );
  };

  renderSider = () => {
    const { areaTree } = this.props.energyServices;
    const areaTreeList = areaTree;
    return (
      <div className={styles.monitor_left}>
        <div className={styles.monitor_tree}>
          <CommonSiderBar
            areaTreeList={areaTreeList}
            onAreaTreeSelect={this.onAreaTreeSelect}
          />
        </div>
      </div>
    );
  };

  renderContent = () => {
    const pic = require("@/assets/setting.png");
    const air = require("@/assets/imc/air.png");
    const cool = require("@/assets/imc/cool.png");
    const signal = require("@/assets/imc/signal.png");
    const { meterList } = this.state;

    return (
      <Spin spinning={this.props.tableLoading}>
        <StandardCard className="card_container" src={pic}>
          <div className={styles.monitor_right}>
            {/* <div className={styles.right_title}>
              <img alt="" src={pic} />
              <p className={styles.personCTitleTxt}>
                管理<span style={{ margin: "0 8px" }}>/</span>运营管理
                <span style={{ margin: "0 8px" }}>/</span>空调通风
              </p>
            </div> */}
            <div className={styles.monitor_right_content}>
              <Row span={24} gutter={20}>
                {meterList.length > 0 &&
                  meterList.map((v, k) => {
                    return (
                      <Col span={6} key={k + 1} className={styles.surface}>
                        <div className={styles.charts_box}>
                          <div className={styles.charts_top}>
                            <img src={air} alt="" />
                          </div>
                          <div className={styles.charts_middle}>
                            <div className={styles.charts_val}>32</div>
                            <div className={styles.charts_tip}>
                              <img
                                src={cool}
                                alt=""
                                className={styles.tip_left}
                              />
                              空调湿度
                              <img
                                src={signal}
                                alt=""
                                className={styles.tip_right}
                              />
                            </div>
                          </div>
                          <div className={styles.charts_bottom}>
                            <Row span={24}>
                              <Col span={12}>单元号:</Col>
                              <Col span={12}>1单元</Col>
                            </Row>
                            <Row span={24}>
                              <Col span={12}>楼层:</Col>
                              <Col span={12}>2楼</Col>
                            </Row>
                            <Row span={24}>
                              <Col span={12}>房号:</Col>
                              <Col span={12}>201</Col>
                            </Row>
                            <Row span={24}>
                              <Col span={12}>设定温度:</Col>
                              <Col span={12}>28°</Col>
                            </Row>
                            <Row span={24}>
                              <Col span={12}>工作模式:</Col>
                              <Col span={12}>制冷模式</Col>
                            </Row>
                            <Row span={24}>
                              <Col span={12}>风速:</Col>
                              <Col span={12}>中速</Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                {meterList.length <= 0 && <Empty />}
              </Row>
            </div>
          </div>
        </StandardCard>
      </Spin>
    );
  };

  render() {
    // const { setVisible, thresList } = this.state;
    // const { getFieldDecorator } = this.props.form;
    // const formItemLayout = {
    //   labelCol: {
    //     span: 8
    //   },
    //   wrapperCol: {
    //     span: 16
    //   }
    // };
    return (
      <div className={styles.air_box}>
        <SiderContent
          sider={this.renderSider()}
          content={this.renderContent()}
          width={300}
        />
      </div>
    );
  }
}
export default airVentilation;
