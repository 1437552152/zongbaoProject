import React, { PureComponent } from 'react';
import { Form, Row, Col, Select, DatePicker, Input, Button, Divider } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import StandardCard from '@/components/StandardCard';

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
class Record extends PureComponent {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { orderId } = match.params;
    this.fetchOrderResultDetail(dispatch, orderId);
    this.fetchRepairStateOptions(dispatch);
    this.fetchRepairLevelOptions(dispatch);
    this.fetchRepairResultOptions(dispatch);
    this.fetchRepairComponentTypeOptions(dispatch);
  }

  fetchOrderResultDetail = (dispatch, orderId) => {
    dispatch({
      type: 'workOrder/fetchOrderResultDetail',
      payload: orderId,
      callback: detail => {
        const {
          form: { setFieldsValue },
        } = this.props;
        setFieldsValue({
          org: detail.org,
          engineer: detail.engineer,
          operator: detail.operator,
          malfunctionType: detail.malfunctionTypeDesp,
          deviceType: detail.deviceTypeDesp,
          area: detail.area,
          building: detail.building,
          company: detail.company,
        });
      },
    });
  };

  fetchRepairStateOptions = dispatch => {
    dispatch({
      type: 'workOrder/fetchRepairStateOptions',
    });
  };

  fetchRepairLevelOptions = dispatch => {
    dispatch({
      type: 'workOrder/fetchRepairLevelOptions',
    });
  };

  fetchRepairResultOptions = dispatch => {
    dispatch({
      type: 'workOrder/fetchRepairResultOptions',
    });
  };

  fetchRepairComponentTypeOptions = dispatch => {
    dispatch({
      type: 'workOrder/fetchRepairComponentTypeOptions',
    });
  };

  submit = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/recordWorkOrder',
      payload: values,
      callback: () => {
        router.goBack();
      },
    });
  };

  onSubmit = e => {
    const {
      workOrder: { orderResultDetail },
      form,
      match,
    } = this.props;
    const { orderId } = match.params;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const data = values;
      const start = data.startTime.format('YYYY-MM-DD HH:mm:ss');
      const end = data.endTime.format('YYYY-MM-DD HH:mm:ss');
      data.startTime = start;
      data.endTime = end;
      const v = {
        ...data,
        ...orderResultDetail,
        workOrderId: orderId,
      };
      this.submit(v);
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
          {getFieldDecorator('org', { rules: [{ required: true }] })(<Select disabled />)}
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
          {getFieldDecorator('engineer', { rules: [{ required: true }] })(<Input disabled />)}
        </FormItem>
      </Col>
    );
  };

  operatorItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="操作人">
          {getFieldDecorator('operator', { rules: [{ required: true }] })(<Input disabled />)}
        </FormItem>
      </Col>
    );
  };

  malfunctionTypeItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="维修故障类型">
          {getFieldDecorator('malfunctionType', { rules: [{ required: true }] })(
            <Select disabled />
          )}
        </FormItem>
      </Col>
    );
  };

  operatorTypeItem = getFieldDecorator => {
    const {
      workOrder: { repairStateOptions },
    } = this.props;
    return (
      <Col {...ColLayout}>
        <FormItem label="更换/维修状态">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择更换/维修状态' }],
          })(
            <Select placeholder="请选择更换/维修状态">
              {repairStateOptions.map(value => {
                return <Option key={value.code}>{value.desp}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  operatorLevelItem = getFieldDecorator => {
    const {
      workOrder: { repairLevelOptions },
    } = this.props;
    return (
      <Col {...ColLayout}>
        <FormItem label="维修级别">
          {getFieldDecorator('levels', {
            rules: [{ required: true, message: '请选择维修级别' }],
          })(
            <Select placeholder="请选择维修级别">
              {repairLevelOptions.map(value => {
                return <Option key={value.code}>{value.desp}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  descriptionItem = getFieldDecorator => {
    return (
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
        {getFieldDecorator('description', {
          rules: [
            { required: true, message: '请输入损坏情况（原因）故障说明' },
            { max: 1000, message: '最多可输入1000个字' },
          ],
        })(<TextArea rows={3} />)}
      </FormItem>
    );
  };

  effectItem = getFieldDecorator => {
    return (
      <FormItem label="影响" {...TextAreaLayout}>
        {getFieldDecorator('effect', {
          rules: [
            { required: true, message: '请输入影响' },
            { max: 1000, message: '最多可输入1000个字' },
          ],
        })(<TextArea rows={3} />)}
      </FormItem>
    );
  };

  reasonItem = getFieldDecorator => {
    return (
      <FormItem label="原因对策" {...TextAreaLayout}>
        {getFieldDecorator('reason', {
          rules: [
            { required: true, message: '请输入原因对策' },
            { max: 1000, message: '最多可输入1000个字' },
          ],
        })(<TextArea rows={3} />)}
      </FormItem>
    );
  };

  resultItem = getFieldDecorator => {
    const {
      workOrder: { repairResultOptions },
    } = this.props;
    return (
      <Col {...ColLayout}>
        <FormItem label="维修结果">
          {getFieldDecorator('results', {
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

  repairDetailItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="维修情况">
          {getFieldDecorator('repairDetail', {
            rules: [
              { required: true, message: '请输入维修情况' },
              { max: 1000, message: '最多可输入1000个字' },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
    );
  };

  startTimeItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="更换/维修开始时间">
          {getFieldDecorator('startTime', {
            rules: [{ required: true, message: '请选择更换/维修开始时间' }],
          })(<DatePicker showTime />)}
        </FormItem>
      </Col>
    );
  };

  endTimeItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="更换/维修结束时间">
          {getFieldDecorator('endTime', {
            rules: [{ required: true, message: '请选择更换/维修结束时间' }],
          })(<DatePicker showTime />)}
        </FormItem>
      </Col>
    );
  };

  componentTypeItem = getFieldDecorator => {
    const {
      workOrder: { componentTypeOptions },
    } = this.props;
    return (
      <Col {...ColLayout}>
        <FormItem label="部件类型">
          {getFieldDecorator('componentType', {
            rules: [{ required: true, message: '请选择部件类型' }],
          })(
            <Select placeholder="请选择部件类型">
              {componentTypeOptions.map(value => {
                return <Option key={value.code}>{value.desp}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  deviceTypeItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="设备类型">
          {getFieldDecorator('deviceType', { rules: [{ required: true }] })(<Select disabled />)}
        </FormItem>
      </Col>
    );
  };

  beforeModelItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="更换/维修前型号">
          {getFieldDecorator('beforeModel', {
            rules: [
              { required: true, message: '请输入更换/维修前型号' },
              { max: 50, message: '最多可输入50个字' },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
    );
  };

  afterModelItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="更换/维修后型号">
          {getFieldDecorator('afterModel', {
            rules: [
              { required: true, message: '请输入更换/维修后型号' },
              { max: 50, message: '最多可输入50个字' },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
    );
  };

  areaItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="所属区域">
          {getFieldDecorator('area', { rules: [{ required: true }] })(<Select disabled />)}
        </FormItem>
      </Col>
    );
  };

  buildingItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="所属建筑">
          {getFieldDecorator('building', { rules: [{ required: true }] })(<Select disabled />)}
        </FormItem>
      </Col>
    );
  };

  companyItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="所属公司">
          {getFieldDecorator('company', { rules: [{ required: true }] })(<Select disabled />)}
        </FormItem>
      </Col>
    );
  };

  codeItem = getFieldDecorator => {
    return (
      <Col {...ColLayout}>
        <FormItem label="对应测点CODE">
          {getFieldDecorator('code', {
            rules: [
              { required: true, message: '请输入对应测点CODE' },
              { max: 50, message: '最多可输入50个字' },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
    );
  };

  addressItem = detail => {
    return (
      <Col span={6}>
        <FormItem label="安装位置">
          <span>{detail ? detail.address : null}</span>
        </FormItem>
      </Col>
    );
  };

  codeDespItem = detail => {
    return (
      <Col span={6}>
        <FormItem label="对应测点描述">
          <span>{detail ? detail.codeDesp : null}</span>
        </FormItem>
      </Col>
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      workOrder: { orderResultDetail },
    } = this.props;
    return (
      <StandardCard src="./assets/menu/time-s.png">
        <Form {...FormItemLayout} onSubmit={this.onSubmit}>
          <Row>
            {this.userOrgItem(getFieldDecorator)}
            {this.engineerItem(getFieldDecorator)}
          </Row>
          <Divider />
          <Row>
            {this.operatorItem(getFieldDecorator)}
            {this.malfunctionTypeItem(getFieldDecorator)}
            {this.operatorTypeItem(getFieldDecorator)}
            {this.operatorLevelItem(getFieldDecorator)}
          </Row>
          {this.descriptionItem(getFieldDecorator)}
          {this.effectItem(getFieldDecorator)}
          {this.reasonItem(getFieldDecorator)}
          <Row>
            {this.resultItem(getFieldDecorator)}
            {this.repairDetailItem(getFieldDecorator)}
            {this.startTimeItem(getFieldDecorator)}
            {this.endTimeItem(getFieldDecorator)}
          </Row>
          <Divider />
          <Row>
            {this.componentTypeItem(getFieldDecorator)}
            {this.deviceTypeItem(getFieldDecorator)}
            {this.beforeModelItem(getFieldDecorator)}
            {this.afterModelItem(getFieldDecorator)}
          </Row>
          <Row>
            {this.areaItem(getFieldDecorator)}
            {this.buildingItem(getFieldDecorator)}
            {this.companyItem(getFieldDecorator)}
            {this.codeItem(getFieldDecorator)}
          </Row>
          <Row>
            {this.addressItem(orderResultDetail)}
            {this.codeDespItem(orderResultDetail)}
            <Col span={2} offset={6}>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </Col>
            <Col span={2}>
              <Button onClick={this.onCancel}>取消</Button>
            </Col>
          </Row>
        </Form>
      </StandardCard>
    );
  }
}

export default Record;
