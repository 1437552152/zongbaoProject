import React, { PureComponent } from 'react';
import { Form, Row, Col, Select, DatePicker, Input, Button, Divider, Upload, message } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import StandardCard from '@/components/StandardCard';
// import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;

const FormItemLayout = {
  labelCol: {
    sm: { span: 10 },
    md: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 14 },
    md: { span: 16 },
    xxl: { span: 16 },
  },
};

const TextAreaLayout = {
  labelCol: {
    sm: { span: 6 },
    md: { span: 4 },
    xxl: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 18 },
    md: { span: 20 },
    xxl: { span: 22 },
  },
};

const ColLayout = {
  sm: 24,
  md: 12,
  xxl: 6,
};

@Form.create()
@connect(({ workOrder, loading }) => ({
  workOrder,
  loading: loading.models.workOrder,
}))
class Check extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileToUpload: null,
      attachmentId: null,
    };
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { orderId } = match.params;
    this.fetchOrderRecordDetail(dispatch, orderId);
    this.fetchRepairResultOptions(dispatch);
  }

  fetchOrderRecordDetail = (dispatch, orderId) => {
    dispatch({
      type: 'workOrder/fetchOrderRecordDetail',
      payload: orderId,
      callback: detail => {
        const {
          form: { setFieldsValue },
        } = this.props;
        const value = { ...detail };
        value.startTime = moment(value.startTime, 'YYYY-MM-DD HH:mm:ss');
        value.endTime = moment(value.endTime, 'YYYY-MM-DD HH:mm:ss');
        setFieldsValue({
          ...value,
        });
      },
    });
  };

  fetchRepairResultOptions = dispatch => {
    dispatch({
      type: 'workOrder/fetchRepairResultOptions',
    });
  };

  onFileRemove = () => {
    this.setState({
      fileToUpload: null,
    });
  };

  beforeFileUpload = file => {
    this.setState({
      fileToUpload: file,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/uploadFile',
      payload: file,
      callback: attachmentId => {
        this.setState({
          attachmentId,
        });
      },
    });
    return false;
  };

  onSubmit = e => {
    const {
      form,
      dispatch,
      workOrder: { orderRecordDetail },
    } = this.props;
    const { attachmentId } = this.state;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!attachmentId) {
        message.error('请等待影像资料上传完毕');
        return;
      }
      const params = {
        id: orderRecordDetail.checkId,
        results: values.checkResults,
        remark: values.remark,
        attachmentId,
      };
      dispatch({
        type: 'workOrder/checkOrder',
        payload: params,
        callback: () => {
          router.goBack();
        },
      });
    });
  };

  onCancel = () => {
    router.goBack();
  };

  userOrgItem = getFieldDecorator => {
    return (
      <Col sm={24} md={12}>
        <FormItem
          label="使用单位"
          labelCol={{ sm: { sapn: 10 }, md: { span: 4 } }}
          wrapperCol={{ sm: { sapn: 14 }, md: { span: 12 } }}
        >
          {getFieldDecorator('org', { rules: [{ required: true }] })(
            <Select style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  engineerItem = getFieldDecorator => {
    return (
      <Col sm={24} md={12}>
        <FormItem
          label="使用方工程师"
          labelCol={{ sm: { sapn: 10 }, md: { span: 4 } }}
          wrapperCol={{ sm: { sapn: 14 }, md: { span: 12 } }}
        >
          {getFieldDecorator('engineer', { rules: [{ required: true }] })(
            <Input style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  operatorItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="操作人">
          {getFieldDecorator('operator', { rules: [{ required: true }] })(
            <Input style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  malfunctionTypeItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="维修故障类型">
          {getFieldDecorator('malfunctionTypeDesp', { rules: [{ required: true }] })(
            <Select disabled style={{ width: '100%' }} />
          )}
        </FormItem>
      </Col>
    );
  };

  operatorTypeItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="更换/维修状态">
          {getFieldDecorator('typeDesp', { rules: [{ required: true }] })(
            <Select style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  operatorLevelItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="维修级别">
          {getFieldDecorator('levelsDesp', { rules: [{ required: true }] })(
            <Select style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  descriptionItem = getFieldDecorator => {
    return (
      <Col span={24}>
        <FormItem
          label={
            <span>
              损坏情况（原因）
              <br />
              故障说明
            </span>
          }
          {...TextAreaLayout}
        >
          {getFieldDecorator('description', { rules: [{ required: true }] })(
            <TextArea rows={3} style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  effectItem = getFieldDecorator => {
    return (
      <Col span={24}>
        <FormItem label="影响" {...TextAreaLayout}>
          {getFieldDecorator('effect', { rules: [{ required: true }] })(
            <TextArea rows={3} style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  reasonItem = getFieldDecorator => {
    return (
      <Col span={24}>
        <FormItem label="原因对策" {...TextAreaLayout}>
          {getFieldDecorator('reason', { rules: [{ required: true }] })(
            <TextArea rows={3} style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  resultItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="维修结果">
          {getFieldDecorator('resultsDesp', { rules: [{ required: true }] })(
            <Select style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  repairDetailItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="维修情况">
          {getFieldDecorator('repairDetail', { rules: [{ required: true }] })(
            <Input style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  planBeginTime = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="计划开始时间">
          {getFieldDecorator('startTime', { rules: [{ required: true }] })(
            <DatePicker showTime style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  completeTime = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="完成提交时间">
          {getFieldDecorator('endTime', { rules: [{ required: true }] })(
            <DatePicker showTime style={{ width: '100%' }} disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  checkResultItem = getFieldDecorator => {
    const {
      workOrder: { repairResultOptions },
    } = this.props;
    return (
      <Col {...ColLayout}>
        <FormItem label="维修结果" {...FormItemLayout}>
          {getFieldDecorator('checkResults', {
            rules: [{ required: true, message: '请选择维修结果' }],
          })(
            <Select placeholder="请选择维修结果">
              {repairResultOptions.map(value => {
                return <Option key={value.code}>{value.desp}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  uploadItem = getFieldDecorator => {
    const { fileToUpload } = this.state;
    return (
      <Col {...ColLayout}>
        <FormItem label="上传影像资料" {...FormItemLayout}>
          {getFieldDecorator('upload', {
            rules: [{ required: true, message: '请上传影像资料' }],
          })(
            <Upload
              accept="image/*"
              name="file"
              action=""
              onRemove={this.onFileRemove}
              beforeUpload={this.beforeFileUpload}
            >
              {fileToUpload ? null : <Button>选择</Button>}
            </Upload>
          )}
        </FormItem>
      </Col>
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      workOrder: { orderRecordDetail },
    } = this.props;
    return (
      <StandardCard src="./assets/menu/time-s.png">
        <Form {...FormItemLayout} onSubmit={this.onSubmit}>
          <Row>
            {this.userOrgItem(getFieldDecorator)}
            {this.engineerItem(getFieldDecorator)}
            <Divider />
            {this.operatorItem(getFieldDecorator)}
            {this.malfunctionTypeItem(getFieldDecorator)}
            {this.operatorTypeItem(getFieldDecorator)}
            {this.operatorLevelItem(getFieldDecorator)}
            {this.descriptionItem(getFieldDecorator)}
            {this.effectItem(getFieldDecorator)}
            {this.reasonItem(getFieldDecorator)}
            {this.resultItem(getFieldDecorator)}
            {this.repairDetailItem(getFieldDecorator)}
            {this.planBeginTime(getFieldDecorator)}
            {this.completeTime(getFieldDecorator)}
          </Row>
          <Divider />
          <Row>
            <Col span={6}>
              <FormItem label="查验人" {...FormItemLayout}>
                {orderRecordDetail ? orderRecordDetail.checkUserName : null}
              </FormItem>
            </Col>
          </Row>
          <Row>
            {this.checkResultItem(getFieldDecorator)}
            {this.uploadItem(getFieldDecorator)}
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="备注" {...TextAreaLayout}>
                {getFieldDecorator('remark', {
                  rules: [
                    { required: true, message: '请输入备注' },
                    { max: 1000, message: '最多可输入1000个字' },
                  ],
                })(<TextArea rows={3} style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col span={4} offset={2}>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={this.onCancel}>
                取消
              </Button>
            </Col>
          </Row>
        </Form>
      </StandardCard>
    );
  }
}

export default Check;
