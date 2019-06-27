/* eslint-disable no-plusplus */
/* eslint-disable global-require */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import { connect } from "dva";
import Link from "umi/link";
import StandardCard from "@/components/StandardCard";
import { Form, Row, Col, Tabs, Spin, message } from "antd";
import ReactEcharts from "echarts-for-react";
import Host from "../../../../imcUrl";
import styles from "./index.less";

const { TabPane } = Tabs;
const weekUrl = `${Host}/api/EnergyManagement/GetWeekUsageData&type=Electricity`;
const monthUrl = `${Host}/api/EnergyManagement/GetMonthUsageData&type=Electricity`;
const yearUrl = `${Host}/api/EnergyManagement/GetYearUsageData&type=Electricity`;

@connect(({ energyServices, loading }) => ({
  energyServices,
  tableLoading: loading.effects["energyServices/getDataList"] || false
}))
@Form.create()
class meterHistory extends Component {
  constructor(props) {
    super(props);
    const meterData = sessionStorage.getItem("meterData");
    this.state = {
      meterData: meterData !== null ? JSON.parse(meterData) : {},
      weekData: {},
      monthData: {},
      yearData: {}
    };
  }

  componentDidMount() {
    this.getWeekData();
  }

  getWeekData = () => {
    const { meterData } = this.state;
    const weekData = {
      color: ["#3398DB"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      title: {
        left: "center",
        text: "用电趋势"
      },
      xAxis: [
        {
          type: "category",
          data: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
            "星期日"
          ]
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      dataZoom: [
        {
          type: "slider",
          left: "center",
          bottom: 0,
          backgroundColor: "rgba(26,102,178,0.1)",
          borderColor: "rgba(0,0,0,0)",
          textStyle: false,
          dataBackground: {
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              opacity: 0
            }
          },
          height: 15,
          handleIcon:
            "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
          handleSize: "100%",
          handleStyle: {
            color: "#fff",
            shadowBlur: 5,
            shadowColor: "rgba(0, 0, 0, 0.6)"
          },
          fillerColor: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#40E61F" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#FF7777" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      ],
      series: [
        {
          name: "本周",
          type: "bar",
          barWidth: "60%",
          data: []
        }
      ]
    };
    this.props.dispatch({
      type: "energyServices/getDataList",
      payload: `${weekUrl}&deviceId=${meterData.deviceId}`,
      callback: data => {
        if (data !== undefined) {
          if (Number(data.code) === 200) {
            weekData.series[0].data = data.data;
            this.setState({
              weekData
            });
          } else {
            message.error(data.msg);
          }
        } else {
          message.error("获取周能耗失败，请刷新页面后重试！");
        }
      }
    });
  };

  getMonthData = () => {
    const { meterData } = this.state;
    const arr = [];
    const strDate = new Date().getDate();
    for (let i = 1; i < Number(strDate); i++) {
      arr.push(`${i}日`);
    }
    const monthData = {
      color: ["#3398DB"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      title: {
        left: "center",
        text: "用电趋势"
      },
      xAxis: [
        {
          type: "category",
          data: arr
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      dataZoom: [
        {
          type: "slider",
          left: "center",
          bottom: 0,
          backgroundColor: "rgba(26,102,178,0.1)",
          borderColor: "rgba(0,0,0,0)",
          textStyle: false,
          dataBackground: {
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              opacity: 0
            }
          },
          height: 15,
          handleIcon:
            "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
          handleSize: "100%",
          handleStyle: {
            color: "#fff",
            shadowBlur: 5,
            shadowColor: "rgba(0, 0, 0, 0.6)"
          },
          fillerColor: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#40E61F" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#FF7777" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      ],
      series: [
        {
          name: "本月",
          type: "bar",
          barWidth: "60%",
          data: []
        }
      ]
    };
    this.props.dispatch({
      type: "energyServices/getDataList",
      payload: `${monthUrl}&deviceId=${meterData.deviceId}`,
      callback: data => {
        if (data !== undefined) {
          if (Number(data.code) === 200) {
            monthData.series[0].data = data.data;
            this.setState({
              monthData
            });
          } else {
            message.error(data.msg);
          }
        } else {
          message.error("获取月能耗失败，请刷新页面后重试！");
        }
      }
    });
  };

  getYearData = () => {
    const { meterData } = this.state;
    const yearData = {
      color: ["#3398DB"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      title: {
        left: "center",
        text: "用电趋势"
      },
      xAxis: [
        {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ]
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      dataZoom: [
        {
          type: "slider",
          left: "center",
          bottom: 0,
          backgroundColor: "rgba(26,102,178,0.1)",
          borderColor: "rgba(0,0,0,0)",
          textStyle: false,
          dataBackground: {
            lineStyle: {
              opacity: 0
            },
            areaStyle: {
              opacity: 0
            }
          },
          height: 15,
          handleIcon:
            "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
          handleSize: "100%",
          handleStyle: {
            color: "#fff",
            shadowBlur: 5,
            shadowColor: "rgba(0, 0, 0, 0.6)"
          },
          fillerColor: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#40E61F" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#FF7777" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      ],
      series: [
        {
          name: "本年",
          type: "bar",
          barWidth: "60%",
          data: []
        }
      ]
    };
    this.props.dispatch({
      type: "energyServices/getDataList",
      payload: `${yearUrl}&deviceId=${meterData.deviceId}`,
      callback: data => {
        if (data !== undefined) {
          if (Number(data.code) === 200) {
            yearData.series[0].data = data.data;
            this.setState({
              yearData
            });
          } else {
            message.error(data.msg);
          }
        } else {
          message.error("获取年能耗失败，请刷新页面后重试！");
        }
      }
    });
  };

  tabsChange = keys => {
    if (Number(keys) === 1) {
      this.getWeekData();
    } else if (Number(keys) === 2) {
      this.getMonthData();
    } else if (Number(keys) === 3) {
      this.getYearData();
    }
  };

  render() {
    const { meterData, weekData, monthData, yearData } = this.state;
    const option = {
      tooltip: {
        show: true
      },
      series: [
        {
          name: "kwh",
          type: "gauge",
          radius: "75%",
          max: meterData.threshold
            ? (Number(meterData.threshold) / 80) * 100
            : 100,
          data: [
            {
              value: meterData.currentData ? meterData.currentData : 0,
              name: "kwh"
            }
          ]
        }
      ]
    };
    const pic = require("@/assets/setting.png");
    return (
      <div className={styles.meter_history}>
        <StandardCard className="card_container" src={pic}>
          <Row span={24} gutter={40} className={styles.history_box}>
            {/* <div
              className={styles.right_title}
              style={{ marginBottom: "20px" }}
            >
              <img alt="" src={pic} />
              <p className={styles.personCTitleTxt}>
                管理<span style={{ margin: "0 8px" }}>/</span>能耗管理
                <span style={{ margin: "0 8px" }}>/</span>
                <Link to="meterMonitor">电表监控</Link>
                <span style={{ margin: "0 8px" }}>/</span>历史数据
              </p>
            </div> */}
            <Col span={6} className={styles.history_left}>
              <div className={styles.charts_box}>
                <div className={styles.charts_top}>
                  <ReactEcharts option={option} />
                </div>
                <div className={styles.charts_bottom}>
                  <Row span={24}>
                    <Col span={8}>设备地址:</Col>
                    <Col span={16}>
                      {`${meterData.buildingsName}${meterData.floorsName}`}
                    </Col>
                  </Row>
                  <Row span={24}>
                    <Col span={8}>设备卡号:</Col>
                    <Col span={16}>{meterData.iccid}</Col>
                  </Row>
                  <Row span={24}>
                    <Col span={8}>设备编号:</Col>
                    <Col span={16}>{meterData.deviceId}</Col>
                  </Row>
                  <Row span={24}>
                    <Col span={8}>设备创号:</Col>
                    <Col span={16}>{meterData.sensorId}</Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col span={16} offset={2} className={styles.history_right}>
              <Spin spinning={this.props.tableLoading}>
                <Tabs defaultActiveKey="1" onChange={this.tabsChange}>
                  <TabPane tab="本周" key="1">
                    <ReactEcharts
                      option={weekData}
                      style={{ width: "100%", height: "450px" }}
                    />
                  </TabPane>
                  <TabPane tab="本月" key="2">
                    <ReactEcharts
                      option={monthData}
                      style={{ width: "100%", height: "450px" }}
                    />
                  </TabPane>
                  <TabPane tab="本年" key="3">
                    <ReactEcharts
                      option={yearData}
                      style={{ width: "100%", height: "450px" }}
                    />
                  </TabPane>
                </Tabs>
              </Spin>
            </Col>
          </Row>
        </StandardCard>
      </div>
    );
  }
}
export default meterHistory;
