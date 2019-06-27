import React, { PureComponent } from 'react';
import { Form, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';
import StandardCard from '@/components/StandardCard';
import SimpleTable from '@/components/SimpleTable';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const PageSize = '10';

@connect(({ workOrder, loading }) => ({
  workOrder,
  loading: loading.models.workOrder,
}))
class WorkOrderManage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentArea: '-1',
      currentTreePath: '0', // 树的节点路径
      type: null,
      state: null,
      beginDate: null,
      endDate: null,
    };
  }

  componentDidMount() {
    this.fetchOrderTypes();
    this.fetchOrderStates();
    this.fetchOrderAreaTree();
    this.fetchOrderList('-1', null, null, null, null, '1');
  }

  fetchOrderTypes = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/fetchOrderTypes',
    });
  };

  fetchOrderStates = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/fetchOrderStates',
    });
  };

  fetchOrderAreaTree = (type, state, beginDate, endDate) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/fetchOrderAreaTree',
      payload: {
        type: type || '',
        state: state || '',
        beginDate: beginDate || '',
        endDate: endDate || '',
      },
    });
  };

  fetchOrderList = (areaId, type, state, beginDate, endDate, page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/fetchOrderList',
      payload: {
        areaId,
        type: type || '',
        state: state || '',
        beginDate: beginDate || '',
        endDate: endDate || '',
        page,
        pageSize: PageSize,
      },
    });
  };

  showOrderDetail = order => {
    router.push(`operation/${order.id}/process`);
  };

  typeDescription = code => {
    if (!code) {
      return null;
    }
    const {
      workOrder: { orderTypes },
    } = this.props;
    const count = orderTypes.length;
    for (let i = 0; i < count; i += 1) {
      const type = orderTypes[i];
      if (type.code === code) {
        return type.desp;
      }
    }
    return null;
  };

  stateDescription = code => {
    if (!code) {
      return null;
    }
    const {
      workOrder: { orderStates },
    } = this.props;
    const count = orderStates.length;
    for (let i = 0; i < count; i += 1) {
      const state = orderStates[i];
      if (state.code === code) {
        return state.desp;
      }
    }
    return null;
  };

  treePath = () => {
    const {
      workOrder: { orderAreaTree },
    } = this.props;
    const { currentTreePath } = this.state;
    let location = '武汉';
    const paths = currentTreePath.split('-');
    let areas = orderAreaTree;
    for (let i = 1; i < paths.length; i += 1) {
      const index = parseInt(paths[i], 10);
      const area = areas[index];
      location += ` > ${area.name}`;
      areas = area.children;
    }
    return location;
  };

  onTypeChange = type => {
    const { currentArea, state, beginDate, endDate } = this.state;
    this.fetchOrderList(currentArea, type, state, beginDate, endDate, '1');
    this.fetchOrderAreaTree(type, state, beginDate, endDate);
    this.setState({
      type,
    });
  };

  onStateChange = state => {
    const { currentArea, type, beginDate, endDate } = this.state;
    this.fetchOrderList(currentArea, type, state, beginDate, endDate, '1');
    this.fetchOrderAreaTree(type, state, beginDate, endDate);
    this.setState({
      state,
    });
  };

  onBeginDateChange = (_date, dateString) => {
    const { currentArea, type, state, endDate } = this.state;
    this.fetchOrderList(currentArea, type, state, dateString, endDate, '1');
    this.fetchOrderAreaTree(type, state, dateString, endDate);
    this.setState({
      beginDate: dateString,
    });
  };

  onEndDateChange = (_date, dateString) => {
    const { currentArea, type, state, beginDate } = this.state;
    this.fetchOrderList(currentArea, type, state, beginDate, dateString, '1');
    this.fetchOrderAreaTree(type, state, beginDate, dateString);
    this.setState({
      endDate: dateString,
    });
  };

  onPageChange = page => {
    const { currentArea, type, state, beginDate, endDate } = this.state;
    this.fetchOrderList(currentArea, type, state, beginDate, endDate, page);
  };

  onAreaTreeSelect = (_selectedKeys, e) => {
    const node = e.selectedNodes[0];
    const area = node.props.dataRef;
    const { type, state, beginDate, endDate } = this.state;
    this.fetchOrderList(area.id, type, state, beginDate, endDate, '1');
    this.setState({
      currentArea: area.id,
      currentTreePath: node.props.pos,
    });
  };

  renderContent = () => {
    const columns = [
      {
        title: '派工单号',
        dataIndex: 'numbers',
        key: 'numbers',
        align: 'center',
      },
      {
        title: '单据状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (_text, record) => {
          return record.statusDesp;
        },
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (_text, record) => {
          return record.typeDesp;
        },
      },
      {
        title: '分配人',
        dataIndex: 'assigner',
        key: 'assigner',
        align: 'center',
      },
      {
        title: '故障内容',
        dataIndex: 'detail',
        key: 'detail',
        align: 'center',
      },
      {
        title: '故障时间',
        dataIndex: 'malfunctionTime',
        key: 'malfunctionTime',
        align: 'center',
      },
      {
        title: '处理人',
        dataIndex: 'handler',
        key: 'handler',
        align: 'center',
      },
      {
        title: '派工时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        align: 'center',
      },
      {
        title: '操作票',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: (_text, record) => {
          return (
            <a
              onClick={() => {
                this.showOrderDetail(record);
              }}
            >
              查看详情
            </a>
          );
        },
      },
    ];
    const { state, type, beginDate, endDate } = this.state;
    const {
      workOrder: { orderList, orderListLength },
    } = this.props;
    const location = this.treePath();
    return (
      <StandardCard src="./assets/menu/time-s.png">
        <div className={styles.top}>
          <span>
            <img src="./assets/icons/zone.png" alt="" />
            {location}
          </span>
          <span>
            <img src="./assets/icons/record.png" alt="" />
            单据状态: {this.stateDescription(state)}
          </span>
          <span>
            <img src="./assets/icons/category.png" alt="" />
            类型: {this.typeDescription(type)}
          </span>
          <span>
            <img src="./assets/icons/time.png" alt="" />
            派工时间: {beginDate} ~ {endDate}
          </span>
        </div>
        <div>
          <SimpleTable
            columns={columns}
            dataSource={orderList}
            pagination={{
              position: 'bottom',
              showQuickJumper: true,
              total: orderListLength,
              pageSize: PageSize,
              onChange: this.onPageChange,
            }}
          />
        </div>
      </StandardCard>
    );
  };

  renderFilter = () => {
    const {
      workOrder: { orderTypes, orderStates },
    } = this.props;
    return (
      <div style={{ paddingLeft: 16, paddingTop: 16 }}>
        <Form labelAlign="left" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <FormItem label="类型">
            <Select
              style={{ width: '100%' }}
              placeholder="请选择类型"
              allowClear
              onChange={this.onTypeChange}
            >
              {orderTypes.map(value => {
                return <Option key={value.code}>{value.desp}</Option>;
              })}
            </Select>
          </FormItem>
          <FormItem label="单据状态">
            <Select
              style={{ width: '100%' }}
              placeholder="请选择单据状态"
              allowClear
              onChange={this.onStateChange}
            >
              {orderStates.map(value => {
                return <Option key={value.code}>{value.desp}</Option>;
              })}
            </Select>
          </FormItem>
          <FormItem label="开始时间">
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              allowClear
              onChange={this.onBeginDateChange}
            />
          </FormItem>
          <FormItem label="结束时间">
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              allowClear
              onChange={this.onEndDateChange}
            />
          </FormItem>
        </Form>
      </div>
    );
  };

  renderSider = () => {
    const {
      workOrder: { orderAreaTree },
    } = this.props;
    const areaTreeList = orderAreaTree;
    return (
      <CommonSiderBar
        areaTreeList={areaTreeList}
        renderTop={this.renderFilter()}
        onAreaTreeSelect={this.onAreaTreeSelect}
      />
    );
  };

  render() {
    return <SiderContent sider={this.renderSider()} content={this.renderContent()} width={350} />;
  }
}

export default WorkOrderManage;
