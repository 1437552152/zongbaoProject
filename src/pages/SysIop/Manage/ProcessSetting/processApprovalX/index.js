/* eslint-disable no-shadow */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Card, Steps, Divider, Icon, Radio, Mentions, Input, message } from 'antd';
import classnames from 'classnames';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import styles from './processApprovalX.less';
import findIndex from 'lodash/findIndex';
import StandardCard from '@/components/StandardCard';

const { Option, getMentions } = Mentions;
const FormItem = Form.Item;
const { TextArea } = Input;
@Form.create()
@connect(({ processApprovalX, loading }) => ({
  processApprovalX,
  loading: loading.models.processApprovalX,
}))
class processApprovalX extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      currentArea: 1,
      stepDirection: 'horizontal',
      // eslint-disable-next-line react/no-unused-state
      value: 1,
      stepDetail: {
        stepName: value.stepName || '定期点检流程',
        auditName: value.auditName || 'SmartMs',
        stepTime: value.stepTime || '点检前',
        stepContent:
          value.stepContent ||
          `
          1、仪表准备
            1.1、万用表
            1.2、红外测量仪
            1.3、验电笔、验电器
            1.4、其他需要使用的仪表
          2、安全用具准备
            2.1、10KV绝缘鞋，绝缘手台（进入变压器室空载绝缘鞋，绝缘手套）
            2.2、低压绝缘鞋（进入夹层应穿低压绝缘鞋）
            2.3、绝缘手套
          3、工具准备
            3.1、电工工具包（螺丝刀，电工钳，电胶布等工具）
            3.2、电柜门钥匙
            3.3、点检记录表
            3.4、数码照相机
          `,
        stepPiont: value.stepPiont || '点检前',
        stepId: value.stepId || '1',
      },
      curStepIndex: 0,
      // eslint-disable-next-line react/no-unused-state
      currentIndex: '',
      // eslint-disable-next-line react/no-unused-state
      defaultValue: {},
    };
  }

  componentDidMount() {
    const { currentArea } = this.state;
    const { dispatch, match:{params:{id}} } = this.props;
    console.log(this.props)
    this.processClick(currentArea, 0);
    dispatch({
      type: 'processApprovalX/clickProcessDetail',
      payload: id, 
    });
  }

  handleSubmit = e => {
    const { currentArea } = this.state;
    const { dispatch, form} = this.props;
    e.preventDefault();
    form.validateFields((errors, values) => {
      if (!errors) {
        return;
      }
      if (values.approvalOpinion !== undefined) {
        dispatch({
          type: 'processApprovalX/BigProcessNode',
          payload: {
            values,
            id:8
          },
          callback: () => {
            router.push(`/iop/manage/processApprovalS`);
            this.fetchProcessList(currentArea);
          },
        });
      } else {
        message.error('您还没写审核建议！');
      }
    });
  };

  // 提交添加
  handleReset = () => {
    router.goBack();
  };

  checkMention = (rule, value, callback) => {
    const approvalOpinion = getMentions(value);
    if (approvalOpinion.length < 2) {
      callback(new Error('请写出的您的审批意见！！！'));
    } else {
      callback();
    }
  };

  processClick = (stepId, params) => {
    this.setState({ curStepIndex: params-1 });
    const { dispatch } = this.props;
    dispatch({
      type: 'processApprovalX/fetcDetail',
      payload: stepId,
      callback: detail => {
        const {
          form: { setFieldsValue },
        } = this.props;
        if (stepId > 0 && stepId === detail.id) {
          setFieldsValue({
            stepName: detail.name,
            auditName: detail.keypoint,
            stepTime: detail.appName,
            stepContent: detail.detail,
            stepPiont: detail.times,
          });
        }
      },
    });
    dispatch({
      type: 'processApprovalX/clickProcessStep',
      payload: stepId,
    });
  };

  fetchProcessList = areaId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'processApprovalX/fetchAllProcess',
      payload: areaId,
    });
  };

  renderTop = () => {
    const { processApprovalX } = this.props;
    // console.log(processApprovalX)
    const faqiPerson = processApprovalX.detailData
      ? processApprovalX.detailData.createUserIdLastName
      : null;
    const shenpiContent = processApprovalX.detailData ? processApprovalX.detailData.name : null;
    const paigongTime = processApprovalX.detailData
      ? processApprovalX.detailData.lastUpdateDate
      : null;
    return (
      <div className={styles.top}>
        <span>
          <img src="./assets/icons/executor.png" alt="" />
          发起人:{faqiPerson}
        </span>
        <span>
          <img src="./assets/icons/record.png" alt="" />
          审批内容: {shenpiContent}
        </span>
        <span>
          <img src="./assets/icons/time.png" alt="" />
          派工时间: {paigongTime}
        </span>
      </div>
    );
  };

  renderSteps = stepsF => {
    const dotNode = (_, { index }) => {
      const { curStepIndex} = this.state;
      const {processApprovalX:{detailData:{flowStepList}}} = this.props;
      let current = 0;
      // flowStauts为流程状态 ==> 1为通过 2为进行中 0终止
      if (flowStepList) {
        current = findIndex(flowStepList, item => {
          return item.approvalStatus === '2';
        });
      }

      const steps = flowStepList.map(item => {
        return {
          id: item.id,
          title: item.name,
          status: item.approvalStatus,
          onClick: () => {
            this.processClick();
          },
        };
      });
      console.log(steps)
      // 当前选中的样式
      let cls = styles.dotTitle;
      if (index === curStepIndex) {
        cls = classnames(cls, styles.dotTitleActive);
      }
      // todo 根据业务换颜色!!!!!
      let clsSp = styles.sp_base;
      switch (steps[index].status) {
        case '1':
          clsSp = classnames(clsSp, styles.sp_blue);
          break;
        case '0':
          clsSp = classnames(clsSp, styles.sp_red);
          break;
        case '2':
          clsSp = classnames(clsSp, styles.sp_green);
          break;
        default:
          clsSp = classnames(clsSp, styles.sp_blue);
      } 
      return (
        <div className={cls} onClick={() => this.processClick(index+1, index+1)}>
          <span className={clsSp}>{index + 1}</span>
        </div>
      );
    };
    return (
      <div className={styles.stepsContainer}>
        <div className={styles.steps}>
          <Steps progressDot={dotNode}>{stepsF && stepsF.map(() => <Steps.Step />)}</Steps>
        </div>
      </div>
    );
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const that = this;

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
      <div style={{ marginTop: 40, marginLeft: 16, minWidth: 540 }}>
        <Form hideRequiredMark labelAlign="left">
          <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.stepName" />}>
            {getFieldDecorator('stepName', {
              initialValue: that.state.stepDetail.stepName,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.title.required' }),
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.auditName" />}>
            {getFieldDecorator('auditName', {
              initialValue: that.state.stepDetail.auditName,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.title.required' }),
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.stepTime" />}>
            {getFieldDecorator('stepTime', {
              initialValue: that.state.stepDetail.stepTime,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.title.required' }),
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.stepContent"  />}>
            {getFieldDecorator('stepContent', {
              initialValue: that.state.stepDetail.stepContent,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.goal.required' }),
                },
              ],
            })(
              <TextArea
                placeholder={formatMessage({ id: 'form.goal.placeholder' })}
                // rows={4}
                // autosize
                autosize={{ minRows: 4, maxRows: 10 }}
                disabled
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.stepPiont" />}>
            {getFieldDecorator('stepPiont', {
              initialValue: that.state.stepDetail.stepPiont,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.title.required' }),
                },
              ],
            })(<Input disabled />)}
          </FormItem>
        </Form>
      </div>
    );
  };

  renderContent() {
    const {
      form: { getFieldDecorator },
    } = this.props;
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
    const { processApprovalX } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { stepDirection, current, stepDetail } = this.state;
    const stepsData = processApprovalX.data ? processApprovalX.data : null;
    const stepsF =
      processApprovalX.detailData && processApprovalX.detailData.flowStepList.length > 0
        ? processApprovalX.detailData.flowStepList
        : null;
    const bigBoss = processApprovalX.detailData
      ? processApprovalX.detailData.createUserIdLastName
      : null;
    return (
      <>
        {this.renderTop()}
        <StandardCard.Meta title="流程步骤" />
        {this.renderSteps(stepsF)}
        <Divider />
        {this.renderForm()}
        <Divider />
        <Card.Meta title="审批过程" />

        {stepsData && stepsData.length > 0
          ? stepsData.map((item, i) => (
            <div style={{ marginTop: 20, display: 'inline-block' }}>
              <div className={styles.item2} id={item.id}>
                <span className={styles.faqiPerson}>发起人: {item.username}</span>
                <span className={styles.faqiTime}>{item.time}</span>
              </div>
              <div className={styles.stepLines}>
                <Icon
                  type={stepsData.length !== i + 1 ? 'double-right' : ''}
                  style={{ color: '#747A98', fontSize: 20 }}
                />
              </div>
            </div>
            ))
          : null}
        <Divider />
        <Card.Meta
          title={
            <span>
              总领导全程审批：<span style={{ color: '#3C5BCE' }}>{bigBoss}</span>
            </span>
          }
        />
        <Form layout="horizontal" labelAlign="left" style={{ marginTop: 35 }}>
          <Form.Item label="审批结果" {...formItemLayout}>
            {getFieldDecorator('approvalStatus', {
              initialValue: '1',
            })(
              <Radio.Group>
                <Radio value="1">同意</Radio>
                <Radio value="0">驳回</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="审批意见" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
            {getFieldDecorator('approvalOpinion', {
              rules: [{ validator: this.checkMention }],
            })(
              <Mentions rows="3">
                <Option value="afc163">afc163</Option>
                <Option value="zombieJ">zombieJ</Option>
                <Option value="yesmeck">yesmeck</Option>
              </Mentions>
            )}
          </Form.Item>
          <Form.Item style={{ float: 'right' }}>
            <Button type="primary" onClick={this.handleReset} className={styles.btn}>
              取消
            </Button>
            <Button type="primary" onClick={this.handleSubmit} className={styles.btn}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }

  render() {
    return (
      <StandardCard
        className={styles.card}
        showTitle
        full
        src="./assets/common/peizhi.png"
        title="运维 / 工单管理 / 查看详情"
      >
        {this.renderContent()}
      </StandardCard>
    );
  }
}

export default processApprovalX;
