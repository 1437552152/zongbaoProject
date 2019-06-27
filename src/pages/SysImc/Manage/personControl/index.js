import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, message } from 'antd';
import styles from './index.less';
import SettingContainer from '@/components/Setting/SettingContainer';
import ModalForm from '@/components/Setting/ModalForm';
import SimpleTable from '@/components/SimpleTable';

@connect(({ personC, loading }) => ({
  personC,
  loading: loading.models.personC,
}))
class PersonControl extends PureComponent {
  state = {
    modalStatus: 0,
    delvisible: false,
    areavisible: false,
    deleteComfirmTxt: '',
    selectedKeys: [],
    selectPersons: [],
    modalTitle: '',
    titleImg: './assets/MaintenanceEquipment/peizhi.png',
    buttons: [],
  };

  componentDidMount() {
    // const { dispatch, match: { params: { id } } } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'personC/fetchAllPerson',
    });
    this.setState({
      buttons: [
        {
          title: '新增人员',
          onClick: this.addPerson,
          src: './assets/MaintenanceEquipment/tianjia.png',
          alt: '',
        },
        {
          title: '修改人员',
          onClick: this.fixPerson,
          src: './assets/MaintenanceEquipment/xiugai.png',
          alt: '',
        },
        {
          title: '删除人员',
          onClick: this.delPerson,
          src: './assets/MaintenanceEquipment/shanchu.png',
          alt: '',
        },
      ],
    });
  }

  onComfirm = (values, states) => {
    const { dispatch } = this.props;
    const { selectPersons } = this.state;
    const param = values;
    if (states) {
      const dispatchType = states === 1 ? 'personC/addthePerson' : 'personC/updatethePerson';
      if (states === 2) {
        param.id = selectPersons[0].id;
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
    const { dispatch } = this.props;
    if (e === 200) {
      this.setState({
        modalStatus: 0,
        selectedKeys: [],
        selectPersons: [],
      });
      dispatch({
        type: 'personC/fetchAllPerson',
      });

      this.modalForm.props.form.resetFields();
    }
  };

  areaComfirm = () => {
    this.setState({
      areavisible: false,
    });
  };

  areaCancel = () => {
    this.setState({
      areavisible: false,
    });
  };

  onCancel = () => {
    this.setState({
      modalStatus: 0,
    });
  };

  deleteonComfirm = () => {
    const { dispatch } = this.props;
    const { selectPersons } = this.state;
    selectPersons.forEach(item => {
      dispatch({
        type: 'personC/delthePerson',
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
        type: 'personC/fetchAllPerson',
      });
    }
  };

  deleteonCancel = () => {
    this.setState({
      delvisible: false,
    });
  };

  lookarea = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personC/fetchAllArea',
      payload: id,
    });
    this.setState({
      areavisible: true,
    });
  };

  addPerson = () => {
    this.setState({
      modalTitle: '新增人员',
      modalStatus: 1,
      userDisabled: false,
      selectPersons: [],
      selectedKeys: [],
    });
  };

  fixPerson = () => {
    const { selectPersons } = this.state;
    if (selectPersons.length === 1) {
      this.setState({
        modalTitle: '修改人员信息',
        modalStatus: 2,
        userDisabled: true,
      });
    } else {
      message.error('请选择一个人员进行修改');
    }
  };

  delPerson = () => {
    const { selectPersons } = this.state;
    if (selectPersons.length === 0) {
      message.error('请选择需删除人员');
      return;
    }
    let showtext = '';
    selectPersons.forEach(element => {
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
      personC: { areaList, personList },
    } = this.props;

    const {
      selectedKeys,
      modalTitle,
      modalStatus,
      selectPersons,
      deleteComfirmTxt,
      titleImg,
      buttons,
      titles,
      areavisible,
      delvisible,
      userDisabled,
    } = this.state;

    const that = this;
    function sortcolums(a, b) {
      return a ? a.localeCompare(b) : ''.localeCompare(b);
    }
    const tcolumns = [
      { title: '序号', sorter: (a, b) => a - b, dataIndex: 'index', key: 'index' },
      {
        title: '人员账号',
        sorter: (a, b) => sortcolums(a.userAccount, b.userAccount),
        dataIndex: 'userAccount',
        key: 'userAccount',
      },
      {
        title: '人员姓名',
        sorter: (a, b) => sortcolums(a.name, b.name),
        dataIndex: 'name',
        key: 'conamede',
      },
      {
        title: '所属公司',
        sorter: (a, b) => sortcolums(a.company, b.company),
        dataIndex: 'company',
        key: 'company',
      },
      {
        title: '联络电话',
        sorter: (a, b) => sortcolums(a.tel, b.tel),
        dataIndex: 'tel',
        key: 'tel',
      },
      {
        title: '邮箱',
        sorter: (a, b) => sortcolums(a.email, b.email),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '微信号',
        sorter: (a, b) => sortcolums(a.wechat, b.wechat),
        dataIndex: 'wechat',
        key: 'wechat',
      },
      {
        title: '人员类型',
        sorter: (a, b) => sortcolums(a.typeDesp, b.typeDesp),
        dataIndex: 'typeDesp',
        key: 'typeDesp',
      },
      {
        title: '负责区域',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => <a onClick={() => this.lookarea(record.id)}>查看</a>,
      },
    ];
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        that.setState({
          selectPersons: selectedRows,
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
          field: 'userAccount',
          label: '人员账号：',
          message: '请填写人员账号',
          value: selectPersons.length > 0 ? selectPersons[0].userAccount : '',
          disabled: userDisabled,
        },
        {
          type: 'input',
          field: 'name',
          label: '人员名称：',
          message: '请填写人员名称',
          value: selectPersons.length > 0 ? selectPersons[0].name : '',
        },
        {
          type: 'input',
          field: 'company',
          label: '所属公司：',
          message: '请填写所属公司',
          value: selectPersons.length > 0 ? selectPersons[0].company : '',
        },
        {
          type: 'input',
          field: 'tel',
          label: '联系电话：',
          message: '请填写联系电话',
          value: selectPersons.length > 0 ? selectPersons[0].tel : '',
        },
        {
          type: 'input',
          field: 'email',
          label: '个人邮箱：',
          message: '请填写个人邮箱',
          value: selectPersons.length > 0 ? selectPersons[0].email : '',
        },
        {
          type: 'input',
          field: 'wechat',
          label: '人员微信：',
          message: '请填写人员微信',
          value: selectPersons.length > 0 ? selectPersons[0].wechat : '',
        },
        {
          type: 'select',
          field: 'type',
          label: '人员类型：',
          message: '请选择人员类型',
          value: selectPersons.length > 0 ? selectPersons[0].type : '',
          datas: {
            options: [{ value: '001', title: '保安' }, { value: '002', title: '干系人' }],
          },
        },
      ],
    };

    return (
      <div className={styles.personCMain}>
        <SettingContainer titles={titles} buttons={buttons} titleImg={titleImg}>
          <SimpleTable rowSelection={rowSelection} columns={tcolumns} dataSource={personList} />
        </SettingContainer>
        <ModalForm
          {...modalConfig}
          wrappedComponentRef={form => {
            this.modalForm = form;
          }}
        />
        <Modal visible={delvisible} onOk={this.deleteonComfirm} onCancel={this.deleteonCancel}>
          <div>
            <p>{deleteComfirmTxt}</p>
          </div>
        </Modal>
        <Modal
          visible={areaList.length && areavisible}
          onOk={this.areaComfirm}
          onCancel={this.areaCancel}
          title="负责区域"
        >
          <div className={styles.personarea}>
            {areaList.map(item => (
              <li>{item}</li>
            ))}
            {/* <Table bordered dataSource={areaList}>
              <Column title="负责区域" dataIndex="typeDesp" key="typeDesp" />
            </Table> */}
          </div>
        </Modal>
      </div>
    );
  }
}
export default PersonControl;
