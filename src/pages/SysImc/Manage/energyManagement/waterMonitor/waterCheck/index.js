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
import {
  Form,
  Row,
  Col,
  message,
  // Modal,
  Table,
  // Spin,
  // Input,
  DatePicker,
  Button
} from "antd";
import StandardCard from "@/components/StandardCard";
import moment from "moment";
// import router from "umi/router";
import SiderContent from "@/components/SiderContent";
import CommonSiderBar from "@/components/CommonSiderBar";
import Host from "../../../../imcUrl";
import styles from "./index.less";

const ElectricityList = `${Host}/api/MeterReading&type=water`;
// const saveUrl = `${Host}/api/energymanagement/SavePowerThreshold`;
const { MonthPicker } = DatePicker;
// const { Option } = Select;
const FormItem = Form.Item;
const format = "YYYY-MM";
// const getWindowWidth = () =>
//   window.innerWidth || document.documentElement.clientWidth;

@connect(({ energyServices, loading }) => ({
  energyServices,
  tableLoading: loading.effects["energyServices/getDataList"] || false,
  dislogLoading: loading.effects["energyServices/postDataList"] || false
}))
@Form.create()
class energyMonitor extends Component {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        align: "center",
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: "设备Id",
        dataIndex: "DeviceName"
      },
      {
        title: "服务地址",
        dataIndex: "ServiceAddr"
      },
      {
        title: "业务卡号",
        dataIndex: "iccid"
      },
      {
        title: "设备标识码",
        dataIndex: "sensorId"
      },
      {
        title: "上次抄表读数",
        dataIndex: "lastReading"
      },
      {
        title: "上次抄表时间",
        dataIndex: "lastMeterDate"
      },
      {
        title: "本次抄表读数",
        dataIndex: "currentReading"
      },
      {
        title: "本次抄表时间",
        dataIndex: "currentMeterDate"
      },
      {
        title: "间隔时间(天)",
        dataIndex: "dateInterval"
      },
      {
        title: "用电度数",
        dataIndex: "usageData"
      }
    ];
    this.state = {
      dataSource: [],
      columns,
      selectedRowKeys: [],
      page: 1,
      pageSize: 10,
      total: 0,
      rowData: {},
      setVisible: false,
      selectList: {}
    };
  }

  componentDidMount() {
    this.getElectricityList();
    const { dispatch } = this.props;
    dispatch({
      type: "energyServices/fetchAreaTree",
      payload: { type: "2", id: "1" }
    });
  }

  getElectricityList = list => {
    const values = this.props.form.getFieldsValue(["checkTime"]);
    this.props.dispatch({
      type: "energyServices/getDataList",
      payload:
        list === undefined
          ? `${ElectricityList}&meterDay=${moment(values.checkTime).format(
              format
            )}`
          : `${ElectricityList}&meterDay=${moment(values.checkTime).format(
              format
            )}${list}`,
      callback: data => {
        if (data !== undefined) {
          if (Number(data.code) === 200) {
            this.setState({
              dataSource: data.data
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

  currentChang = (page, size) => {
    this.setState(
      {
        pageSize: size,
        page
      },
      () => {
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
      }
    );
  };

  sizeChange = (page, size) => {
    this.setState(
      {
        pageSize: size,
        page
      },
      () => {
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
      }
    );
  };

  timeChange = () => {
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
  };

  renderContent = () => {
    const pic = require("@/assets/setting.png");
    const {
      dataSource,
      columns,
      page,
      pageSize,
      total,
      selectedRowKeys
    } = this.state;
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
      <StandardCard className="card_container" src={pic}>
        <div className={styles.monitor_right}>
          {/* <div className={styles.right_title}>
            <img alt="" src={pic} />
            <p className={styles.personCTitleTxt}>
              管理<span style={{ margin: "0 8px" }}>/</span>抄表管理
              <span style={{ margin: "0 8px" }}>/</span>水表抄表
            </p>
          </div> */}
          <div className={styles.monitor_right_content}>
            <Row span={24} gutter={20}>
              <Form>
                <Row span={24}>
                  <Col span={6}>
                    <Row span={24}>
                      <FormItem {...formItemLayout} label="抄表时间">
                        {getFieldDecorator("checkTime", {
                          initialValue: moment(new Date(), format)
                        })(
                          <MonthPicker
                            placeholder="请选择抄表时间"
                            onChange={this.timeChange}
                            format={format}
                            style={{ width: "100%" }}
                          />
                        )}
                      </FormItem>
                    </Row>
                  </Col>
                  {/* <Col span={18} style={{ textAlign: "right" }}>
                    <Button type="primary" style={{ marginLeft: "15px" }}>
                      抄表日期设置
                    </Button>
                    <Button type="primary" style={{ marginLeft: "15px" }}>
                      导出
                    </Button>
                  </Col> */}
                </Row>
              </Form>
            </Row>
            <Row span={24}>
              <Table
                rowKey="id"
                rowSelection={{
                  type: "radio",
                  columnTitle: "选择",
                  selectedRowKeys,
                  onSelect: record => {
                    this.setState({
                      rowData: record,
                      selectedRowKeys: [record.id]
                    });
                  }
                }}
                onRow={record => {
                  return {
                    onClick: () => {
                      this.setState({
                        rowData: record,
                        selectedRowKeys: [record.id]
                      });
                    }
                  };
                }}
                dataSource={dataSource}
                columns={columns}
                loading={this.props.tableLoading}
                bordered
                pagination={{
                  showSizeChanger: true,
                  total,
                  currentPage: page,
                  pageSize,
                  showTotal: totals => `共 ${totals} 条`,
                  onChange: (current, pageMuch) => {
                    this.currentChang(current, pageMuch);
                  },
                  onShowSizeChange: (current, size) => {
                    this.sizeChange(current, size);
                  }
                }}
              />
            </Row>
          </div>
        </div>
      </StandardCard>
    );
  };

  // saveThreshold = () => {
  //   this.props.form.validateFields(
  //     ["cycle", "time", "threshold"],
  //     (err, filedsValue) => {
  //       if (!err) {
  //         const { thresList } = this.state;
  //         this.props.dispatch({
  //           type: "energyServices/postDataList",
  //           payload: {
  //             url: saveUrl,
  //             params: {
  //               deviceId: thresList.deviceId,
  //               period: filedsValue.cycle,
  //               startTime: moment(filedsValue.time).format(format),
  //               threshold: filedsValue.threshold
  //             }
  //           },
  //           callback: data => {
  //             if (data !== undefined) {
  //               if (Number(data.code) === 200) {
  //                 const { selectList } = this.state;
  //                 if (Object.keys(selectList).length > 0) {
  //                   this.getParentList(selectList, response => {
  //                     if (response === 0) {
  //                       this.getElectricityList();
  //                     } else {
  //                       this.getElectricityList(response);
  //                     }
  //                   });
  //                 } else {
  //                   this.getElectricityList();
  //                 }
  //                 message.success("告警阈值设置成功！");
  //                 this.setThreshold();
  //               } else {
  //                 message.error(data.msg);
  //               }
  //             } else {
  //               message.error("告警阈值设置失败，请刷新页面后重试！");
  //             }
  //           }
  //         });
  //       }
  //     }
  //   );
  // };

  render() {
    // const { setVisible } = this.state;
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
      <div className={styles.water_check}>
        <SiderContent
          sider={this.renderSider()}
          content={this.renderContent()}
          width={300}
        />

        {/* <Spin spinning={this.props.dislogLoading}>
          <Modal
            title="告警阈值"
            centered
            destroyOnClose
            visible={setVisible}
            onOk={() => this.saveThreshold()}
            onCancel={() => this.setThreshold()}
            footer={[]}
            width={450}
            className={styles.set_dialog}
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
        </Spin> */}
      </div>
    );
  }
}
export default energyMonitor;
