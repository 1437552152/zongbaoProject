import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, message, Cascader } from 'antd';
import router from 'umi/router';
import SettingContainer from '@/components/Setting/SettingContainer';
import SimpleTable from '@/components/SimpleTable';
import styles from './index.less';

@connect(({ equipmentC, loading }) => ({
  equipmentC,
  loading: loading.models.equipmentC,
}))
class EquipmentControl extends PureComponent {
  state = {
    delvisible: false,
    deleteComfirmTxt: '',
    selectDiveces: [],
    currentType: [], // 当前选中的设备类型
    currentPage: 1, // 当前页
  };

  componentDidMount() {
    this.fetchDeviceTypes();
  }

  fetchDeviceTypes = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentC/fetchDeviceType',
      callback: types => {
        const type = types[0];
        const { code } = type.children[0];
        this.fetchDeviceListBySubType(code);
        this.setState({
          currentType: [type.code, code],
        });
      },
    });
  };

  fetchDeviceListBySubType = (type, page = 1) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentC/fetchDeviceListBySubType',
      payload: { type, page },
    });
  };

  onTypeSelect = value => {
    const { currentPage } = this.state;
    this.fetchDeviceListBySubType(value[1], currentPage);
    this.setState({
      currentType: value,
    });
  };

  onPageChange = page => {
    const { currentType } = this.state;
    this.fetchDeviceListBySubType(currentType[1], page);
    this.setState({
      currentPage: page,
    });
  };

  deleteonComfirm = () => {
    const { dispatch } = this.props;
    const { selectDiveces } = this.state;
    selectDiveces.forEach(item => {
      dispatch({
        type: 'equipmentC/deltheDevice',
        payload: item.id,
        callback: data => {
          this.delcallback(data);
        },
      });
    });
  };

  delcallback = e => {
    const { dispatch } = this.props;
    if (e === 200) {
      this.setState({
        delvisible: false,
      });
      dispatch({
        type: 'equipmentC/fetchAllDevice',
      });
    }
  };

  deleteonCancel = () => {
    this.setState({
      delvisible: false,
    });
  };

  addDivice = () => {
    const { currentType } = this.state;
    if (currentType.length === 2) {
      router.push(`/imc/manage/devices/deviceadd?type=${currentType[0]}&subType=${currentType[1]}`);
    } else {
      message.error('未获取到设备类型信息');
    }
  };

  fixDivice = () => {
    const { currentType } = this.state;
    if (currentType.length !== 2) {
      message.error('未获取到设备类型信息');
      return;
    }
    const { selectDiveces } = this.state;
    if (selectDiveces.length === 1) {
      const selectdDivise = selectDiveces[0];
      router.push(
        `/imc/manage/devices/deviceedit?type=${currentType[0]}&subType=${currentType[1]}&id=${
          selectdDivise.id
        }`
      );
    } else {
      message.error('请选择一个设备进行修改');
    }
  };

  delDivice = () => {
    const { selectDiveces } = this.state;
    let showtext = '';
    selectDiveces.forEach(element => {
      if (showtext === '') {
        showtext = showtext.concat(`“${element.name}”`);
      } else {
        showtext = showtext.concat(`,“${element.name}”`);
      }
    });
    this.setState({
      deleteComfirmTxt: `确定要删除：${showtext}？`,
      delvisible: true,
    });
  };

  render() {
    const {
      equipmentC: { deviceList, deviceListLength, supportTypes },
    } = this.props;

    const buttons = [
      {
        title: '新增设备',
        onClick: this.addDivice,
        src: './assets/MaintenanceEquipment/tianjia.png',
        alt: '',
      },
      {
        title: '修改设备',
        onClick: this.fixDivice,
        src: './assets/MaintenanceEquipment/xiugai.png',
        alt: '',
      },
      {
        title: '删除设备',
        onClick: this.delDivice,
        src: './assets/MaintenanceEquipment/shanchu.png',
        alt: '',
      },
    ];
    const { delvisible, deleteComfirmTxt, currentType } = this.state;
    const that = this;

    function sortcolums(a, b) {
      return a ? a.localeCompare(b) : ''.localeCompare(b);
    }

    const tcolumns = [
      {
        title: '设备编号',
        sorter: (a, b) => sortcolums(a.code, b.code),
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '设备名称',
        sorter: (a, b) => sortcolums(a.name, b.name),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '设备区域',
        sorter: (a, b) => sortcolums(a.areaName, b.areaName),
        dataIndex: 'areaName',
        key: 'areaName',
      },
      {
        title: '设备位置',
        sorter: (a, b) => sortcolums(a.address, b.address),
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '设备类型',
        sorter: (a, b) => sortcolums(a.typeDesp, b.typeDesp),
        dataIndex: 'typeDesp',
        key: 'typeDesp',
      },
      {
        title: '运行状态',
        sorter: (a, b) => sortcolums(a.statusDesp, b.statusDesp),
        dataIndex: 'statusDesp',
        key: 'statusDesp',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'id',
        render: (text, record) => (
          <a href={`/imc/manage/devices/associate/${record.id}`}>连接配置</a>
        ),
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        that.setState({
          selectDiveces: selectedRows,
          selectedRowKeys,
        });
      },
    };

    const select = () => {
      return (
        <div className={styles.selectedDiv}>
          <div>
            <span>设备类型：</span>
            <Cascader
              allowClear={false}
              options={supportTypes}
              onChange={this.onTypeSelect}
              value={currentType}
            />
          </div>
        </div>
      );
    };
    return (
      <div>
        <SettingContainer
          titles="设备维护"
          buttons={buttons}
          other={select}
          titleImg="./assets/MaintenanceEquipment/peizhi.png"
        >
          <SimpleTable
            bordered
            rowSelection={rowSelection}
            columns={tcolumns}
            dataSource={deviceList}
            pagination={{
              position: 'bottom',
              showQuickJumper: true,
              total: deviceListLength,
              onChange: this.onPageChange,
            }}
          />
        </SettingContainer>
        <Modal visible={delvisible} onOk={this.deleteonComfirm} onCancel={this.deleteonCancel}>
          <div>
            <p>{deleteComfirmTxt}</p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default EquipmentControl;
