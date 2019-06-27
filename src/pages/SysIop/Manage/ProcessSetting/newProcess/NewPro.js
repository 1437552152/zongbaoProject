import React, { PureComponent } from 'react';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import styles from './newProcess.less';

@connect(({ newProcess }) => ({
  newProcess,
}))
@Form.create()
class NewPro extends PureComponent {
  onComfirm = e => {
    const { form, dispatch, flowId } = this.props;
    console.log(this.props);
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.fid = flowId;
      dispatch({
        type: 'newProcess/addProcess',
        payload: values,
        callback: res => {
          this.updatecallback(res);
        },
      });
    });
  };

  updatecallback = res => {
    const { addprocess, form } = this.props;
    if (res.code === 200) {
      message.success('新增成功');
      addprocess();
      form.resetFields();
    }
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 3 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 5 },
        sm: { span: 14 },
      },
    };

    return (
      <div className={styles.equipmenCMain}>
        <div className={styles.processASListMain}>
          <div className={styles.box}>
            <Form {...formItemLayout} onSubmit={this.onComfirm}>
              <Row>
                <Col span={24}>
                  <Form.Item label="流程名称：" className={styles.eqModalItem}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入流程名称' },{
                        max:50,
                        message: '长度不能大于50个字符',
                      }],
                      // initialValue: '日常点检',
                    })(<Input className={styles.addeqInput} />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    wrapperCol={{
                      xs: { span: 24, offset: 0 },
                      sm: { span: 16, offset: 14 },
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={classnames(styles.btn, 'blue_btn')}
                    >
                      添加
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={this.handleReset}
                      className={classnames(styles.btn, 'red_btn')}
                    >
                      清除
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
export default NewPro;
