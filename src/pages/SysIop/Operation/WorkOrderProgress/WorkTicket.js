import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, Button, Upload, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import StandardCard from '@/components/StandardCard';
import Host from '../../../../../config/url.config';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ workOrder, loading }) => ({
  workOrder,
  loading: loading.models.workOrder,
}))
class WorkTicket extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageToUpload: null,
      imageNameForUpload: null,
    };
  }

  componentDidMount() {
    this.fetchOrderDetail();
    this.fetchTicketTypeOptions();
  }

  fetchOrderDetail = () => {
    const { dispatch, match } = this.props;
    const { orderId } = match.params;
    dispatch({
      type: 'workOrder/fetchOrderDetail',
      payload: orderId,
    });
  };

  areaString = area => {
    let str = '武汉';
    let tempArea = area;
    while (tempArea) {
      str = `${str} > ${area.name}`;
      const { children } = tempArea;
      if (children && children.length !== 0) {
        tempArea = { ...children };
      } else {
        tempArea = null;
      }
    }
    return str;
  };

  fetchTicketTypeOptions = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/fetchTicketTypeOptions',
    });
  };

  onDownloadClick = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      window.open(`${Host}/services/monitor/workorder/download/2/${values.type}`);
    });
  };

  beforeTicketUpload = file => {
    const url = window.URL.createObjectURL(file);
    this.setState({
      imageToUpload: url,
      imageNameForUpload: file.name,
    });
    const { dispatch, match } = this.props;
    const { orderId } = match.params;
    dispatch({
      type: 'workOrder/uploadWorkTicket',
      payload: {
        id: orderId,
        file,
      },
      callback: () => {
        message.success('上传成功', 1, () => {
          router.goBack();
        });
      },
    });
    return false;
  };

  render() {
    const {
      workOrder: { orderDetail, ticketTypeOptions },
      form: { getFieldDecorator },
    } = this.props;
    const { imageToUpload, imageNameForUpload } = this.state;
    return (
      <StandardCard full src="./assets/menu/yunwei-s.png">
        <div className={styles.top}>
          <span>
            <img src="./assets/icons/zone.png" alt="" />
            {orderDetail ? this.areaString(orderDetail.area) : null}
          </span>
          <span>
            <img src="./assets/icons/category.png" alt="" />
            派工单号: {orderDetail ? orderDetail.numbers : null}
          </span>
          <span>
            <img src="./assets/icons/record.png" alt="" />
            故障类型: 故障处理
          </span>
          <span>
            <img src="./assets/icons/record.png" alt="" />
            故障内容: {orderDetail ? orderDetail.detail : null}
          </span>
          <span>
            <img src="./assets/icons/record.png" alt="" />
            故障时间: {orderDetail ? orderDetail.malfunctionTime : null}
          </span>
          <span>
            <img src="./assets/icons/record.png" alt="" />
            分配人员: {orderDetail ? orderDetail.assigner : null}
          </span>
          <span>
            <img src="./assets/icons/record.png" alt="" />
            执行人员: {orderDetail ? orderDetail.handler : null}
          </span>
          <span>
            <img src="./assets/icons/record.png" alt="" />
            派工人员: {orderDetail ? orderDetail.assigner : null}
          </span>
          <span>
            <img src="./assets/icons/record.png" alt="" />
            派工时间: {orderDetail ? orderDetail.orderTime : null}
          </span>
        </div>
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <Form onSubmit={this.onDownloadClick} layout="inline">
            <FormItem label="类型">
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择类型' }],
              })(
                <Select placeholder="请选择类型" style={{ width: 200 }}>
                  {ticketTypeOptions.map(value => {
                    return <Option key={value.id}>{value.desp}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
            <Button htmlType="submit" type="primary">
              下载空白工作票
            </Button>
          </Form>
        </div>
        <Row type="flex" align="middle">
          <Col span={4}>上传工作票扫描件已完成</Col>
          <Col span={4}>{imageNameForUpload}</Col>
          <Col span={2}>
            <Upload
              showUploadList={false}
              accept="image/*"
              name="file"
              action=""
              beforeUpload={this.beforeTicketUpload}
            >
              <Button disabled={imageToUpload !== null}>选择</Button>
            </Upload>
          </Col>
        </Row>
        <div>
          <img src={imageToUpload} alt="" />
        </div>
      </StandardCard>
    );
  }
}

export default WorkTicket;
