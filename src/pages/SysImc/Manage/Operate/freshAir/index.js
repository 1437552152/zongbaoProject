/* eslint-disable react/no-unused-state */
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
import SiderContent from "@/components/SiderContent";
import CommonSiderBar from "@/components/CommonSiderBar";
import Host from "../../../imcUrl";
import styles from "./index.less";

const ElectricityList = `${Host}/api/DynamicRing/get&devicetype=0602`;

@connect(({ energyServices, loading }) => ({
  energyServices,
  tableLoading: loading.effects["energyServices/getDataList"] || false
}))
@Form.create()
class freshAir extends Component {
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
            // message.error("获取电表监控信息失败，请稍后重试！");
            message.error(data.msg);
          }
        } else {
          message.error("获取新风信息失败，请刷新页面后重试！");
        }
      }
    });
  };

  onAreaTreeSelect = (selectedKeys, info) => {
    this.setState(
      {
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
    const fengji = require("@/assets/imc/fengji.png");
    const cool = require("@/assets/imc/jiashi.png");
    const cgq = require("@/assets/imc/cgq.png");
    const normal = require("@/assets/imc/lv.png");
    const fault = require("@/assets/imc/hong.png");
    const stop = require("@/assets/imc/hui.png");
    const { meterList } = this.state;

    return (
      <Spin spinning={this.props.tableLoading}>
        <StandardCard className="card_container" src={pic}>
          <div className={styles.monitor_right}>
            {/* <div className={styles.right_title}>
              <img alt="" src={pic} />
              <p className={styles.personCTitleTxt}>
                管理<span style={{ margin: "0 8px" }}>/</span>运营管理
                <span style={{ margin: "0 8px" }}>/</span>新风
              </p>
            </div> */}
            <div className={styles.monitor_right_content}>
              <div className={styles.list_content}>
                <div className={styles.list_title}>送风风机</div>
                <Row span={24} gutter={20}>
                  {meterList.length > 0 &&
                    meterList.map((v, k) => {
                      return (
                        k < 4 && (
                          <Col span={6} key={k + 1} className={styles.surface}>
                            <div className={styles.charts_box}>
                              <div className={styles.charts_top}>
                                <img src={fengji} alt="" />
                              </div>
                              <div className={styles.charts_bottom}>
                                <Row span={24}>
                                  <Col span={12}>设备状态:</Col>
                                  <Col span={12}>
                                    <img src={normal} alt="" />
                                    正常
                                  </Col>
                                </Row>
                                <Row span={24}>
                                  <Col span={12}>设备编码:</Col>
                                  <Col span={12}>A54</Col>
                                </Row>
                              </div>
                            </div>
                          </Col>
                        )
                      );
                    })}
                  {meterList.length <= 0 && <Empty />}
                </Row>
              </div>
              <div className={styles.list_content}>
                <div className={styles.list_title}>加湿器</div>
                <Row span={24} gutter={20}>
                  {meterList.length > 0 &&
                    meterList.map((v, k) => {
                      return (
                        k < 4 && (
                          <Col span={6} key={k + 1} className={styles.surface}>
                            <div className={styles.charts_box}>
                              <div className={styles.charts_top}>
                                <img src={cool} alt="" />
                              </div>
                              <div className={styles.charts_bottom}>
                                <Row span={24}>
                                  <Col span={12}>设备状态:</Col>
                                  <Col span={12}>
                                    <img src={fault} alt="" />
                                    故障
                                  </Col>
                                </Row>
                                <Row span={24}>
                                  <Col span={12}>设备编码:</Col>
                                  <Col span={12}>A54</Col>
                                </Row>
                              </div>
                            </div>
                          </Col>
                        )
                      );
                    })}
                  {meterList.length <= 0 && <Empty />}
                </Row>
              </div>
              <div className={styles.list_content}>
                <div className={styles.list_title}>粒子传感器</div>
                <Row span={24} gutter={20}>
                  {meterList.length > 0 &&
                    meterList.map((v, k) => {
                      return (
                        k < 4 && (
                          <Col span={6} key={k + 1} className={styles.surface}>
                            <div className={styles.charts_box}>
                              <div className={styles.charts_top}>
                                <img src={cgq} alt="" />
                              </div>
                              <div className={styles.charts_bottom}>
                                <Row span={24}>
                                  <Col span={12}>设备状态:</Col>
                                  <Col span={12}>
                                    <img src={stop} alt="" />
                                    断开
                                  </Col>
                                </Row>
                                <Row span={24}>
                                  <Col span={12}>设备编码:</Col>
                                  <Col span={12}>A54</Col>
                                </Row>
                              </div>
                            </div>
                          </Col>
                        )
                      );
                    })}
                  {meterList.length <= 0 && <Empty />}
                </Row>
              </div>
            </div>
          </div>
        </StandardCard>
      </Spin>
    );
  };

  render() {
    return (
      <div className={styles.fresh_box}>
        <SiderContent
          sider={this.renderSider()}
          content={this.renderContent()}
          width={300}
        />
      </div>
    );
  }
}
export default freshAir;
