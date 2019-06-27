import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message, Modal } from 'antd';
import SettingContainer from '@/components/Setting/SettingContainer';
import ModalForm from '@/components/Setting/ModalForm';
import SimpleTable from '@/components/SimpleTable';
import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';

const ModalStatus = {
  hidden: 0,
  add: 1,
  update: 2,
  delete: 3,
};

const rootId = '1083';

@connect(({ MaintEqui, loading }) => ({
  MaintEqui,
  loading: loading.models.MaintEqui,
}))
class MaintenanceEquipment extends PureComponent {
  state = {
    modalStatus: ModalStatus.hidden,
    currentDeviceType: rootId,
    selectedSubType: null,
    modalTitle: '',
  };

  componentDidMount() {
    this.fetchDeviceTypes();
    this.fetchAllDeviceSubTypes();
  }

  fetchDeviceTypes = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaintEqui/fetchDeviceTypes',
    });
  };

  fetchAllDeviceSubTypes = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'MaintEqui/fetchAllDeviceSubTypes',
    // });
  };

  fetchDeviceSubTypes = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaintEqui/fetchDeviceSubTypesById',
      payload: id,
    });
  };

  addDeviceSubType = type => {
    const { dispatch } = this.props;
    const { currentDeviceType } = this.state;
    dispatch({
      type: 'MaintEqui/addDeviceSubType',
      payload: {
        ...type,
        groupCode: 'DEVICETYPE',
        parentId: currentDeviceType,
      },
      callback: this.updateCallback,
    });
  };

  updateDeviceSubType = type => {
    const { dispatch } = this.props;
    const { selectedSubType } = this.state;
    dispatch({
      type: 'MaintEqui/updateDeviceSubType',
      payload: {
        ...type,
        id: selectedSubType.id,
      },
      callback: this.updateCallback,
    });
  };

  deleteDeviceSubType = () => {
    const { dispatch } = this.props;
    const { selectedSubType } = this.state;
    dispatch({
      type: 'MaintEqui/deleteDeviceSubType',
      payload: selectedSubType.id,
      callback: this.updateCallback,
    });
  };

  updateCallback = () => {
    const { currentDeviceType } = this.state;
    this.setState({
      modalStatus: ModalStatus.hidden,
      selectedSubType: null,
    });
    if (currentDeviceType === rootId) {
      this.fetchAllDeviceSubTypes();
    } else {
      this.fetchDeviceSubTypes(currentDeviceType);
    }
  };

  onDeviceTypeSelect = selectedKeys => {
    const { currentDeviceType } = this.state;
    const selectedKey = selectedKeys[0];
    if (currentDeviceType === selectedKey) {
      return;
    }
    this.setState({
      currentDeviceType: selectedKey,
      selectedSubType: null,
    });
    if (selectedKey === rootId) {
      this.fetchAllDeviceSubTypes();
    } else {
      this.fetchDeviceSubTypes(selectedKey);
    }
  };

  onComfirm = (values, state) => {
    if (state === ModalStatus.add) {
      this.addDeviceSubType(values);
    } else if (state === ModalStatus.update) {
      this.updateDeviceSubType(values);
    }
  };

  onCancel = () => {
    this.setState({
      modalStatus: ModalStatus.hidden,
    });
  };

  addDeviceSubTypeClick = () => {
    const { currentDeviceType } = this.state;
    if (currentDeviceType === rootId) {
      message.error('请先从左侧列表中选择一种类型');
      return;
    }
    this.setState({
      modalTitle: '新增类型',
      modalStatus: ModalStatus.add,
    });
  };

  updateDeviceSubTypeClick = () => {
    const { selectedSubType } = this.state;
    if (!selectedSubType) {
      message.error('请从下方列表中选择要修改的类型');
      return;
    }
    this.setState({
      modalTitle: '修改类型',
      modalStatus: ModalStatus.update,
    });
  };

  deleteDiviceSubTypeClick = () => {
    const { selectedSubType } = this.state;
    if (!selectedSubType) {
      message.error('请从下方列表中选择要删除的类型');
      return;
    }
    this.setState({
      modalStatus: ModalStatus.delete,
    });
  };

  renderContent = () => {
    const {
      MaintEqui: { deviceSubTypes },
    } = this.props;
    const { modalTitle, modalStatus, selectedSubType } = this.state;

    const buttons = [
      {
        title: '新增类型',
        onClick: this.addDeviceSubTypeClick,
        src: './assets/MaintenanceEquipment/tianjia.png',
        alt: '',
      },
      {
        title: '修改类型',
        onClick: this.updateDeviceSubTypeClick,
        src: './assets/MaintenanceEquipment/xiugai.png',
        alt: '',
      },
      {
        title: '删除类型',
        onClick: this.deleteDiviceSubTypeClick,
        src: './assets/MaintenanceEquipment/shanchu.png',
        alt: '',
      },
    ];

    function sortcolums(a, b) {
      return a ? a.localeCompare(b) : ''.localeCompare(b);
    }

    const tcolumns = [
      {
        title: '类型编号',
        sorter: (a, b) => sortcolums(a.code, b.code),
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '类型名称',
        sorter: (a, b) => sortcolums(a.desp, b.desp),
        dataIndex: 'desp',
        key: 'desp',
      },
      {
        title: '设备统计',
        sorter: (a, b) => sortcolums(a.deviceCount, b.deviceCount),
        dataIndex: 'deviceCount',
        key: 'deviceCount',
      },
      {
        title: '是否启用',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (text, record) => {
          return record.type === '0' ? '不启用' : '启用';
        },
      },
    ];

    const rowSelection = {
      type: 'radio',
      selectedRowKeys: selectedSubType ? [selectedSubType.id] : null,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedSubType: selectedRows[0],
        });
      },
    };

    const modalConfig = {
      title: modalTitle,
      state: modalStatus,
      onOk: this.onComfirm,
      onCancel: this.onCancel,
      datas: [
        {
          type: 'input',
          field: 'code',
          label: '类型编号',
          message: '请填写类型编号',
          value: selectedSubType ? selectedSubType.code : '',
        },
        {
          type: 'input',
          field: 'desp',
          label: '类型名称',
          message: '请填写类型名称',
          value: selectedSubType ? selectedSubType.desp : '',
        },
        {
          type: 'select',
          field: 'type',
          label: '是否启用',
          message: '请选择是否启用',
          value: selectedSubType ? selectedSubType.type : '',
          datas: {
            options: [{ value: '0', title: '不启用' }, { value: '1', title: '启用' }],
          },
        },
      ],
    };

    return (
      <div>
        <SettingContainer
          titles="设备类型维护"
          buttons={buttons}
          titleImg="./assets/MaintenanceEquipment/peizhi.png"
        >
          <SimpleTable rowSelection={rowSelection} columns={tcolumns} dataSource={deviceSubTypes} />
        </SettingContainer>
        <Modal
          title="删除类型"
          visible={modalStatus === ModalStatus.delete}
          onOk={this.deleteDeviceSubType}
          onCancel={this.onCancel}
        >
          {selectedSubType ? `确定要删除【${selectedSubType.desp}】？` : ''}
        </Modal>
        <ModalForm {...modalConfig} />
      </div>
    );
  };

  renderSider = () => {
    const {
      MaintEqui: { deviceTypes },
    } = this.props;
    const root = { id: rootId, name: '设备类型', children: deviceTypes, selectable: false };
    return (
      <CommonSiderBar
        areaTreeList={[root]}
        onAreaTreeSelect={this.onDeviceTypeSelect}
        defaultSelectedKeys={root.id}
      />
    );
  };

  render() {
    return <SiderContent sider={this.renderSider()} content={this.renderContent()} />;
  }
}
export default MaintenanceEquipment;
