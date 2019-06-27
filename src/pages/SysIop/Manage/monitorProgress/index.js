import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import {
  Divider,
  Table,
  Form,
  Input,
  Select,
  Breadcrumb,
  Button,
  Row,
  Col,
  DatePicker,
  Tabs,
  Steps,
  Menu,
  Icon,
  PageHeader,
  Card,
} from 'antd';
import styles from './monitorProgress.less';

const { Step } = Steps;
const TabPane = Tabs.TabPane;

@Form.create()
class monitorProgress extends PureComponent {
  state = {
    current: 0,
  };

  componentDidMount() {
    //  initWeekData(1, 'oneWeekDate');
  }

  handleClick = e => {
    console.log('click ', e);
  };

  onChange = current => {
    console.log('onChange:', current);
    this.setState({ current });
    // alert('666666')
  };

  render() {
    const { current } = this.state;
    const routes = [
      {
        path: 'index',
        breadcrumbName: '武汉',
      },
      {
        path: 'first',
        breadcrumbName: '武汉东湖综合保税区',
      },
      {
        path: 'second',
        breadcrumbName: '综合服务区',
      },
      {
        path: 'fouth',
        breadcrumbName: 'A塔楼',
      },
    ];
    const person = [
      {
        title: '创建计划1',
        time: '2019-05-15 10:21',
        dataIndex: '1',
        key: 'index',
      },
      {
        title: '创建计划2',
        time: '2019-05-15 10:21',
        dataIndex: '2',
        key: 'indexT',
      },
      {
        title: '创建计划3',
        time: '2019-05-15 10:21',
        dataIndex: '3',
        key: 'indexR',
      },
      {
        title: '创建计划4',
        time: '2019-05-15 10:21',
        dataIndex: '4',
        key: 'indexF',
      },
      {
        title: '创建计划5',
        time: '2019-05-15 10:21',
        dataIndex: '5',
        key: 'indexW',
      },
    ];
    const columns = [
      {
        title: '处理时间',
        dataIndex: 'name',
        width: '47.7%',
      },
      {
        title: '处理内容',
        dataIndex: 'age',
        width: '47.7%',
      },
      {
        title: '操作人',
        dataIndex: 'address',
        width: '47.7%',
      },
    ];
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        name: `2019-05-15    10:34:12 ${i}`,
        age: '张三',
        address: ` ${i}`,
      });
    }
    return (
      <div className={styles.monitorPr}>
        <div className={styles.menu}>
          <Breadcrumb style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
            <Breadcrumb.Item>设备维护</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">维护计划</a>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <PageHeader
          title="电力设备月检表————变压器"
          breadcrumb={{ routes }}
          className={styles.main}
          extra={[
            <div>
              <p>计划类型: 点检计划</p>
              <p>点检计划: 资产管理部</p>
            </div>,
          ]}
          style={{ paddingLeft: 0, fontSize: 16, fontWeight: 'bold', color: 'black' }}
        />
        {/* 左侧导航 */}
        <div className={styles.stepBox}>
          {/* <Steps style={{ marginTop: 50, height: 150 }} onChange={this.onChange} current={current}>
            {person.map(item => (
              <Step key={item.key} title={item.title} styles={styles.stepItem} />
            ))}
          </Steps> */}
          <Card title="" style={{ marginBottom: 24, height: 200 }} bordered={false}>
            {person.map(item => (
              <div className={styles.item1} key={item.key}>
                <div
                  className={styles.stepLine}
                  style={{ display: item.dataIndex === '5' ? 'none' : 'block' }}
                  id={item.dataIndex === '5' ? 'lastline5' : ''}
                />
                <div className={styles.paixuindex}>
                  <span className={styles.span}>{item.dataIndex}</span>
                </div>
                <div className={styles.textBox}>
                  <p className={styles.faqiPerson}>发起人: {item.title}</p>
                  <p className={styles.faqiTime}>{item.time}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div className="card-container">
          <Tabs type="card">
            <TabPane tab="跟踪纪录" key="1">
              <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 50 }}
                scroll={{ y: 240 }}
              />
            </TabPane>
            <TabPane tab="人员定位" key="2">
              <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 50 }}
                scroll={{ y: 240 }}
              />
            </TabPane>
            <TabPane tab="修复计划" key="3">
              <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 50 }}
                scroll={{ y: 240 }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default monitorProgress;
