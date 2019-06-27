/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable no-undef-init */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable global-require */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import Link from "umi/link";
import { connect } from "dva";
import StandardCard from "@/components/StandardCard";
import {
  Form,
  Row,
  Col,
  message,
  Modal,
  Empty,
  Spin,
  Input,
  DatePicker,
  Button
} from "antd";
import moment from "moment";
import router from "umi/router";
import ReactEcharts from "echarts-for-react";
import SiderContent from "@/components/SiderContent";
import CommonSiderBar from "@/components/CommonSiderBar";
import Host from "../../../imcUrl";
import styles from "./index.less";

const ElectricityList = `${Host}/api/EnergyManagement&type=water`;
const saveUrl = `${Host}/api/energymanagement/SavePowerThreshold`;

// const { Option } = Select;
const FormItem = Form.Item;
const format = "YYYY-MM-DD";
// const getWindowWidth = () =>
//   window.innerWidth || document.documentElement.clientWidth;

@connect(({ energyServices, loading }) => ({
  energyServices,
  tableLoading: loading.effects["energyServices/getDataList"] || false,
  dislogLoading: loading.effects["energyServices/postDataList"] || false
}))
@Form.create()
class waterMonitor extends Component {
  state = {
    setVisible: false,
    meterList: [],
    thresList: {},
    selectList: {}
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
        list === undefined ? ElectricityList : `${ElectricityList}${list}`,
      callback: data => {
        if (data !== undefined) {
          if (Number(data.code) === 200) {
            this.setState({
              meterList: data.data
            });
          } else {
            // message.error("获取水表监控信息失败，请稍后重试！");
            message.error(data.msg);
          }
        } else {
          message.error("获取水表监控信息失败，请刷新页面后重试！");
        }
      }
    });
  };

  getParentList = (list, callback) => {
    const { areaTree } = this.props.energyServices;
    if (areaTree !== undefined && areaTree.length > 0) {
      if (Number(list.fid) === 0) {
        callback(0);
      } else {
        const arr = [];
        const getNewList = tree => {
          for (let i = 0; i < tree.length; i++) {
            arr.push(tree[i]);
            if (tree[i].children !== undefined && tree[i].children.length > 0) {
              getNewList(tree[i].children);
            }
          }
        };
        const newTree = JSON.parse(JSON.stringify(areaTree));
        getNewList(newTree);

        const getListInfo = fid => {
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].id === fid) {
              return arr[j];
            }
          }
        };

        let area = undefined;
        let building = undefined;
        let floors = undefined;

        if (list.type === "003") {
          floors = list.name;
          const a1 = getListInfo(list.fid);
          building = a1.name;
          const a2 = getListInfo(a1.fid);
          area = a2.name;
        } else if (list.type === "002") {
          building = list.name;
          const a3 = getListInfo(list.fid);
          area = a3.name;
        } else {
          area = list.name;
        }

        const params = `&area=${area}${
          building !== undefined ? `&building=${building}` : ""
        }${floors !== undefined ? `&floors=${floors}` : ""}`;
        callback(params);
      }
    }
  };

  onAreaTreeSelect = (selectedKeys, info) => {
    this.setState(
      {
        selectList: info.node.props.dataRef
      },
      () => {
        this.getParentList(info.node.props.dataRef, data => {
          if (data === 0) {
            this.getElectricityList();
          } else {
            this.getElectricityList(data);
          }
        });
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

  setThreshold = list => {
    this.setState({
      thresList: list !== undefined ? list : {},
      setVisible: !this.state.setVisible
    });
  };

  oldData = list => {
    const waterData = sessionStorage.getItem("waterData");
    if (waterData === null) {
      sessionStorage.setItem("waterData", JSON.stringify(list));
    } else {
      sessionStorage.removeItem("waterData");
      sessionStorage.setItem("waterData", JSON.stringify(list));
    }
    router.push("waterHistory");
  };

  renderContent = () => {
    const pic = require("@/assets/setting.png");
    const { meterList } = this.state;

    return (
      <Spin spinning={this.props.tableLoading}>
        <StandardCard className="card_container" src={pic}>
          <div className={styles.monitor_right}>
            {/* <div className={styles.right_title}>
              <img alt="" src={pic} />
              <p className={styles.personCTitleTxt}>
                管理<span style={{ margin: "0 8px" }}>/</span>能耗管理
                <span style={{ margin: "0 8px" }}>/</span>水表监控
              </p>
            </div> */}
            <div className={styles.monitor_right_content}>
              <Row span={24} gutter={20}>
                {meterList.length > 0 &&
                  meterList.map((v, k) => {
                    const option = {
                      tooltip: {
                        show: true
                      },
                      series: [
                        {
                          name: "kwh",
                          type: "gauge",
                          radius: "75%",
                          max: v.threshold
                            ? (Number(v.threshold) / 80) * 100
                            : 100,
                          data: [
                            {
                              value: v.currentData ? v.currentData : 0,
                              name: "kwh"
                            }
                          ]
                        }
                      ]
                    };
                    return (
                      <Col span={6} key={k + 1} className={styles.surface}>
                        <div className={styles.charts_box}>
                          <div className={styles.charts_top}>
                            <div
                              className={styles.charts_toop}
                              onClick={() => this.setThreshold(v)}
                            >
                              报警阈值
                            </div>
                            <div
                              className={styles.charts_toop1}
                              onClick={() => this.oldData(v)}
                            >
                              历史数据
                            </div>
                            <ReactEcharts option={option} />
                          </div>
                          <div className={styles.charts_bottom}>
                            <Row span={24}>
                              <Col span={8}>设备地址:</Col>
                              <Col span={16}>
                                {`${v.buildingsName}${v.floorsName}`}
                              </Col>
                            </Row>
                            <Row span={24}>
                              <Col span={8}>设备卡号:</Col>
                              <Col span={16}>{v.iccid}</Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                {meterList.length <= 0 && <Empty />}
              </Row>
            </div>
            <Link to="waterCheck" className={styles.router_btn}>
              <Button type="primary">抄表管理</Button>
            </Link>
          </div>
        </StandardCard>
      </Spin>
    );
  };

  saveThreshold = () => {
    this.props.form.validateFields(
      ["cycle", "time", "threshold"],
      (err, filedsValue) => {
        if (!err) {
          const { thresList } = this.state;
          this.props.dispatch({
            type: "energyServices/postDataList",
            payload: {
              url: saveUrl,
              params: {
                deviceId: thresList.deviceId,
                period: filedsValue.cycle,
                startTime: moment(filedsValue.time).format(format),
                threshold: filedsValue.threshold
              }
            },
            callback: data => {
              if (data !== undefined) {
                if (Number(data.code) === 200) {
                  const { selectList } = this.state;
                  if (Object.keys(selectList).length > 0) {
                    this.getParentList(selectList, response => {
                      if (response === 0) {
                        this.getElectricityList();
                      } else {
                        this.getElectricityList(response);
                      }
                    });
                  } else {
                    this.getElectricityList();
                  }
                  message.success("告警阈值设置成功！");
                  this.setThreshold();
                } else {
                  message.error(data.msg);
                }
              } else {
                message.error("告警阈值设置失败，请刷新页面后重试！");
              }
            }
          });
        }
      }
    );
  };

  render() {
    const { setVisible, thresList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    };
    return (
      <div className={styles.water_box}>
        <SiderContent
          sider={this.renderSider()}
          content={this.renderContent()}
          width={300}
        />

        <Spin spinning={this.props.dislogLoading}>
          <Modal
            title="告警阈值"
            centered
            destroyOnClose
            visible={setVisible}
            onOk={() => this.saveThreshold()}
            onCancel={() => this.setThreshold()}
            footer={[]}
            width={450}
            className={styles.set_waterdialog}
          >
            <Form>
              <Row span={24}>
                <FormItem {...formItemLayout} label="当前楼栋">
                  {getFieldDecorator("buildingsName", {
                    initialValue: thresList.buildingsName
                  })(<Input disabled />)}
                </FormItem>
              </Row>
              <Row span={24}>
                <FormItem {...formItemLayout} label="当前楼层">
                  {getFieldDecorator("floorsName", {
                    initialValue: thresList.floorsName
                  })(<Input disabled />)}
                </FormItem>
              </Row>
              <Row span={24}>
                <FormItem {...formItemLayout} label="水表编号">
                  {getFieldDecorator("deviceId", {
                    initialValue: thresList.deviceId
                  })(<Input disabled />)}
                </FormItem>
              </Row>
              <Row span={24}>
                <FormItem {...formItemLayout} label="水表卡号">
                  {getFieldDecorator("iccid", {
                    initialValue: thresList.iccid
                  })(<Input disabled />)}
                </FormItem>
              </Row>
              <Row span={24}>
                <FormItem {...formItemLayout} label="水表创号">
                  {getFieldDecorator("sensorId", {
                    initialValue: thresList.sensorId
                  })(<Input disabled />)}
                </FormItem>
              </Row>
              <Row span={24}>
                <FormItem {...formItemLayout} label="设置统计周期">
                  {getFieldDecorator("cycle", {
                    rules: [{ required: true, message: "请输入统计周期" }],
                    initialValue: thresList.period
                  })(<Input placeholder="请输入统计周期" />)}
                </FormItem>
              </Row>
              <Row span={24}>
                <FormItem {...formItemLayout} label="设置起始时间">
                  {getFieldDecorator("time", {
                    rules: [{ required: true, message: "请选择起始时间" }],
                    initialValue:
                      thresList.startTime !== undefined
                        ? moment(thresList.startTime, format)
                        : moment("2019-01-01", format)
                  })(
                    <DatePicker
                      placeholder="请选择起始时间"
                      format={format}
                      style={{ width: "100%" }}
                    />
                  )}
                </FormItem>
              </Row>
              <Row span={24}>
                <FormItem {...formItemLayout} label="告警阈值">
                  {getFieldDecorator("threshold", {
                    rules: [{ required: true, message: "请输入告警阈值" }],
                    initialValue: thresList.threshold
                  })(<Input placeholder="请输入告警阈值" />)}
                </FormItem>
              </Row>
              <Row span={24} style={{ textAlign: "center" }}>
                <Button type="primary" onClick={() => this.saveThreshold()}>
                  确定
                </Button>
                <Button
                  onClick={() => this.setThreshold()}
                  style={{ marginLeft: "20px" }}
                >
                  取消
                </Button>
              </Row>
            </Form>
          </Modal>
        </Spin>
      </div>
    );
  }
}
export default waterMonitor;
