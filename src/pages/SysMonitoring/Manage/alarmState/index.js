/* eslint-disable no-unreachable */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Modal, Form, message } from 'antd';
import moment from 'moment';
import styles from './index.less';
import SettingContainer from '@/components/Setting/SettingContainer';
import ModalForm from '@/components/Setting/ModalForm';

@connect(({ alarmState }) => ({
  alarmState,
  // loading: loading.models.alarmState
}))
@Form.create()
class AlarmState extends PureComponent {
  state = {
    deleteComfirmTxt: '',
    selectedRowKeys: [],
    selectDiveces: [],
    modalTitle: '',
    selectdDivise: {
      id: '',
      code: '',
      desp: '',
      area: '',
      type: '',
      address: '',
      department: '',
      xAxis: '',
      yAxis: '',
      videoStream: '',
      setupTime: moment(),
      status: '',
      ip: '',
    },
    parentId: 1067,
    modalStatus: 0,
  };

  componentDidMount() {
    this.setState({
      selectdDivise: {
        type: 0,
      },
    });
    const { dispatch } = this.props;
    const { parentId } = this.state;
    const values = { id: parentId };
    dispatch({
      type: 'alarmState/fetchAllDevice',
      payload: values,
    });
  }

  onComfirm = values => {
    const { dispatch } = this.props;
    const { parentId, modalStatus, selectdDivise, selectDiveces } = this.state;

    const updateCallback = e => {
      const param = { id: parentId };
      if (e === 200) {
        this.setState({
          modalStatus: 0,
          selectedRowKeys: [],
          selectDiveces: [],
          selectdDivise: {
            id: '',
            code: '',
            desp: '',
            area: '',
            type: '',
            address: '',
            department: '',
            xAxis: '',
            yAxis: '',
            videoStream: '',
            setupTime: moment(),
            status: '',
            ip: '',
          },
        });
        dispatch({
          type: 'alarmState/fetchAllDevice',
          payload: param,
        });
      }
    };

    if (modalStatus === 1 || modalStatus === 2) {
      const { code, desp } = values;
      if (code.length > 50) {
        message.error('您输入的编号太长');
        return;
      }
      if (desp.length > 50) {
        message.error('您输入的名称太长');
        return;
      }
      const param = values;
      const dispatchType =
        modalStatus === 1 ? 'alarmState/addtheDevice' : 'alarmState/updatetheDevice';
      if (modalStatus === 1) {
        param.parentId = parentId;
        param.groupCode = 'ALARMTYPE';
      } else if (modalStatus === 2) {
        param.id = selectdDivise.id;
        param.parentId = parentId;
      }

      dispatch({
        type: dispatchType,
        payload: param,
        callback: data => {
          updateCallback(data);
        },
      });
    } else if (modalStatus === 3) {
      selectDiveces.forEach(item => {
        dispatch({
          type: 'alarmState/deltheDevice',
          payload: item.id,
          callback: data => {
            this.delcallback(data);
          },
        });
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
        type: 'alarmState/deltheDevice',
        payload: item.id,
        callback: data => {
          this.delcallback(data);
        },
      });
    });
  };

  delcallback = e => {
    const { dispatch } = this.props;
    const { parentId } = this.state;
    const values = { id: parentId };
    if (e === 200) {
      this.setState({
        modalStatus: 0,
        selectDiveces: [],
      });
      dispatch({
        type: 'alarmState/fetchAllDevice',
        payload: values,
      });
    }
  };

  deleteonCancel = () => {
    this.setState({
      modalStatus: 0,
    });
  };

  addDivice = () => {
    const { parentId } = this.state;
    this.setState({
      modalTitle: '新增类型',
      modalStatus: 1,
      selectdDivise: {
        id: '',
        code: '',
        desp: '',
        area: '',
        type: '',
        address: '',
        department: '',
        xAxis: '',
        yAxis: '',
        videoStream: '',
        setupTime: moment(),
        status: '',
        ip: '',
        parentId,
      },
    });
  };

  fixDivice = () => {
    const { selectDiveces } = this.state;
    if (selectDiveces.length === 1) {
      const selectdDivise = selectDiveces[0];
      selectdDivise.setupTime = moment(selectdDivise.setupTime, 'YYYY-MM-DD HH:mm:ss');
      this.setState({
        modalTitle: '修改类型',
        selectdDivise,
        modalStatus: 2,
      });
    } else {
      message.error('请选择一条记录进行修改');
    }
  };

  delDivice = () => {
    const { selectDiveces } = this.state;
    if (selectDiveces.length >= 1) {
      let showtext = '';
      selectDiveces.forEach(element => {
        if (showtext === '') {
          showtext = showtext.concat(`“${element.desp}”`);
        } else {
          showtext = showtext.concat(`,“${element.desp}”`);
        }
      });
      this.setState({
        deleteComfirmTxt: `确定要删除：${showtext}？`,
        modalStatus: 3,
      });
    } else {
      message.error('请选择一条或多条记录进行删除');
    }
  };

  render() {
    const {
      alarmState: { deviceList },
    } = this.props;
    const {
      modalTitle,
      selectedRowKeys,
      selectdDivise,
      deleteComfirmTxt,
      modalStatus,
    } = this.state;
    const that = this;

    function sortcolums(a, b) {
      if (a) {
        return a.localeCompare(b);
        // eslint-disable-next-line no-else-return
      } else {
        // eslint-disable-next-line no-param-reassign
        a = '';
        return a.localeCompare(b);
      }
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
        dataIndex: 'deviceCount', 
        key: 'deviceCount', 
        align: 'center' 
      },
      {
        title: '是否启用',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (text, record) => {
          let type = '';
          if (record.type === '0') {
            type = '不启用';
          } else {
            type = '启用';
          }
          return type;
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedKeys, selectedRows) => {
        that.setState({
          selectedRowKeys: selectedKeys,
          selectDiveces: selectedRows,
        });
      },
    };

    const config = {
      titles: [
        {
          key: 'manage',
          title: '报警类型维护',
          link: '',
        },
      ],
      titleImg: './assets/MaintenanceEquipment/peizhi.png',
      buttons: [
        {
          title: '新增类型',
          src: './assets/MaintenanceEquipment/tianjia.png',
          alt: '',
          onClick: this.addDivice,
        },
        {
          title: '修改类型',
          src: './assets/MaintenanceEquipment/xiugai.png',
          alt: '',
          onClick: this.fixDivice,
        },
        {
          title: '删除类型',
          src: './assets/MaintenanceEquipment/shanchu.png',
          alt: '',
          onClick: this.delDivice,
        },
      ],
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
          value: selectdDivise.code,
        },
        {
          type: 'input',
          field: 'desp',
          label: '类型名称',
          message: '请填写类型名称',
          value: selectdDivise.desp,
        },
        {
          type: 'select',
          field: 'type',
          label: '是否启用',
          message: '请选择是否启用',
          value: selectdDivise.type,
          datas: {
            options: [{ value: '0', title: '不启用' }, { value: '1', title: '启用' }],
          },
        },
      ],
    };

    return (
      <SettingContainer {...config}>
        <div className={styles.equipmenCMain}>
          <div className={styles.alarmStateListMain}>
            <Table
              bordered
              rowSelection={rowSelection}
              columns={tcolumns}
              className={styles.alarmStateTable}
              dataSource={deviceList}
            />
          </div>
          <ModalForm {...modalConfig} />
          <Modal
            visible={modalStatus === 3}
            onOk={this.deleteonComfirm}
            onCancel={this.deleteonCancel}
          >
            <div>
              <p>{deleteComfirmTxt}</p>
            </div>
          </Modal>
        </div>
      </SettingContainer>
    );
  }
}

export default AlarmState;
