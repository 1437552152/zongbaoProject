import React, { PureComponent } from 'react';
import { Card, Button, Checkbox } from 'antd';
import { connect } from 'dva';
import SimpleTable from '@/components/SimpleTable';
import StandardCard from '@/components/StandardCard';
import styles from './index.less';

@connect(({ jfjh }) => ({ before: jfjh.before, after: jfjh.after }))
class Jfjh extends PureComponent {
  render() {
    const { before, after } = this.props;

    const configColumns = [
      {
        title: '时段',
        dataIndex: 'period',
      },
      {
        title: '调整前能耗kWh',
        dataIndex: 'consumeBeforeAdjustment',
      },
      {
        title: '时否调整',
        dataIndex: 'adjustOrNot',
        render: checked => {
          return <Checkbox checked={checked} />;
        },
      },
      {
        title: '消值kWh',
        dataIndex: 'consumeValue',
        render: (text, r) => (r.adjustOrNot ? `[${text}]` : '-'),
      },
      {
        title: '调整至时段',
        dataIndex: 'periodAfterAdjustment',
        render: (text, r) => (r.adjustOrNot ? `[${text}]` : '-'),
      },
    ];

    const resultColumns = [
      {
        title: '时段',
        dataIndex: 'period',
      },
      {
        title: '单价',
        dataIndex: 'price',
      },
      {
        title: '调整前能耗kWh',
        dataIndex: 'consumeBeforeAdjustment',
      },
      {
        title: '调整前成本（元）',
        dataIndex: 'costBeforAdjustment',
      },
      {
        title: '调整后能耗kWh',
        dataIndex: 'consumeAfterAdjustment',
      },
      {
        title: '调整后成本（元）',
        dataIndex: 'costAfterAdjustment',
      },
    ];

    const footer = () => (
      <div className={styles.footer}>
        <span>节约成本</span>
        <span>
          调整前成本到调整后成本 <span>结余35元</span>
        </span>
      </div>
    );

    return (
      <StandardCard src="./assets/menu/fenxi-s.png">
        <div className={styles.header}>
          <Card.Meta
            avatar={<img src="./assets/icons/zone.png" alt="" />}
            title="1AA2_2电梯（主供）"
            description="武汉 > 东湖综合保税区 > 综合服务区"
          />
          <Card.Meta
            avatar={<img src="./assets/icons/price.png" alt="" />}
            title="单价"
            description={<span>尖：3.2元 峰：2.5元 平：1.8元 谷： 1元 </span>}
          />
          <Card.Meta
            avatar={<img src="./assets/icons/time.png" alt="" />}
            title="时间"
            description="2019-06-01 ~ 2019-06-30"
          />
        </div>

        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <StandardCard.Meta title="配置" />
          <SimpleTable dataSource={before} columns={configColumns} pagination={false} />
        </Card>
        <div className={styles.buttonWrapper}>
          <Button>模拟计算</Button>
        </div>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <StandardCard.Meta title="模拟结果" />
          <SimpleTable
            className={styles.table}
            pagination={false}
            dataSource={after}
            columns={resultColumns}
            footer={footer}
          />
        </Card>
      </StandardCard>
    );
  }
}

export default Jfjh;
