import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Form } from 'antd';
import CommonSiderBar from '@/components/CommonSiderBar';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import styles from './processApprovalS.less';
import StandardCard from '@/components/StandardCard';
import SimpleTable from '@/components/SimpleTable';

const isApproval = true;
@connect(({ processAS, loading }) => ({
  processAS,
  loading: loading.models.processAS,
}))
@Form.create()
class processApprovalS extends PureComponent {
  state = {
    total: '',
    current: 1,
    pageSize: 10,
    currentArea: '-1',
    treeArr: [],
    flowId: 1,
  };

  componentDidMount() {
    const { currentArea } = this.state;
    this.fetchAllProcess(currentArea);
    this.addprocess();
  }

  // 点击树节点拿到树ID 再根据树ID去请求审批列表
  onAreaTreeSelect = (selectedKeys, e) => {
    console.log(selectedKeys, e);
    const { dispatch } = this.props;
    dispatch({
      type: 'processAS/fetchAllProcess',
      payload: e.selectedNodes[0].props.dataRef.id,
    });
  };

  addprocess = () => {
    const values = {};
    const { dispatch } = this.props;
    dispatch({
      type: 'processAS/getnewProcess',
      payload: values,
      callback: res => {
        this.addcallback(res);
      },
    });
  };

  addcallback = res => {
    this.setState({ treeArr: res.data });
  };

  renderSider = () => {
    const { treeArr } = this.state;
    const areaTreeList = treeArr;
    if (areaTreeList && areaTreeList.length > 0) {
      return (
        <div style={{ width: 278, display: 'inline-block' ,padding:'0 20px;'}}>
          <CommonSiderBar
            areaTreeList={areaTreeList}
            onAreaTreeSelect={this.onAreaTreeSelect}
            isApproval={isApproval}
          />
        </div>
      );
    }
    return true;
  };

  fetchAllProcess = areaId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'processAS/fetchAllProcess',
      payload: areaId,
    });
  };

  renderContent = () => {
    const {
      processAS: { deviceList },
      loading,
    } = this.props;
    const { total, current, pageSize } = this.state;
    const tcolumns = [
      { title: '分类', dataIndex: 'flowName', key: 'flowName' },
      { title: '审批内容', dataIndex: 'stepName', key: 'stepName' },
      { title: '发起人', dataIndex: 'createUserName', key: 'createUserName', align: 'center' },
      { title: '待审批人', dataIndex: 'auditName', key: 'auditName', align: 'center' },
      {
        title: '操作',
        dataIndex: 'revision',
        key: 'revision',
        render: (text, record) => {
          if (record.stepName  !== '全部流程') {
            return (
              <Link to={`/iop/manage/processApprovalZ/${record.id}`}>审批</Link>
            );
          }
          return <Link to={`/iop/manage/processApprovalX/${record.id}`}>审批</Link>;
        },
      },
    ];
    return (
      <div className={styles.tableContainer}>
        <SimpleTable
          loading={loading}
          columns={tcolumns}
          dataSource={deviceList}
          pagination={{
            pageSize,
            current,
            total,
            onChange: (page, size) => {
              this.setState({
                current: page,
                pageSize: size,
              });
            },
            onShowSizeChange: (page, size) => {
              this.setState({
                current: page,
                pageSize: size,
              });
            },
          }}
          style={{ marginLeft: 30 }}
        />
      </div>
    );
  };

  render() {
    return (
      <StandardCard src="./assets/common/peizhi.png" full>
        <div className={styles.container}>
          {this.renderSider()}
          {this.renderContent()}
        </div>
      </StandardCard>
    );
  }
}

export default processApprovalS;
