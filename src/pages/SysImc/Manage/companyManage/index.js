/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { Tabs, Input, Icon, Button, Select, Form, Col, Modal, Checkbox, message } from 'antd';
import { connect } from 'dva';
import CommonSiderBar from '@/components/CommonSiderBar';
import CollapseTree from '@/components/CollapseTree';
import SettingContainer from '@/components/Setting/SettingContainer';
import SimpleTable from '@/components/SimpleTable';
import ModalForm from '@/components/Setting/ModalForm';
import DelModal from './delConfirm/delModal';
import SelectedPersonModal from './SelectedPersonModal';
import UnSelectedPersonModal from './UnSelectedPersonModal';
import styles from './index.less';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
@connect(({ companyManage, loading }) => ({
  companyManageModel: companyManage,
  loading,
}))
@Form.create()
class companyManage extends PureComponent {
  state = {
    titles: '设备类型维护',
    titleImg: '/assets/MaintenanceEquipment/peizhi.png',
    contentType: 'list',
    modalStatus: 0,
    demodalStatus: 0,
    departDelStatus: 0,
    groupModalStatus: 0,
    departValue: '',
    selectDeparts: [],
    departModalTitle: '新增部门',
    delDepartname: '',
    visible: false,
    selDepartId: '',
    selGroup: '',
    selPersonVisible: false,
    unSelPersonVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'companyManage/fetchCompanyTree',
    });
    dispatch({
      type: 'companyManage/fetchAreas',
    });
  }

  onOk = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  onCancel = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  showModal = rowData => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  addCompany = () => {
    this.setState({
      modalStatus: 1,
    });
  };

  /**
   * 点击公司
   * @param selectedKeys
   * @param info
   */
  onCompanySelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    const companyInfo = info.node.props.dataRef;
    if (!companyInfo.isCompany) {
      return;
    }
    dispatch({
      type: 'companyManage/fetchCompanyInfo',
      payload: companyInfo.id,
    });
    dispatch({
      type: 'companyManage/fetchCompanyDepartments',
      payload: companyInfo.id,
      callback: data => {
        this.listDepartCallback(data);
      },
    });
  };

  listDepartCallback = data => {
    if (data.length > 0) {
      this.changdepart(data[0].id);
    }
  };

  /**
   * 跟新公司信息
   */
  updateCompanyInfo = () => {
    const { form, dispatch } = this.props;
    const that = this;
    form.validateFields(['name', 'type', 'areaId'], (err, values) => {
      if (!err) {
        dispatch({
          type: 'companyManage/updateCompanyInfo',
          payload: {
            ...values,
            id: this.props.companyManageModel.companyInfo.id,
          },
        });
        that.setState({ contentType: 'list' });
      }
    });
  };

  /**
   * 删除公司
   * @param record
   */
  deleteCompany = () => {
    const { dispatch } = this.props;
    const that = this;
    const { companyInfo } = this.props.companyManageModel;
    Modal.confirm({
      title: '确定删除该公司吗?',
      content: '一旦删除，无法恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'companyManage/deleteCompany',
          payload: companyInfo.id,
        });
        that.setState({ contentType: 'list' });
      },
      onCancel() {
        that.setState({ contentType: 'list' });
      },
    });
  };

  /**
   * 添加或更新部门
   */
  onDepartConfirm = (values, _) => {
    const { form, dispatch, companyManageModel } = this.props;

    if (JSON.stringify(companyManageModel.companyInfo) === '{}') {
      message.warn('没有选择公司');
      return;
    }

    if (values) {
      if (this.state.selectDeparts.length > 0) {
        // 更新部门
        dispatch({
          type: 'companyManage/updateDepart',
          payload: {
            ...values,
            id: this.state.selectDeparts[0].id,
          },
          companyId: companyManageModel.companyInfo.id,
        });
      } else {
        // 添加部门
        dispatch({
          type: 'companyManage/addDepart',
          payload: {
            ...values,
            fid: companyManageModel.companyInfo.id,
          },
        });
      }

      this.setState({
        demodalStatus: 0,
      });
    }
  };

  addDepart = record => {
    const title = record ? '修改部门' : '新增部门';
    const selectDeparts = record ? [record] : [];
    const { demodalStatus } = this.state;
    this.setState({
      selectDeparts,
      departModalTitle: title,
      demodalStatus: 1,
    });
  };

  addGroup = () => {
    const { selDepartId } = this.state;
    if (selDepartId === '') {
      message.warn('没有选择部门');
      return;
    }
    this.setState({
      groupModalStatus: 1,
    });
  };

  delDepart = record => {
    const delDepartname = record.name;
    this.setState({
      delDepartname: `确定要删除：${delDepartname}`,
      selectDeparts: record,
      departDelStatus: 1,
    });
  };

  /**
   * 确定删除部门
   */
  departDelComfirm = () => {
    const { selectDeparts } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'companyManage/deleteDepart',
      payload: selectDeparts.id,
      companyId: selectDeparts.fid,
    });

    this.setState({
      departDelStatus: 0,
    });
  };

  /**
   * 删除分组
   */
  groupDel = record => {
    const { dispatch } = this.props;
    const that = this;
    Modal.confirm({
      title: '确定删除该分组吗?',
      content: '一旦删除，无法恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'companyManage/deleteGroup',
          payload: {
            id: record.id,
            departId: record.companyId,
          },
        });
      },
      onCancel() {
        return '';
      },
    });
  };

  /**
   * 新增公司确定
   */
  addCompanyConfirm = (values, _) => {
    const { dispatch } = this.props;
    if (values) {
      dispatch({
        type: 'companyManage/addCompany',
        payload: {
          ...values,
          pid: 0,
        },
      });

      this.setState({
        modalStatus: 0,
      });
    }
  };

  /**
   * 新增分组确定
   */
  addGroupConfirm = (values, _) => {
    const { dispatch } = this.props;
    const { selDepartId } = this.state;
    if (values) {
      dispatch({
        type: 'companyManage/addGroup',
        payload: {
          ...values,
          companyId: selDepartId,
          status: '1',
        },
      });
      this.setState({
        groupModalStatus: 0,
      });
    }
  };

  departDelCancel = () => {
    this.setState({
      departDelStatus: 0,
    });
  };

  onaddCancel = () => {
    const { modalStatus } = this.state;
    this.setState({
      modalStatus: 0,
    });
  };

  ondepartCancel = () => {
    const { demodalStatus } = this.state;
    this.setState({
      demodalStatus: 0,
    });
  };

  onGroupCancel = () => {
    const { groupModalStatus } = this.state;
    this.setState({
      groupModalStatus: 0,
    });
  };

  companyOrDepartmentEdit = type => {
    const { companyInfo } = this.props.companyManageModel;
    if (!companyInfo || JSON.stringify(companyInfo) === '{}') {
      message.warn('没有选择公司');
      return;
    }
    this.setState({ contentType: type });
  };

  setCompanyInfo = (companyInfo, areaList) => {
    if (companyInfo && companyInfo.typeDesp) {
      return;
    }
    if (companyInfo) {
      if (companyInfo.type && companyInfo.type === '01') {
        companyInfo.typeDesp = '物业公司';
      } else {
        companyInfo.typeDesp = '普通公司';
      }
      areaList.forEach(item => {
        if (item.id && item.id === companyInfo.areaId) {
          companyInfo.areaName = item.name;
        }
      });
    }
  };

  changdepart = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companyManage/listGroup',
      payload: value,
    });
    this.setState({
      selDepartId: value,
      departValue: value,
    });
  };

  // 人员管理点击
  onPersonClick = record => {
    this.reqSelPersonList(record);
    this.setState({
      selGroup: record.id,
    });
    this.changeSelectedPersonModalVisible();
  };

  // 显示或隐藏已配置人员窗口
  changeSelectedPersonModalVisible = () => {
    const { selPersonVisible } = this.state;
    this.setState({
      selPersonVisible: !selPersonVisible,
    });
  };

  // 新增人员
  onSelPersonSelectAddClick = () => {
    this.reqUnSelPersonList();
    this.changeUnSelectedPersonModalVisible();
  };

  // 显示或隐藏未配置人员窗口
  changeUnSelectedPersonModalVisible = () => {
    const { unSelPersonVisible } = this.state;
    this.setState({
      unSelPersonVisible: !unSelPersonVisible,
    });
  };

  // 请求已配置人员列表
  reqSelPersonList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companyManage/listBindPerson',
      payload: { id: params.id },
    });
  };

  // 请求未配置人员列表
  reqUnSelPersonList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companyManage/listUnBindPerson',
    });
  };

  // 添加未绑定人员
  onUnSelPersonSelectAddClick = ids => {
    const { dispatch } = this.props;
    const { selGroup } = this.state;
    dispatch({
      type: 'companyManage/bindPerson',
      payload: {
        id: selGroup,
        ids,
      },
      callback: () => {
        this.reqSelPersonList({ id: selGroup });
        this.changeUnSelectedPersonModalVisible();
      },
    });
  };

  // 删除已绑定人员
  onSelPersonSelectDelClick = ids => {
    const { dispatch } = this.props;
    const { selGroup } = this.state;
    dispatch({
      type: 'companyManage/delBindPerson',
      payload: {
        id: selGroup,
        ids,
      },
      callback: () => this.reqSelPersonList({ id: selGroup }),
    });
  };

  // 搜索
  reqUnSelPersonListBySearch = values => {
    this.reqUnSelPersonList({ ...values });
  };

  renderContent = () => {
    const {
      visible,
      modalStatus,
      groupModalStatus,
      departValue,
      selPersonVisible,
      unSelPersonVisible,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      companyInfo,
      departmentList,
      areaList,
      groupList,
      bindPersonData,
      unBindPersonData,
    } = this.props.companyManageModel;
    this.setCompanyInfo(companyInfo, areaList);
    const tcolumns = [
      {
        title: '组名',
        dataIndex: 'name',
        key: 'name',
        align: 'left',
      },
      {
        title: '所属公司',
        dataIndex: 'company',
        key: 'company',
        align: 'left',
      },
      {
        title: '所属部门',
        dataIndex: 'dept',
        key: 'dept',
        align: 'left',
      },
      {
        title: '操作',
        render: (_, record) => (
          <div className={styles.opts}>
            <a onClick={() => this.onPersonClick(record)}>[人员维护]</a>
            <a onClick={() => this.groupDel(record)}>[删除分组]</a>
          </div>
        ),
      },
    ];

    const treeData = [
      {
        id: '1',
        name: '第一分组',
        children: [
          {
            id: '11',
            name: '张三',
          },
          {
            id: '12',
            name: '李四',
          },
        ],
      },
      {
        id: '2',
        name: '第二分组',
        children: [
          {
            id: '21',
            name: '张三',
          },
          {
            id: '22',
            name: '李四',
          },
        ],
      },
    ];

    const options = [];
    for (let i = 0; i < 20; i++) {
      options.push({
        label: '张三',
        value: `${i + 1}`,
      });
    }

    const groupModalConfig = {
      title: '新增分组',
      state: groupModalStatus,
      onOk: this.addGroupConfirm,
      onCancel: this.onGroupCancel,
      datas: [
        {
          type: 'input',
          field: 'name',
          label: '分组名称：',
          message: `请填写分组名称`,
        },
      ],
    };

    const modalConfig = {
      title: '新增公司',
      state: modalStatus,
      onOk: this.addCompanyConfirm,
      onCancel: this.onaddCancel,
      datas: [
        {
          type: 'input',
          field: 'name',
          label: '公司名称：',
          message: `请填写公司名称`,
        },
        {
          type: 'select',
          field: 'type',
          label: '公司类型：',
          message: `请选择公司类型`,
          datas: {
            options: [{ value: '01', title: '物业公司' }, { value: '02', title: '普通公司' }],
          },
        },
        // {
        //   type: 'select',
        //   field: 'areaId',
        //   label: '上级节点：',
        //   message: '请选择所属上级节点',
        //   datas: {
        //     options: areaList,
        //     title: 'name',
        //     value: 'id',
        //   },
        // },
      ],
    };

    const selectedPersonProps = {
      onAddClick: () => this.onSelPersonSelectAddClick(),
      onDelClick: ids => this.onSelPersonSelectDelClick(ids),
      onCancelClick: () => this.changeSelectedPersonModalVisible(),
      visible: selPersonVisible,
      data: bindPersonData,
      onTableChange: this.reqSelPersonList,
    };

    const unSelectedPersonProps = {
      onAddClick: ids => this.onUnSelPersonSelectAddClick(ids),
      onCancelClick: () => this.changeUnSelectedPersonModalVisible(),
      visible: unSelPersonVisible,
      data: unBindPersonData,
      onTableChange: this.reqUnSelPersonList,
      onTableSearch: this.reqUnSelPersonListBySearch,
    };
    return (
      <div>
        <div className={styles.title}>{companyInfo.name || ''}</div>
        <div className={styles.info}>
          <div className={styles.label}>
            <span className={styles.labelDesp}>公司名称 :</span>
            <span>{companyInfo.name || ''}</span>
          </div>
          <div className={styles.label}>
            <span className={styles.labelDesp}>公司类型 :</span>
            <span>{companyInfo.typeDesp || ''}</span>
          </div>
          {/* <div className={styles.label}>
            <span className={styles.labelDesp}>上级节点 :</span>
            <span>{companyInfo.areaName || ''}</span>
          </div> */}
          <div className={styles.buttonContent}>
            <Button onClick={() => this.companyOrDepartmentEdit('info')}>修改公司信息</Button>
            <Button onClick={() => this.companyOrDepartmentEdit('dept')}>部门维护</Button>
          </div>
        </div>
        <div>
          <div className={styles.tabTitle}>部门维护</div>
          <div className={styles.selectContet}>
            <span style={{ marginRight: 16 }}>选择部门 :</span>
            <Select
              style={{ width: 180 }}
              value={departValue}
              onChange={this.changdepart}
              placeholder="请选择部门"
            >
              {departmentList.map(dep => {
                return (
                  <Option key={dep.id} value={dep.id}>
                    {dep.name}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className={styles.tabsContent}>
            <Tabs type="card">
              <TabPane tab="分组" key="1">
                <Button className={styles.addButton} onClick={() => this.addGroup()}>
                  添加分组
                </Button>
                <SimpleTable
                  bordered
                  columns={tcolumns}
                  className={styles.equipmentCTable}
                  dataSource={groupList}
                  pagination={false}
                />
              </TabPane>
              {/* <TabPane tab="人员" key="2">
                <Button className={styles.addButton}>添加人员</Button>
                <SimpleTable
                  bordered
                  columns={tcolumns}
                  className={styles.equipmentCTable}
                  dataSource={deptList}
                  pagination={false}
                />
              </TabPane> */}
            </Tabs>
            <ModalForm {...groupModalConfig} />
            <ModalForm {...modalConfig} />
            <SelectedPersonModal {...selectedPersonProps} />
            <UnSelectedPersonModal {...unSelectedPersonProps} />
            <Modal
              title="人员维护"
              width={840}
              onOk={this.onOk}
              onCancel={this.onCancel}
              visible={visible}
            >
              <CollapseTree treeData={treeData}>
                <Form className={styles.checkboxContet}>
                  <FormItem label="">
                    {getFieldDecorator('member', {
                      initialValue: ['1', '2', '5'],
                    })(<CheckboxGroup options={options} />)}
                  </FormItem>
                </Form>
              </CollapseTree>
            </Modal>
          </div>
        </div>
      </div>
    );
  };

  renderInfoContent = () => {
    const { getFieldDecorator } = this.props.form;
    const { areaList, companyInfo } = this.props.companyManageModel;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    return (
      <div>
        <div className={styles.infoTitle}>
          <img
            alt=""
            src="./mapicon/fanhui.png"
            onClick={() => this.setState({ contentType: 'list' })}
          />
          修改公司信息
        </div>
        <div className={styles.formContent}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <FormItem label="公司名称">
              {getFieldDecorator('name', {
                initialValue: companyInfo.name || '',
                rules: [
                  {
                    required: true,
                    message: '请输入公司名称!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="公司类型">
              {getFieldDecorator('type', {
                initialValue: companyInfo.type || '01',
                rules: [
                  {
                    required: true,
                    message: '请选择公司类型!',
                  },
                ],
              })(
                <Select>
                  <Option value="01">物业公司</Option>
                  <Option value="02">普通公司</Option>
                </Select>
              )}
            </FormItem>
            {/* <FormItem label="上级节点">
              {getFieldDecorator('areaId', {
                initialValue: companyInfo.areaId || null,
                rules: [
                  {
                    required: true,
                    message: '请输入上级节点!',
                  },
                ],
              })(
                <Select>
                  {areaList.map(area => {
                    return (
                      <Option value={area.id} key={area.id}>
                        {area.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem> */}
          </Form>
          <Col offset={5}>
            <Button onClick={this.updateCompanyInfo}>保存</Button>
            <Button onClick={this.deleteCompany}>删除</Button>
          </Col>
        </div>
      </div>
    );
  };

  renderDeptContent = () => {
    const {
      departModalTitle,
      demodalStatus,
      selectDeparts,
      departDelStatus,
      delDepartname,
    } = this.state;
    const tcolumns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        width: 764,
      },
      {
        title: '操作',
        render: (_, record) => (
          <div className={styles.opts}>
            <a onClick={() => this.addDepart(record)}>[修改名称]</a>
            <a onClick={() => this.delDepart(record)}>[删除部门]</a>
          </div>
        ),
      },
    ];

    const deModalConfig = {
      title: departModalTitle,
      state: demodalStatus,
      onOk: this.onDepartConfirm,
      onCancel: this.ondepartCancel,
      datas: [
        {
          type: 'input',
          field: 'name',
          label: '部门名称：',
          message: `请填写部门名称`,
          value: selectDeparts.length > 0 ? selectDeparts[0].name : '',
        },
      ],
    };

    const delDepartConfig = {
      title: '删除部门',
      state: departDelStatus,
      deleteComfirmTxt: delDepartname,
      onOk: this.departDelComfirm,
      onCancel: this.departDelCancel,
    };
    return (
      <div>
        <div className={styles.infoTitle}>
          <img
            alt=""
            src="./mapicon/fanhui.png"
            onClick={() => this.setState({ contentType: 'list' })}
          />
          部门维护
        </div>
        <ModalForm {...deModalConfig} />
        <DelModal {...delDepartConfig} />
        <div style={{ marginTop: 40 }}>
          <SimpleTable
            bordered
            columns={tcolumns}
            className={styles.equipmentCTable}
            dataSource={this.props.companyManageModel.departmentList}
            pagination={false}
          />
          <div className={styles.addDept} onClick={() => this.addDepart()}>
            <Icon type="plus-circle" />
            <span style={{ marginLeft: 6 }}>添加部门</span>
          </div>
        </div>
      </div>
    );
  };

  renderSider = () => {
    const {
      companyManageModel: { companyTree },
    } = this.props;
    const { contentType } = this.state;
    return (
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <div className={styles.treeContent}>
            <div className={styles.searchContet}>
              <Search placeholder="请选择" />
            </div>
            <div>
              <CommonSiderBar areaTreeList={companyTree} onAreaTreeSelect={this.onCompanySelect} />
            </div>
          </div>
          <div className={styles.addContent} onClick={this.addCompany}>
            <Icon type="plus-circle" />
            <span style={{ marginLeft: 6 }}>新增公司</span>
          </div>
        </div>
        <div className={styles.rightContent}>
          {contentType === 'list' && this.renderContent()}
          {contentType === 'info' && this.renderInfoContent()}
          {contentType === 'dept' && this.renderDeptContent()}
        </div>
      </div>
    );
  };

  render() {
    const { titles, titleImg } = this.state;
    return (
      <SettingContainer titles={titles} titleImg={titleImg}>
        {this.renderSider()}
      </SettingContainer>
    );
  }
}
export default companyManage;
