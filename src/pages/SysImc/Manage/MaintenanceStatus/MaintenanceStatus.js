/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message, Modal } from 'antd';
import SettingContainer from '@/components/Setting/SettingContainer';
import ModalForm from '@/components/Setting/ModalForm';
import SimpleTable from '@/components/SimpleTable';

@connect(({ MaintStat, loading }) => ({
  MaintStat,
  loading: loading.models.MaintStat,
}))
class MaintenanceStatus extends PureComponent {
  state = {
    titles: '设备状态维护',
    modalStatus: 0,
    delvisible: false,
    deleteComfirmTxt: '',
    selectedKeys: [],
    selectDiveces: [],
    modalTitle: '',
    titleImg: './assets/MaintenanceEquipment/peizhi.png',
    buttons: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.setState({
      buttons: [
        {
          title: '新增状态',
          onClick: this.addDivice,
          src: './assets/MaintenanceEquipment/tianjia.png',
          alt: '',
        },
        {
          title: '修改状态',
          onClick: this.fixDivice,
          src: './assets/MaintenanceEquipment/xiugai.png',
          alt: '',
        },
        {
          title: '删除状态',
          onClick: this.delDivice,
          src: './assets/MaintenanceEquipment/shanchu.png',
          alt: '',
        },
      ],
    });
    dispatch({
      type: 'MaintStat/fetchAllDevice',
    });
    dispatch({
      type: 'MaintStat/fetchAllArea',
    });
  }

  onComfirm = (values, states) => {
    const { dispatch } = this.props;
    const { selectDiveces } = this.state;
    const param = values;
    param.groupCode = 'DEVICETYPE';
    param.parentId = 1083;
    if (states) {
      const dispatchType = states === 1 ? 'MaintStat/addtheDevice' : 'MaintStat/updatetheDevice';
      if (states === 2) {
        param.id = selectDiveces[0].id;
      }
      dispatch({
        type: dispatchType,
        payload: param,
        callback: data => {
          this.updatecallback(data);
        },
      });
    }
  };

  updatecallback = e => {
    const { dispatch } = this.props;
    if (e === 200) {
      this.setState({
        modalStatus: 0,
        selectedKeys: [],
        selectDiveces: [],
      });
      dispatch({
        type: 'MaintStat/fetchAllDevice',
      });
    }
  };

  onCancel = () => {
    this.setState({
      modalStatus: 0,
    });
  };

  deleteonComfirm = () => {
    const { dispatch } = this.props;
    const { selectDiveces } = this.state;
    selectDiveces.forEach(item => {
      dispatch({
        type: 'MaintStat/deltheDevice',
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
        type: 'MaintStat/fetchAllDevice',
      });
    }
  };

  deleteonCancel = () => {
    this.setState({
      delvisible: false,
    });
  };

  addDivice = () => {
    this.setState({
      modalTitle: '新增状态',
      modalStatus: 1,
      selectdDivise: {
        parentId: 1083,
        code: '',
        desp: '',
        type: '',
        deviceCount: '',
        groupCode: '',
        id: '',
        revision: '',
      },
    });
  };

  fixDivice = () => {
    const { selectDiveces } = this.state;
    if (selectDiveces.length === 1) {
      const selectdDivise = selectDiveces[0];
      this.setState({
        modalTitle: '修改类型',
        modalStatus: 2,
        selectdDivise,
      });
    } else {
      message.error('请选择一个类型进行修改');
    }
  };

  delDivice = () => {
    let showtext = '';
    const { selectDiveces } = this.state;
    selectDiveces.forEach(element => {
      if (showtext === '') {
        showtext = showtext.concat(`“${element.desp}”`);
      } else {
        showtext = showtext.concat(`,“${element.desp}”`);
      }
    });
    this.setState({
      deleteComfirmTxt: `确定要删除：${showtext}？`,
      dealtype: 'del',
      delvisible: true,
    });
  };

  render() {
    const {
      MaintStat: { areaList, deviceList, addcode, delcode, updatecode },
      loading,
    } = this.props;
    const {
      selectedKeys,
      modalTitle,
      modalStatus,
      selectDiveces,
      deleteComfirmTxt,
      titleImg,
      buttons,
      titles,
      delvisible,
      delTitle,
    } = this.state;

    const that = this;

    function sortcolums(a, b) {
      return a ? a.localeCompare(b) : ''.localeCompare(b);
    }

    const tcolumns = [
      {
        title: '状态编号',
        sorter: (a, b) => sortcolums(a.code, b.code),
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '状态名称',
        sorter: (a, b) => sortcolums(a.desp, b.desp),
        dataIndex: 'desp',
        key: 'desp',
      },
      {
        title: '设备统计',
        sorter: (a, b) => sortcolums(a.deviceCount, b.deviceCount),
        dataIndex: 'deviceCount',
        key: 'deviceCount',
        align: 'center',
      },
      {
        title: '使用状态',
        dataIndex: 'revision',
        key: 'revision',
        align: 'center',
        render: (text, record) => {
          let revision = '';
          if (record.type === '0') {
            revision = '不启用';
          } else {
            revision = '启用';
          }
          return revision;
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        that.setState({
          selectDiveces: selectedRows,
          selectedKeys: selectedRowKeys,
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
          label: '状态编号',
          message: '请填写状态编号',
          value: selectDiveces.length > 0 ? selectDiveces[0].code : '',
        },
        {
          type: 'input',
          field: 'desp',
          label: '状态名称',
          message: '请填写状态名称',
          value: selectDiveces.length > 0 ? selectDiveces[0].desp : '',
        },
        {
          type: 'select',
          field: 'type',
          label: '是否启用',
          message: '请选择是否启用',
          value: selectDiveces.length > 0 ? selectDiveces[0].type : '',
          datas: {
            options: [{ value: '0', title: '不启用' }, { value: '1', title: '启用' }],
          },
        },
      ],
    };

    return (
      <div>
        <SettingContainer titles={titles} buttons={buttons} titleImg={titleImg}>
          <SimpleTable rowSelection={rowSelection} columns={tcolumns} dataSource={deviceList} />
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
      </div>
    );
  }
}

export default MaintenanceStatus;
