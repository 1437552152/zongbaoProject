/* eslint-disable no-undef */
/* eslint-disable object-shorthand */
/* eslint-disable react/destructuring-assignment */
/**
 * Created by skyinno on 2019/5/7.消防设备历史纪录
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin, Modal, Form, Input } from 'antd';
import StandTable from '../StandardTable';
import DeviceHistorySearchBar from '../DeviceHistorySearchBar/index';
import styles from './FireControlListPage.less';
import { loadAssociateTableColumns } from '../ColumnsPlubic';
import StandardCard from '@/components/StandardCard';
// import icon from '@/assets/MaintenanceEquipment/peizhi.png';
import ModalForm from '@/components/Setting/ModalForm';

const getValue = obj =>Object.keys(obj).map(key => obj[key]).join(',');
@Form.create()
@connect(({ firecontrolhistory, loading }) => ({
  firecontrolhistory,
  loading: loading.models.firecontrolhistory,
}))
class FireControlDeviceListPage extends PureComponent {
  state = { 
    selectPersons: [], 
    modalStatus: 0,
    visible: false,
    current:1,
    pageSize:10,
    total:1,    
    data:[],
    formValues: {
      type,
    },
  };

  componentDidMount() {
   this.getlist();
  }

  getlist=()=>{
    const {
      dispatch,
      match: {
        params: { id,type },
      },
    } = this.props;

    const {current,pageSize} =this.state;
    
    const values = {
      page:current,
      pageSize,
      areaId: id,
      type,
      Q: 'type_S_LK=001',
    };
    this.setState({ formValues: values });
    dispatch({
      type: 'firecontrolhistory/getFireControlList',
      payload: values,
      callback:(list)=>{
        const {data:{data,length,page}}=list;
        this.setState({data,current:page,pageSize,total:length})
      }
    });
  }

  // 查询
  onSearch = values => {
    const { dispatch } = this.props;
    const {current,pageSize} = this.state;
    const { type } = this.state.formValues;
    this.setState({ formValues: values });
    const xxx = Object.assign(values, {
      page:current,
      pageSize,
    });
    xxx.Q = Q;
    xxx.areaId = areaId;
    xxx.type = type;
    dispatch({
      type: 'firecontrolhistory/getFireControlList',
      payload: xxx,
    });
  };

  // 导出按钮
  clear = values => {
    const { dispatch } = this.props;
    const { formValues ,current,pageSize} = this.state;
    const { areaId, Q } = formValues;
    this.setState({ formValues: values });
    const xxx = Object.assign(values, {
      page:current,
      pageSize,
    });
    xxx.Q = Q;
    xxx.areaId = areaId;
    dispatch({
      type: 'firecontrolhistory/exportsExc',
      payload: xxx,
    });
  };

  // 分页
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'firecontrolhistory/getFireControlList',
      payload: params,
      callback:list => {
        this.setState({data:list.data.data,current:list.data.page,pageSize:list.data.pageSize,total:list.data.length})
        }
    });
  };

  // 删除
  onDelete = id => {
    const { dispatch } = this.props;
    // this.setState({formValues: values});
    dispatch({
      type: 'firecontrolhistory/deleteData',
      payload: { id },
      callback: data => {
        this.delcallback(data);
      },
    });
  };

  delcallback = e => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const values = { ...formValues, page: 1 };
    if (e === 200) {
      dispatch({
        type: 'firecontrolhistory/getFireControlList',
        payload: values,
      });
    }
  };

  // 处理状态
  onComfirm = (values, states) => {
    const { dispatch } = this.props;
    const { selectPersons } = this.state;
    const param = values;
    if (states) {
      const dispatchType = states === 1 ? 'firecontrolhistory/updatetheDetail' : 'firecontrolhistory/updatetheStatus';
      if (states === 2) {
        param.id = selectPersons[0].id;
      }
      dispatch({
        type: dispatchType,
        payload: param,
        callback: data => {
          if(data===200){
            this.getlist()
            this.setState({
              modalStatus: 0,
              visible: false,
            });
          }       
        },
      });
    }
  };
 
  // 处理详情
  onComfirmDetail = () => {
    const { dispatch,form } = this.props;
    const { selectPersons } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const dispatchType = 'firecontrolhistory/updatetheStatus';
      dispatch({
        type: dispatchType,
        payload: {
          id:selectPersons[0].id,
          statusDesp:values.statusDesp
        },
        callback: data => {
          if(data===200){
            this.getlist()
            selectPersons[0].statusDesp = values.statusDesp
            this.setState({
              modalStatus: 0,
              visible: false,
            });
          }       
        },
      });
      // console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  onCancel = () => {
    this.setState({
      modalStatus: 0,
      visible: false,
    });
  };

// 点击处理详情td
onDetail = (id,listData) => {
  this.setState({
    visible: true,
    modalStatus: 2,
    selectPersons: [
      {
        statusDesp:listData,
        id
      },
    ],
  });
};

// 点击处理状态td
onStatus = (id,listData) => {
  this.setState({
    modalStatus: 2,
    selectPersons: [
      {
        status: listData,
        id,
      },
    ],
  });
};
  

  render() {
    const {
      loading,
      form:{getFieldDecorator}
    } = this.props;

    const {
      modalTitle,
      modalStatus,
      data,
      selectPersons,
      total,
      pageSize,
      current
    } = this.state;

    const searchbarProps = {
      onSubmit: this.onSearch,
      partyTypes: '1',
      onClick: this.clear,
    };

    const tableProps = {
      rowKey: 'id',
      bordered: true,
      // columns,
      columns: loadAssociateTableColumns({ onDelete: this.onDelete,onDetail: this.onDetail, onStatus: this.onStatus }),
      data:{
        list:data,
        pagination: {
         total,
         pageSize,
         current,
         showTotal: total => {
           return `共 ${total} 条`;
         },
       },
       },
       onChange: this.handleTableChange,  
    };

    const modalGetStatus = {
      title: modalTitle,
      state: modalStatus,
      onOk: this.onComfirm,
      onCancel: this.onCancel,
      datas: [
        {
          type: 'select',
          field: 'status',
          label: '处理状态：',
          message: '请选择处理状态',
          value: selectPersons.length > 0 ? selectPersons[0].status : '',
          datas: {
            options: [{ value: '00', title: '已处理' }, { value: '01', title: '未处理' }, { value: '02', title: '处理中' }],
          },
        },
      ],
    };

    return (
      // <StandardCard src={icon}>
      <div className={styles.mainlst}>
        <StandardCard src="./assets/MaintenanceEquipment/peizhi.png" className={styles.mainlast2}>
          <Spin spinning={loading}>
            <DeviceHistorySearchBar {...searchbarProps} />
            {/* <div> */}
            <div className={styles.tableCount}>
              <StandTable {...tableProps} />
              <ModalForm {...modalGetStatus} />
              <Modal 
                className={styles.main} 
                visible={this.state.visible}
                onOk={() => this.onComfirmDetail()}
                onCancel={() => this.onCancel()}
              >
                <Form>
                  <Form.Item label='处理图片详情'>
                    {getFieldDecorator('statusDesp', {
                      // rules: [{ required: true, message: item.message }],
                      initialValue: '图片详情',
                    })(<Input />)}
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </Spin>
        </StandardCard>
      </div>
    );
  }
}

export default FireControlDeviceListPage;
