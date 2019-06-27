/*
 * @Desc: 小审批
 * @Author: xgyuan100
 * @Date: 2019-06-03 19:36:17
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-06-03 19:37:23
 */
import React, { PureComponent } from 'react';
import { Button, Radio, Divider, message, Form} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import StandardCard from '@/components/StandardCard';

import styles from './processApprovalZ.less';
import KeyValueDisInput from './KeyValueDisInput';

@Form.create()
@connect(({ processAS1, loading }) => ({
  processAS1,
  loading: loading.models.processAS,
}))
class processApprovalZ extends PureComponent {
  state = {
    // eslint-disable-next-line react/no-unused-state
    currentArea: '2',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params:{id} } = match;
    dispatch({
      type: 'processAS1/fetchBasic',
      payload: id
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { currentArea } = this.state;
    const { dispatch, processAS1,form } = this.props;
    const id = processAS1.stepData ? processAS1.stepData.id : null;
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({
        type: 'processAS1/fetchProcessNode',
        payload: {
          id,
          keypoint:"步骤关键点",
          approvalStatus: values.approvalStatus
        },
        callback: () => {
          router.push(`/iop/manage/processApprovalS`);
          this.fetchProcessList(currentArea);
        },
      });
      // console.log('Submit!!!');
      console.log(values);
    });
  };

  handleReset = () => {
    router.goBack();
  };

  fetchProcessList = areaId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'processAS1/fetchAllProcess',
      payload: areaId,
    });
  };

  renderTop = () => {
    const { processAS1 } = this.props;
    const stepNum = processAS1.stepData ? processAS1.stepData.id : null;
    const stepTime = processAS1.stepData ? processAS1.stepData.times : null;
    const person = processAS1.stepData ? processAS1.stepData.auditName : null;
    return (
      <div className={styles.top}>
        <span>步骤序号：{stepNum}</span>
        <span>步骤时间点：{stepTime}</span>
        <span>步骤发起人：{person}</span>
      </div>
    );
  };

  renderCenter = () => {
    const { processAS1 } = this.props;

    console.log("121212",processAS1)


    const detail = processAS1.stepData ? processAS1.stepData.detail : '';
    const keypoint = processAS1.stepData ? processAS1.stepData.keypoint : '';
    
    return (
      <div><KeyValueDisInput title="步骤内容:" content={detail} isArea /> <KeyValueDisInput title="步骤关键点:" content={keypoint} /></div>
    );
  };

  renderBottom = () => {
    const { form: { getFieldDecorator }} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    return (
      <>
        <div className={styles.bottomContainer}>
          <Form layout="horizontal" labelAlign="left" style={{ marginTop: 35 }}>
            <Form.Item label="审批结果" {...formItemLayout}>
              {getFieldDecorator('approvalStatus', {
                initialValue: '1',
              })(
                <Radio.Group>
                  <Radio value="1">通过并发至上级审批</Radio>
                  <Radio value="0">驳回</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Form>
        </div>
        <div className={styles.bottomContainer}>
          <span className={styles.bottomSpan} />
          <Button type="primary" onClick={this.handleSubmit}>
            确定
          </Button>
          <Button type="primary" onClick={this.handleReset} style={{ marginLeft: 20 }}>
            取消
          </Button>
        </div>
      </>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <StandardCard
        full
        src="./assets/menu/time-s.png"
        bodyStyle={{ marginLeft: 16 }}
        loading={loading}
      >
        {this.renderTop()}
        {this.renderCenter()}
        <Divider style={{ marginTop: 40 }} />
        {this.renderBottom()}
      </StandardCard>
    );
  }
}
export default processApprovalZ;
