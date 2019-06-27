/*
 * @Desc: 楼宇配置
 * @Author: Jackie
 * @Date: 2019-05-13 16:41:39
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-06-05 13:41:10
 */
import React, { PureComponent } from 'react';
import DeviceIcon from '@/components/DeviceIcon/index2';
import { Layout, Typography, Button, Spin, Checkbox, Empty, message } from 'antd';
import { connect } from 'dva';
import FormInput from './FormInput';
import BisTree from './BisTree';
import SelectedPersonModal from './SelectedPersonModal';
import UnSelectedPersonModal from './UnSelectedPersonModal';
import SelectedComModal from './SelectedComModal';
import UnSelectedComModal from './UnSelectedComModal';
import styles from './index.less';
import StandardCard from '@/components/StandardCard';

const { Sider, Content } = Layout;
const { Paragraph } = Typography;

@connect(({ promises, loading }) => ({
  promises,
  loading: loading.models.promises,
}))
class Promises extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      selComVisible: false,
      unSelComVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/listAllAreas',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/clear',
    });
  }

  // 树选择
  onTreeSelect = (selectedKeys, e) => {
    // console.log('======', e);
    const { dispatch } = this.props;
    const showContent = e.selectedNodes && e.selectedNodes.length > 0;
    let showBtn = false;
    const curTreeItem = showContent ? e.selectedNodes[0].props.dataRef : {};
    if (e.selected && (curTreeItem.type === '003' || curTreeItem.type === '001')) {
      showBtn = true;
      this.loadDeviceList(dispatch, curTreeItem);
    }

    const payload = {
      curTreeItem,
      showContent,
      showBtn,
    };

    if (!showBtn) {
      payload.bg = '';
    }
    dispatch({
      type: 'promises/save',
      payload,
    });
  };

  // 获取楼层信息
  loadDeviceList = (dispatch, item) => {
    dispatch({
      type: 'promises/setBg',
      payload: item,
    });

    dispatch({
      type: 'promises/fetchDeviceList',
      payload: item.id,
    });
  };

  // 修改标题
  onHeaderContentChange = headerContent => {
    const {
      dispatch,
      promises: { curTreeItem },
    } = this.props;
    dispatch({
      type: 'promises/update',
      payload: { id: curTreeItem.id, name: headerContent, remark: headerContent },
    });
  };

  // 注意事项模板点击
  onAttaClick = () => {
    this.showInputModalVisible(1);
  };

  // 处理方案模板点击
  onDealClick = () => {
    this.showInputModalVisible(2);
  };

  // 人员管理点击
  onPersonClick = () => {
    this.reqSelPersonList();
    this.changeSelectedPersonModalVisible();
  };

  // 公司配置点击
  onCompClick = () => {
    this.reqSelComList();
    this.changeSelectedComModalVisible();
  };

  // 修改模板数据
  handleInputModalCommit = (id, inputType, content) => {
    const { dispatch } = this.props;
    // 提交数据
    const payload = inputType === 1 ? { attentionTemplate: content } : { methodTemplate: content };
    dispatch({
      type: 'promises/update',
      payload: { id, ...payload },
    });
    this.hideInputModalVisible();
  };

  // 显示模板弹窗
  showInputModalVisible = inputType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/showInputModal',
      payload: inputType,
    });
  };

  // 隐藏模板弹窗
  hideInputModalVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/hideInputModal',
    });
  };
  // ======================人员配置相关=======================

  // 请求已配置人员列表
  reqSelPersonList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/listBindPerson',
      payload: params,
    });
  };

  // 请求已配置公司列表
  reqSelComList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/listBindCom',
      payload: params,
    });
  };

  // 显示or隐藏已配置人员窗口
  changeSelectedPersonModalVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/changeSelectedPersonModalVisible',
    });
  };

  // 显示或隐藏已配置公司窗口
  changeSelectedComModalVisible = () => {
    const { selComVisible } = this.state;
    this.setState({
      selComVisible: !selComVisible,
    });
  };

  // 新增人员
  onSelPersonSelectAddClick = () => {
    this.reqUnSelPersonList();
    this.changeUnSelectedPersonModalVisible();
  };

  // 新增公司
  onSelComSelectAddClick = () => {
    this.reqUnSelComList();
    this.changeUnSelectedComModalVisible();
  };

  // 删除已绑定人员
  onSelPersonSelectDelClick = ids => {
    const {
      dispatch,
      promises: { curTreeItem },
    } = this.props;
    dispatch({
      type: 'promises/delBindPerson',
      payload: {
        id: curTreeItem.id,
        ids,
      },
      callback: () => this.reqSelPersonList(),
    });
  };

  // 删除已绑定公司
  onSelComSelectDelClick = ids => {
    const {
      dispatch,
      promises: { curTreeItem },
    } = this.props;
    dispatch({
      type: 'promises/delBindCom',
      payload: {
        id: curTreeItem.id,
        ids,
      },
      callback: () => this.reqSelComList(),
    });
  };

  // ====middle======可选人员相关======================

  // 搜索
  reqUnSelPersonListBySearch = values => {
    this.reqUnSelPersonList({ ...values });
  };

  //  公司搜索
  reqUnSelComListBySearch = values => {
    this.reqUnSelComList({ ...values });
  };

  // 请求未配置人员列表
  reqUnSelPersonList = params => {
    // console.log('=====reqUnSelPersonList', params);
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/listUnBindPerson',
      payload: params,
    });
  };

  // 请求未配置公司列表
  reqUnSelComList = params => {
    // console.log('=====reqUnSelPersonList', params);
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/listUnBindCom',
      payload: params,
    });
  };

  // 显示or隐藏可选人员窗
  changeUnSelectedPersonModalVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/changeUnSelectedPersonModalVisible',
    });
  };

  // 显示or隐藏可选公司窗
  changeUnSelectedComModalVisible = () => {
    const { unSelComVisible } = this.state;
    this.setState({
      unSelComVisible: !unSelComVisible,
    });
  };

  // 人员配置选中的行
  onUnSelPersionSelectRow = selectedRows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/save',
      payload: {
        unSelPersionSelectedRows: selectedRows,
      },
    });
  };

  // 添加未绑定人员
  onUnSelPersonSelectAddClick = ids => {
    const {
      dispatch,
      promises: { curTreeItem },
    } = this.props;
    dispatch({
      type: 'promises/bindPerson',
      payload: {
        id: curTreeItem.id,
        ids,
      },
      callback: () => {
        this.reqSelPersonList();
        this.changeUnSelectedPersonModalVisible();
      },
    });
  };

  // 添加未绑定公司
  onUnSelComSelectAddClick = ids => {
    const {
      dispatch,
      promises: { curTreeItem },
    } = this.props;
    dispatch({
      type: 'promises/bindCom',
      payload: {
        id: curTreeItem.id,
        ids,
      },
      callback: () => {
        this.reqSelComList();
        this.changeUnSelectedComModalVisible();
      },
    });
  };

  // ======================人员配置相关=========end==============

  updateDevice = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'promises/updateDevice',
      payload: params,
    });
  };

  renderContent = (showBtn, curTreeItem, deviceList, bg) => {
    const { dispatch } = this.props;
    const { checked } = this.state;
    return (
      <Layout style={{ marginLeft: 1 }}>
        <div className={styles.title_container}>
          {/* <Title level={4}>{curTreeItem.name}</Title> */}
          <Paragraph editable={{ onChange: this.onHeaderContentChange }}>
            {curTreeItem.name}
          </Paragraph>
          {showBtn && (
            <div>
              <Checkbox
                checked={checked}
                onChange={e => this.setState({ checked: e.target.checked })}
              >
                编辑设备
              </Checkbox>
              <Button onClick={this.onAttaClick}>注意事项模板</Button>
              <Button onClick={this.onDealClick}>处理方案模板</Button>
              <Button onClick={this.onPersonClick}>人员管理</Button>
              <Button onClick={this.onCompClick}>公司配置</Button>
            </div>
          )}
        </div>
        {bg ? (
          <Content style={{ margin: 0 }}>
            <div style={{ position: 'relative' }}>
              {bg && (
                <img
                  src={bg}
                  alt="alt"
                  width="100%"
                  onError={() => {
                    message.info('该区域无图层');
                    dispatch({ type: 'promises/save', payload: { bg: null } });
                  }}
                />
              )}

              {deviceList.map(item => (
                <DeviceIcon
                  key={item.id}
                  item={item}
                  onMouseUp={
                    checked
                      ? it => this.updateDevice({ id: it.id, xAxis: it.xAxis, yAxis: it.yAxis })
                      : undefined
                  }
                />
              ))}
            </div>
          </Content>
        ) : (
          <Empty style={{ paddingTop: 100 }} description="暂无信息" />
        )}
      </Layout>
    );
  };

  renderCardTitle = () => {
    return (
      <div className={styles.title}>
        <img src="./assets/common/peizhi.png" alt="" />
        <span>楼宇配置</span>
      </div>
    );
  };

  render() {
    const {
      promises: {
        deviceList,
        bg,
        inputModalVisible,
        inputType,
        treeList,
        curTreeItem,
        showContent,
        showBtn,
        selPersonModalVisible,
        unSelPersonModalVisible,
        bindPersonData,
        unBindPersonData,
        bindComData,
        unBindComData,
      },
      loading,
    } = this.props;

    const { selComVisible, unSelComVisible } = this.state;

    const formInputProps = {
      handleCommit: this.handleInputModalCommit,
      id: curTreeItem.id,
      content: inputType === 1 ? curTreeItem.attentionTemplate : curTreeItem.methodTemplate,
      title: inputType === 1 ? '注意事项' : '处理方案',
      visible: inputModalVisible,
      inputType,
      handleCancel: this.hideInputModalVisible,
    };

    const selectedPersonProps = {
      onAddClick: () => this.onSelPersonSelectAddClick(),
      onDelClick: ids => this.onSelPersonSelectDelClick(ids),
      onCancelClick: () => this.changeSelectedPersonModalVisible(),
      visible: selPersonModalVisible,
      data: bindPersonData,
      onTableChange: this.reqSelPersonList,
    };

    const unSelectedPersonProps = {
      onAddClick: ids => this.onUnSelPersonSelectAddClick(ids),
      onCancelClick: () => this.changeUnSelectedPersonModalVisible(),
      visible: unSelPersonModalVisible,
      data: unBindPersonData,
      onTableChange: this.reqUnSelPersonList,
      onTableSearch: this.reqUnSelPersonListBySearch,
    };

    const selectedComProps = {
      onAddClick: () => this.onSelComSelectAddClick(),
      onDelClick: ids => this.onSelComSelectDelClick(ids),
      onCancelClick: () => this.changeSelectedComModalVisible(),
      visible: selComVisible,
      data: bindComData,
      onTableChange: this.reqSelPersonList,
    };

    const unselectedComProps = {
      onAddClick: ids => this.onUnSelComSelectAddClick(ids),
      onCancelClick: () => this.changeUnSelectedComModalVisible(),
      visible: unSelComVisible,
      data: unBindComData,
      onTableChange: this.reqUnSelComList,
      onTableSearch: this.reqUnSelComListBySearch,
    };
    return (
      <Spin spinning={loading}>
        <StandardCard src="./assets/common/peizhi.png" className={styles.pageHeaderWrapper}>
          <Layout className={styles.bottom_container}>
            <Sider theme="light">
              {treeList && treeList.length > 0 && (
                <div className={styles.bottom_scroll}>
                  <BisTree onTreeSelect={this.onTreeSelect} treeList={treeList} />
                </div>
              )}
            </Sider>
            {showContent && this.renderContent(showBtn, curTreeItem, deviceList, bg)}
          </Layout>
          <FormInput {...formInputProps} />
          <SelectedComModal {...selectedComProps} />
          <UnSelectedComModal {...unselectedComProps} />
          <SelectedPersonModal {...selectedPersonProps} />
          <UnSelectedPersonModal {...unSelectedPersonProps} />
        </StandardCard>
      </Spin>
    );
  }
}
export default Promises;
