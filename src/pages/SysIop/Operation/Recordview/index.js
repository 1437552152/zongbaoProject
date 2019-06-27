import React from 'react';
import { connect } from 'dva';
import { Table, Form, Breadcrumb, Row, Col, DatePicker, Card, Badge, Tabs } from 'antd';
import styles from './index.less';
import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';

const { TabPane } = Tabs;
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const operationTabList = [
  {
    key: 'tab1',
    tab: '1#变压器',
  },
  {
    key: 'tab2',
    tab: '2#变压器',
  },
  {
    key: 'tab3',
    tab: '3#变压器',
  },
  {
    key: 'tab4',
    tab: '4#变压器',
  },
];

const columns = [
  {
    title: '设备名称',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '检查项目',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '检查情况',
    dataIndex: 'status',
    key: 'status',
    render: text =>
      text === 'agree' ? (
        <Badge status="success" text="成功" />
      ) : (
        <Badge status="error" text="驳回" />
      ),
  },
  {
    title: '设备隐患',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '预防措施',
    dataIndex: 'memo',
    key: 'memo',
  },
  {
    title: '纳期',
    dataIndex: 'memo',
    key: 'memo',
  },
  {
    title: '检查者',
    dataIndex: 'memo',
    key: 'memo',
  },
];
@Form.create()
@connect(({ Recordview, loading }) => ({
  Recordview,
  loading: loading.effects['Recordview/fetchAdvanced'],
}))
class Recordview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operationkey: 'tab1',
      // eslint-disable-next-line react/no-unused-state
      stepDirection: 'horizontal',
      currentArea: '-1', // currentArea值为-1时,表示无区域的筛选,查询的是所有报警记录
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Recordview/fetchAdvanced',
    });

    // this.setStepDirection();
    // window.addEventListener('resize', this.setStepDirection, { passive: true });
    // 树
    this.fetchAreaTree();
    const { currentArea } = this.state;
    this.fetchWarningCount(currentArea);
  }

  fetchAreaTree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Recordview/fetchAreaTree',
      payload: { type: '2', id: '1' },
    });
  };

  fetchWarningCount = areaId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Recordview/fetchWarnings',
      payload: areaId,
    });
  };

  onAreaTreeSelect = selectedKeys => {
    const key = selectedKeys[0];
    this.setState({
      currentArea: key,
    });
    this.fetchWarningCount(key);
  };
  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.setStepDirection);
  //   this.setStepDirection.cancel();
  // }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  // setStepDirection() {
  //   const { stepDirection } = this.state;
  //   const w = getWindowWidth();
  //   if (stepDirection !== 'vertical' && w <= 576) {
  //     this.setState({
  //       stepDirection: 'vertical',
  //     });
  //   } else if (stepDirection !== 'horizontal' && w > 576) {
  //     this.setState({
  //       stepDirection: 'horizontal',
  //     });
  //   }
  // }

  rowSelect = item => {};

  handleTableChange = (pagination, filtersArg, sorter) => {};

  onChangeDate = (date, dateString) => {
    console.log(date, dateString);
  };

  renderContent() {
    // eslint-disable-next-line no-shadow
    const { Recordview, loading, form } = this.props;
    const { operationkey, currentArea } = this.state;
    const { getFieldDecorator } = form;
    const {
      advancedOperation1,
      advancedOperation2,
      advancedOperation3,
      advancedOperation4,
    } = Recordview;
    const contentList = {
      tab1: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation1}
          columns={columns}
        />
      ),
      tab2: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation2}
          columns={columns}
        />
      ),
      tab3: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation3}
          columns={columns}
        />
      ),
      tab4: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation4}
          columns={columns}
        />
      ),
    };
    function onChangeDate(value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    }

    function onOk(value) {
      console.log('onOk: ', value);
    }
    return (
      <div className={styles.Recordview} style={{ marginTop: 0, marginLeft: 40 }}>
        <div className={styles.headContainer}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="">设备维修</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>纪录填写</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Tabs onChange={this.onOperationTabChange} type="card">
          {operationTabList.map(item => (
            <TabPane key={item.key} tab={item.tab} styles={styles.stepItem}>
              <div className={styles.status}>
                <Form>
                  <Row>
                    <Col span={8}>
                      <Form.Item label="日期时间:">
                        {getFieldDecorator('status')(
                          <DatePicker
                            showTime
                            placeholder="03 / 10 / 2014"
                            onChange={onChangeDate}
                            onOk={onOk}
                            style={{ paddingLeft: 10 }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
              {contentList[operationkey]}
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }

  renderSider = () => {
    const {
      Recordview: { areaTree },
    } = this.props;
    const areaTreeList = areaTree;
    return <CommonSiderBar areaTreeList={areaTreeList} onAreaTreeSelect={this.onAreaTreeSelect} />;
  };

  render() {
    return <SiderContent sider={this.renderSider()} content={this.renderContent()} />;
  }
}

export default Recordview;
