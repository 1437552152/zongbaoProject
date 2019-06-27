/*
 * @Author: yeyifu
 * @Date: 2019-05-29 13:52:42
 * @Last Modified by: yeyifu
 * @Last Modified time: 2019-05-29 14:05:21
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Select, DatePicker, Upload, Icon, Col, Row, message } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ alarmState }) => ({
  alarmState,
}))
@Form.create()
class AddPlan extends PureComponent {
  state = {};

  componentDidMount() {}

  onComfirm = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('values===>', values);
    });
  };
  //图片上传
  onUploadChange = info => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 3 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 5 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Form {...formItemLayout} onSubmit={this.onComfirm}>
          <Row>
            <Col span={8}>
              <Form.Item label="计划类型/流程选择：" className={styles.eqModalItem}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择是否启用：' }],
                  // initialValue: this.state.selectdDivise.type==0?"不启用":"启用",
                })(
                  <Select placeholder="请选择启用状态">
                    <Option value="0">条目一</Option>
                    <Option value="1">条目二</Option>
                    <Option value="2">条目三</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="责任人：" className={styles.eqModalItem}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择是否启用：' }],
                  // initialValue: this.state.selectdDivise.type==0?"不启用":"启用",
                })(<Input className={styles.addeqInput} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计划开始时间">
                {getFieldDecorator('date-picker', config)(
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="责任部门：" className={styles.eqModalItem}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择是否启用：' }],
                  // initialValue: this.state.selectdDivise.type==0?"不启用":"启用",
                })(<Input className={styles.addeqInput} />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="配合部门：" className={styles.eqModalItem}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择是否启用：' }],
                  // initialValue: this.state.selectdDivise.type==0?"不启用":"启用",
                })(<Input className={styles.addeqInput} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计划结束时间">
                {getFieldDecorator('date-picker', config)(
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计划级别">
                {getFieldDecorator('date-picker', config)(<Input className={styles.addeqInput} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="工作项目：" className={styles.eqModalItem}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择是否启用：' }],
                  // initialValue: this.state.selectdDivise.type==0?"不启用":"启用",
                })(
                  <Select placeholder="请选择启用状态">
                    <Option value="0">不启用</Option>
                    <Option value="1">启用</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="项目描述：" className={styles.eqModalItem}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请对项目进行描述：' }],
                  // initialValue: this.state.selectdDivise.type==0?"不启用":"启用",
                })(<TextArea autosize={{ minRows: 2, maxRows: 8 }} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="所属区域：" className={styles.eqModalItem}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择所属区域：' }],
                  // initialValue: this.state.selectdDivise.type==0?"不启用":"启用",
                })(
                  <Select placeholder="请选择所属区域：">
                    <Option value="0">不启用</Option>
                    <Option value="1">启用</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="所属配电房：" className={styles.eqModalItem}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择所属配电房：' }],
                  // initialValue: this.state.selectdDivise.type==0?"不启用":"启用",
                })(
                  <Select placeholder="请选择所属配电房：">
                    <Option value="0">不启用</Option>
                    <Option value="1">启用</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="计划附件：">
                {getFieldDecorator('upload', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                })(
                  <Upload
                    name="logo"
                    action="http://10.110.200.145:8080/services/monitor/file/upload"
                    onChange={this.onUploadChange}
                    withCredentials="true"
                  >
                    <Button>
                      <Icon type="upload" /> 上传附件
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                wrapperCol={{
                  xs: { span: 24, offset: 0 },
                  sm: { span: 16, offset: 10 },
                }}
              >
                <Button type="primary" htmlType="submit">
                  添加
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  清除
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create()(AddPlan);
