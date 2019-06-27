import React, { PureComponent } from 'react';
import { Steps, Card } from 'antd';
import classnames from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import StandardCard from '@/components/StandardCard';
import Records from './Records';
import styles from './index.less';

const { Step } = Steps;

@connect(({ workOrderDetail }) => ({
  data: workOrderDetail.data,
  orderProcessRecord: workOrderDetail.orderProcessRecord,
}))
class WorkOrderProgress extends PureComponent {
  state = {
    curStepIndex: 0,
  };

  componentWillMount() {
    this.queryDetail();
    this.queryRecordList();
  }

  getAreaName() {
    const { data } = this.props;
    const { area } = data;
    if (area) {
      const getName = (pName, areaNode) => {
        const name = `${pName}/${areaNode.name}`;
        if (areaNode.children) {
          return getName(name, areaNode.children[0]);
        }
        return name;
      };
      return getName(area.name, area);
    }
    return '';
  }

  queryDetail = () => {
    const {
      dispatch,
      match: {
        params: { orderId },
      },
    } = this.props;
    dispatch({
      type: 'workOrderDetail/query',
      payload: orderId,
    });
  };

  queryRecordList = () => {
    const {
      dispatch,
      match: {
        params: { orderId },
      },
    } = this.props;
    dispatch({
      type: 'workOrderDetail/fetchOrderProcessRecord',
      payload: orderId,
    });
  };

  onStepClick = flow => {
    const { id, flowStatus } = flow;
    this.setState({ curStepIndex: flowStatus });
    if (flowStatus !== '2') {
      return;
    }
    switch (id) {
      case 1: // 普通设备维修 - 发出派工
        break;
      case 2: // 普通设备维修 - 派工准备
        this.updateStep(id);
        break;
      case 3: // 普通设备维修 - 派工实施
        this.record();
        break;
      case 4: // 普通设备维修 - 派工查验
        this.check();
        break;
      case 5: // 普通设备维修 - 派工完成
        break;
      case 6: // 强电设备维修 - 派工成功
        break;
      case 7: // 强电设备维修 - 派工准备
        this.updateStep(id);
        break;
      case 8: // 强电设备维修 - 操作票上传
        this.showOperationTicket();
        break;
      case 9: // 强电设备维修 - 工作票上传
        this.showWorkTicket();
        break;
      case 10: // 强电设备维修 - 派工准备完成
        this.updateStep(id);
        break;
      case 11: // 强电设备维修 - 派工实施
        this.record();
        break;
      case 12: // 强电设备维修 - 派工查验
        this.check();
        break;
      default:
        break;
    }
  };

  updateStep = stepId => {
    const {
      dispatch,
      match: {
        params: { orderId },
      },
    } = this.props;
    dispatch({
      type: 'workOrderDetail/updateStep',
      payload: { orderId, stepId },
      callback: () => {
        this.queryDetail();
        this.queryRecordList();
      },
    });
  };

  showOperationTicket = () => {
    router.push(`process/operationTicket`);
  };

  showWorkTicket = () => {
    router.push(`process/workTicket`);
  };

  record = () => {
    router.push(`process/record`);
  };

  check = () => {
    router.push(`process/check`);
  };

  renderSteps() {
    const { data } = this.props;
    const { flowDetail, numbers } = data;
    const flows = flowDetail ? JSON.parse(flowDetail) : [];
    const steps = flows.map(f => {
      return {
        id: f.id,
        title: f.name,
        desc: f.flowStatus === '1' ? moment(f.actionTime).format('YYYY-MM-DD HH:mm') : null,
        status: f.flowStatus,
        onClick: () => {
          this.onStepClick(f);
        },
      };
    });

    const dotNode = (_, { index }) => {
      const { curStepIndex } = this.state;
      // 当前选中的样式
      let cls = styles.dotTitle;
      if (index === curStepIndex) {
        cls = classnames(cls, styles.dotTitleActive);
      }
      // todo 根据业务换颜色!!!!!
      let clsSp = styles.sp_base;
      switch (steps[index].status) {
        case '0':
          clsSp = classnames(clsSp, styles.sp_blue);
          break;
        case '1':
          clsSp = classnames(clsSp, styles.sp_red);
          break;
        case '2':
          clsSp = classnames(clsSp, styles.sp_green);
          break;
        default:
          clsSp = classnames(clsSp, styles.sp_blue);
      }
      return (
        <div className={cls} onClick={steps[index].onClick}>
          <span className={clsSp}>{index + 1}</span>
        </div>
      );
    };

    const title = item => {
      return (
        <div key={item.id} className={styles.title}>
          <p>{item.title}</p>
          <p>{item.desc}</p>
        </div>
      );
    };

    return (
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <StandardCard.Meta title={`派工单号：${numbers}`} />
        <div className={styles.detail}>
          <div className={styles.steps}>
            <Steps progressDot={dotNode}>
              {steps &&
                steps.map(s => {
                  let status;
                  switch (s.status) {
                    case '0':
                      status = 'wait';
                      break;
                    case '1':
                      status = 'finish';
                      break;
                    case '2':
                      status = 'process';
                      break;
                    default:
                      status = 'wait';
                      break;
                  }
                  return <Step title={title(s)} status={status} />;
                })}
            </Steps>
          </div>
        </div>
      </Card>
    );
  }

  render() {
    const { data, orderProcessRecord } = this.props;
    return (
      <StandardCard src="./assets/menu/time-s.png" full>
        <div className={styles.top}>
          <span>
            <img src="./assets/icons/zone.png" alt="" />
            {this.getAreaName()}
          </span>
          <span>
            <img src="./assets/icons/category.png" alt="" />
            工单类型: {data.typeDesp}
          </span>
          <span>
            <img src="./assets/icons/record.png" alt="" />
            故障内容: {data.detail}
          </span>
        </div>
        {this.renderSteps()}
        <div>
          <Records dataSource={orderProcessRecord} />
        </div>
      </StandardCard>
    );
  }
}

export default WorkOrderProgress;
