import React from 'react';
import { Modal, message } from 'antd';
import { connect } from 'dva';
import SettingContainer from '@/components/Setting/SettingContainer';
import EchartContainer from './EchartModel/EchartContainer';
import ModalForm from '@/components/Setting/ModalForm';
import SimpleTable from '@/components/SimpleTable';

@connect(({ mainConfigModel, loading }) => ({
  mainConfigModel,
  loading: loading.models.mainConfigModel,
}))
class MainConfig extends React.PureComponent {
  state = {
    selecItems: [],
    parentId: -1,
    groupCode: '',
    titles: [
      {
        title: '配置管理',
      },
      {
        title: '故障类型维护',
      },
    ],
    titleImg: './assets/MaintenanceEquipment/peizhi.png',
    buttons: [],
    modalTitle: '',
    modalStatus: 0,
    ecmodalvisible: false,
    delvisible: false,
    ChartData: [],
    delTitle: '',
    fixTitle: '',
    deleteComfirmTxt: '',
    mianType: '',
    selectedKeys: [],
  };

  componentWillMount() {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'mainConfigModel/fetchAllMain',
      payload: id,
    });
    switch (id) {
      case '1371':
        this.setState({
          parentId: 1371,
          groupCode: 'MALFUNCTIONTYPE',
          titles: [
            {
              title: '配置管理',
            },
            {
              title: '故障类型维护',
            },
          ],
          modalTitle: '故障类型统计',
          mianType: '类型',
          buttons: [
            {
              title: '新增类型',
              onClick: this.addMainConfig,
              src: './assets/MaintenanceEquipment/tianjia.png',
              alt: '',
            },
            {
              title: '修改类型',
              onClick: this.updateMainConfig,
              src: './assets/MaintenanceEquipment/xiugai.png',
              alt: '',
            },
            {
              title: '删除类型',
              onClick: this.delMainConfig,
              src: './assets/MaintenanceEquipment/shanchu.png',
              alt: '',
            },
          ],
        });
        break;
      case '1321':
        this.setState({
          parentId: 1321,
          groupCode: 'REPLACEREPAIRSTATUS',
          titles: [
            {
              title: '配置管理',
            },
            {
              title: '维修状态维护',
            },
          ],
          modalTitle: '维修状态统计',
          mianType: '状态',
          buttons: [
            {
              title: '新增维修状态',
              onClick: this.addMainConfig,
              src: './assets/MaintenanceEquipment/tianjia.png',
              alt: '',
            },
            {
              title: '修改维修状态',
              onClick: this.updateMainConfig,
              src: './assets/MaintenanceEquipment/xiugai.png',
              alt: '',
            },
            {
              title: '删除维修状态',
              onClick: this.delMainConfig,
              src: './assets/MaintenanceEquipment/shanchu.png',
              alt: '',
            },
          ],
        });
        break;
      case '1323':
        this.setState({
          parentId: 1323,
          groupCode: 'REPAIRLEVEL',
          titles: [
            {
              title: '配置管理',
            },
            {
              title: '维修级别维护',
            },
          ],
          modalTitle: '维修级别统计',
          mianType: '级别',
          buttons: [
            {
              title: '新增维修级别',
              onClick: this.addMainConfig,
              src: './assets/MaintenanceEquipment/tianjia.png',
              alt: '',
            },
            {
              title: '修改维修级别',
              onClick: this.updateMainConfig,
              src: './assets/MaintenanceEquipment/xiugai.png',
              alt: '',
            },
            {
              title: '删除维修级别',
              onClick: this.delMainConfig,
              src: './assets/MaintenanceEquipment/shanchu.png',
              alt: '',
            },
          ],
        });
        break;
      case '1329':
        this.setState({
          parentId: 1329,
          groupCode: 'REPAIRRESULT',
          titles: [
            {
              title: '配置管理',
            },
            {
              title: '维修结果维护',
            },
          ],
          modalTitle: '维修结果统计',
          mianType: '结果',
          buttons: [
            {
              title: '新增维修结果',
              onClick: this.addMainConfig,
              src: './assets/MaintenanceEquipment/tianjia.png',
              alt: '',
            },
            {
              title: '修改维修结果',
              onClick: this.updateMainConfig,
              src: './assets/MaintenanceEquipment/xiugai.png',
              alt: '',
            },
            {
              title: '删除维修结果',
              onClick: this.delMainConfig,
              src: './assets/MaintenanceEquipment/shanchu.png',
              alt: '',
            },
          ],
        });
        break;
      case '1449':
        this.setState({
          parentId: 1449,
          groupCode: 'SCHEMELEVEL',
          titles: [
            {
              title: '配置管理',
            },
            {
              title: '计划级别维护',
            },
          ],
          modalTitle: '计划级别统计',
          mianType: '级别',
          buttons: [
            {
              title: '新增计划级别',
              onClick: this.addMainConfig,
              src: './assets/MaintenanceEquipment/tianjia.png',
              alt: '',
            },
            {
              title: '修改计划级别',
              onClick: this.updateMainConfig,
              src: './assets/MaintenanceEquipment/xiugai.png',
              alt: '',
            },
            {
              title: '删除计划级别',
              onClick: this.delMainConfig,
              src: './assets/MaintenanceEquipment/shanchu.png',
              alt: '',
            },
          ],
        });
        break;
      default:
        break;
    }
  }

  addMainConfig = () => {
    const { mianType } = this.state;
    this.setState({
      modalStatus: 1,
      fixTitle: `新增${mianType}`,
      selecItems: [
        {
          code: '',
          type: '',
          desp: '',
        },
      ],
    });
  };

  updateMainConfig = () => {
    const { mianType, selecItems } = this.state;
    if (selecItems && selecItems.length === 1) {
      this.setState({
        modalStatus: 2,
        fixTitle: `编辑${mianType}`,
        selecItems,
      });
    } else {
      message.error('请选择一条数据进行修改');
    }
  };

  delMainConfig = () => {
    const { selecItems } = this.state;
    if (selecItems && selecItems.length >= 1) {
      let showtext = '';
      selecItems.forEach(element => {
        if (showtext === '') {
          showtext = showtext.concat(`${element.desp}`);
        } else {
          showtext = showtext.concat(`,${element.desp}`);
        }
      });
      this.setState({
        deleteComfirmTxt: `确定要删除：${showtext}？`,
        delvisible: true,
      });
    } else {
      message.error('请选择一条或多条记录进行删除');
    }
  };

  deleteonComfirm = () => {
    const { dispatch } = this.props;
    const { selecItems } = this.state;
    selecItems.forEach(item => {
      dispatch({
        type: 'mainConfigModel/delMainConfig',
        payload: item.id,
        callback: data => {
          this.delcallback(data);
        },
      });
    });
  };

  delcallback = e => {
    if (e === 200) {
      this.setState({
        delvisible: false,
      });
      this.refreshTable();
    }
  };

  deleteonCancel = () => {
    this.setState({
      delvisible: false,
    });
  };

  onCancel = () => {
    this.setState({
      modalStatus: 0,
    });
  };

  onComfirm = (values, state) => {
    if (values.code.length > 100) {
      message.error('类型编号长度不能大于100');
      return false;
    }
    if (values.desp.length > 100) {
      message.error('类型名称长度不能大于100');
      return false;
    }
    const { dispatch } = this.props;
    const { groupCode, parentId, selecItems } = this.state;
    const param = values;
    param.parentId = parentId;
    param.groupCode = groupCode;
    if (state) {
      const dispatchType =
        state === 1 ? 'mainConfigModel/addMainConfig' : 'mainConfigModel/updateMainConfig';
      if (state === 2) {
        param.id = selecItems[0].id;
      }
      dispatch({
        type: dispatchType,
        payload: param,
        callback: data => {
          this.updatecallback(data);
        },
      });
    }
    return true;
  };

  updatecallback = e => {
    if (e === 200) {
      this.setState({
        modalStatus: 0,
      });
      this.refreshTable();
    }
  };

  refreshTable = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'mainConfigModel/fetchAllMain',
      payload: id,
    });
    this.setState({
      selecItems: [],
      selectedKeys: [],
    });
  };

  render() {
    const {
      selecItems,
      modalTitle,
      ecmodalvisible,
      ChartData,
      titles,
      titleImg,
      fixTitle,
      delTitle,
      deleteComfirmTxt,
      mianType,
      buttons,
      modalStatus,
      delvisible,
      selectedKeys,
    } = this.state;
    const {
      mainConfigModel: { mainConfigList },
    } = this.props;
    function sortcolums(a, b) {
      return a ? a.localeCompare(b) : ''.localeCompare(b);
    }
    const tcolumns = [
      {
        title: `${mianType}编号`,
        sorter: (a, b) => sortcolums(a.code, b.code),
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: `${mianType}名称`,
        sorter: (a, b) => sortcolums(a.desp, b.desp),
        dataIndex: 'desp',
        key: 'desp',
      },
      {
        title: '使用状态',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          return record.type === '1' ? '启用' : '不启用';
        },
      },
    ];

    const that = this;
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        that.setState({
          selecItems: selectedRows,
          selectedKeys: selectedRowKeys,
        });
      },
    };

    const modalConfig = {
      title: fixTitle,
      state: modalStatus,
      onOk: this.onComfirm,
      onCancel: this.onCancel,
      datas: [
        {
          type: 'input',
          field: 'code',
          label: `${mianType}编号`,
          message: `请填写${mianType}编号`,
          value: selecItems.length > 0 ? selecItems[0].code : '',
        },
        {
          type: 'input',
          field: 'desp',
          label: `${mianType}名称`,
          message: `请填写${mianType}名称`,
          value: selecItems.length > 0 ? selecItems[0].desp : '',
        },
        {
          type: 'select',
          field: 'type',
          label: '是否启用',
          message: '请选择是否启用',
          value: selecItems.length > 0 ? selecItems[0].type : '',
          datas: {
            options: [{ value: '0', title: '不启用' }, { value: '1', title: '启用' }],
          },
        },
      ],
    };
    return (
      <div>
        <SettingContainer titles={titles} buttons={buttons} titleImg={titleImg}>
          <SimpleTable rowSelection={rowSelection} columns={tcolumns} dataSource={mainConfigList} />
        </SettingContainer>
        <Modal
          title={delTitle}
          visible={delvisible}
          onOk={this.deleteonComfirm}
          onCancel={this.deleteonCancel}
        >
          <div>
            <p>{deleteComfirmTxt}</p>
          </div>
        </Modal>
        <ModalForm {...modalConfig} />
        <Modal title={modalTitle} visible={ecmodalvisible}>
          <EchartContainer ChartData={ChartData} />
        </Modal>
      </div>
    );
  }
}

export default MainConfig;
