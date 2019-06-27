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
import {
  Form,
  Row,
  Col,
  message,
  // Modal,
  Table,
  Select,
  Input,
  // DatePicker,
  Button
} from "antd";
import moment from "moment";
// import router from "umi/router";
import SiderContent from "@/components/SiderContent";
import CommonSiderBar from "@/components/CommonSiderBar";
import Host from "../../../imcUrl";
import styles from "./index.less";

const ElectricityList = `${Host}/api/DynamicRing/get&devicetype=0603`;

const { Option } = Select;
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
class waterDrainage extends Component {
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
        title: "设备编号",
        dataIndex: "DeviceName"
      },
      {
        title: "设备类型",
        dataIndex: "ServiceAddr"
      },
      {
        title: "区域",
        dataIndex: "iccid"
      },
      {
        title: "楼层",
        dataIndex: "sensorId"
      },
      {
        title: "状态",
        dataIndex: "lastReading"
      },
      {
        title: "更新时间",
        dataIndex: "lastMeterDate"
      },
      {
        title: "操作",
        dataIndex: "opt",
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                this.freshenList(record);
              }}
            >
              刷新
            </a>
          );
        }
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
    // this.getElectricityList();
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
            message.error(data.msg);
          }
        } else {
          message.error("获取给排水信息失败，请刷新页面后重试！");
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

  freshenList = list => {
    console.log(list);
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

  resetForm = () => {
    this.props.form.resetFields();
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
              管理<span style={{ margin: "0 8px" }}>/</span>运营管理
              <span style={{ margin: "0 8px" }}>/</span>给排水
            </p>
          </div> */}
          <div className={styles.monitor_right_content}>
            <Row span={24} gutter={20}>
              <Form>
                <Row span={24} gutter={20}>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label="设备编号">
                      {getFieldDecorator("code")(
                        <Input placeholder="请输入设备编号" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label="设备类型">
                      {getFieldDecorator("type")(
                        <Select placeholder="请选择设备类型">
                          <Option value="jack">Jack</Option>
                          <Option value="lucy">Lucy</Option>
                          <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label="状态">
                      {getFieldDecorator("status")(
                        <Select placeholder="请选择状态">
                          <Option value="jack">Jack</Option>
                          <Option value="lucy">Lucy</Option>
                          <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} style={{ textAlign: "right" }}>
                    {/* <Button>返回</Button> */}
                    <Button type="primary">查询</Button>
                    <Button
                      type="primary"
                      style={{ marginLeft: "15px" }}
                      onClick={this.resetForm}
                    >
                      重置
                    </Button>
                  </Col>
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

  render() {
    return (
      <div className={styles.drainage_box}>
        <SiderContent
          sider={this.renderSider()}
          content={this.renderContent()}
          width={300}
        />
      </div>
    );
  }
}
export default waterDrainage;
