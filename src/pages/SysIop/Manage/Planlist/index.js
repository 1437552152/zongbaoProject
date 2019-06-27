import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb } from 'antd';

import SimpleTable from '@/components/SimpleTable';
import StandradCard from '@/components/StandardCard';
import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';

import SiderTop from './SiderTop';
import styles from './index.less';

@connect(({ PlanList }) => ({
  PlanList,
}))
@Form.create()
class PlanList extends PureComponent {
  state = {
    page: 1,
    pageSize: 10
  };

  componentDidMount() {
    const { page, pageSize } = this.state;
    const { dispatch } = this.props;
    const values = { page, pageSize };
    dispatch({
      type: 'PlanList/getPlanList',
      payload: values,
      callback: data => {
        this.updatecallback(data);
      },
    });
  }

  onAreaTreeSelect = (selectedKeys, e) => {
    console.log(
      selectedKeys,
      e,
      e && e.selectedNodes && e.selectedNodes.length > 0 && e.selectedNodes[0].props.dataRef
    );
    // this.setState({ curTreeData: e.selectedNodes[0].props.dataRef });
  };

  onSiderTopSearch = values => {
    console.log('=====onSiderTopSearch=', values);
  };

  changePage = page1 => {
    this.setState(
      {
        page:page1
      },
      () => {
        const { page, pageSize } = this.state;
        const { dispatch } = this.props;
        const values = { page, pageSize };
        dispatch({
          type: 'PlanList/getPlanList',
          payload: values,
          callback: data => {
            this.updatecallback(data);
          },
        });
      }
    );
  };

  updatecallback = e => {
    console.log(e);
  };

  renderSider = () => {
    const areaTreeList = [
      {
        id: 1,
        name: '综合服务区',
        children: [
          {
            id: 2,
            name: 'A塔楼',
          },
          {
            id: 3,
            name: 'B塔楼',
          },
        ],
      },
      {
        id: 4,
        name: '保税物流用地',
        children: [
          {
            id: 5,
            name: '子节点',
          },
          {
            id: 6,
            name: '子节点2',
          },
        ],
      },
    ];

    return (
      <CommonSiderBar
        areaTreeList={areaTreeList}
        onAreaTreeSelect={this.onAreaTreeSelect}
        renderTop={<SiderTop onSearch={this.onSiderTopSearch} />} // 子组件向父组件传值，即将调用父组件的方法
      />
    );
  };

  renderContent = () => {
    const tcolumns = [
      {
        title: '计划类型',

        dataIndex: 'flowId	',
        key: 'flowId	',
      },
      {
        title: '工作项目',

        dataIndex: 'project',
        key: 'project',
      },
      {
        title: '计划开始时间',

        dataIndex: 'startTime',
        key: 'startTime',
      },
      {
        title: '计划结束时间',

        dataIndex: 'endTime',
        key: 'endTime',
      },
      {
        title: '创建时间',

        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '创建人',
        dataIndex: 'lastName',
        key: 'lastName',
      },
      {
        title: '责任人',

        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '责任部门',

        dataIndex: 'responsibilityDepartment',
        key: 'responsibilityDepartment',
      },
      {
        title: '计划级别',

        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '关联区域',

        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '下载附件',

        dataIndex: 'attachmentId',
        key: 'attachmentId',
      },
      {
        title: '状态',

        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '操作',

        dataIndex: 'createDate',
        key: 'createDate',
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows);
        // this.setState({
        //   selectDiveces: selectedRows,
        //   selectedRowKeys
        // })
      },
    };

    const { PlanList } = this.props;
    return (
      <StandradCard>
        <div className={styles.menu}>
          <div className={styles.menubrad}>
            <div>
              <Breadcrumb>
                <Breadcrumb.Item>武汉</Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a href="">东湖综合保税区</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a href="">综合服务区</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a href="">A塔楼</a>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div>
              <p>计划类型:点检计划</p>
              <p>计划部门:资产管理部</p>
              <p>按月统计:2019-05-03</p>
            </div>
          </div>
        </div>
        <SimpleTable
          rowSelection={rowSelection}
          columns={tcolumns}
          className={styles.alarmStateTable}
          dataSource={PlanList.data.data}
          pagination={{
            current: PlanList.data.page,
            total: PlanList.data.length,
            pageSize: PlanList.data.pageSize,
            onChange: this.changePage,
          }}
          onChange={this.handleTableChange}
        />
      </StandradCard>
    );
  };

  render() {
    return <SiderContent sider={this.renderSider()} content={this.renderContent()} />;
  }
}
export default PlanList;
