/**
 * Created by skyinno on 2019/5/7.跨区域相关的消防历史纪录
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin, Modal, Form, Input,Icon,Upload,message,Select } from 'antd';
import StandTable from '../StandardTable';
import HistorySearchBar from '../HistorySearchBar/index';
import styles from './FireControlListPage.less';
import { FireControlByRegionListPageColumns } from '../ColumnsPlubic';
// import ModalForm from '@/components/Setting/ModalForm';
import StandardCard from '@/components/StandardCard';
import Host  from  '../../../../../../config/url.config'

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const { Option } = Select;
const getValue = obj =>Object.keys(obj).map(key => obj[key]).join(',');

@Form.create()
@connect(({ firecontrolhistory, loading }) => ({
  firecontrolhistory,
  loading: loading.models.firecontrolhistory,
}))
class FireControlByRegionListPage extends PureComponent {
  // static getDerivedStateFromProps(nextProps) {
  //   if ('value' in nextProps) {
  //     return {
  //       ...(nextProps.value || {}),
  //     };
  //   }
  //   return null;
  // }

  constructor(props) {
    super(props);
    // const value = props.value || {};
    this.state = { 
      loading:false,
      selectPersons: [], 
      visible: false,
      visibleL:false,
      visibleN:false,
      current:1,
      pageSize:10,
      total:1,    
      data:[],
      infopicCode: '',
      previewVisible: false,
      previewImage: '',
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

componentDidMount() {
  this.getlist();
}


getlist=()=>{
  const {
    dispatch,
    match: {
      params: { id },
    },
  } = this.props;
 const {current,pageSize} =this.state;
  const values = {
    page:current,
    pageSize,
    areaId: id,
    Q: 'type_S_LK=001',
  };
  this.setState({ formValues: values });
  dispatch({
    type: 'firecontrolhistory/getFireControlByRegionList',
    payload: values,
    callback:(list)=>{
      console.log(list);
      const {data:{data,length,page}}=list;
      this.setState({data,current:page,pageSize,total:length})
    }
  });
}

// 查询
  onSearch = values => {
    const { dispatch} = this.props;
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
      type: 'firecontrolhistory/getFireControlByRegionList',
      payload: xxx,
    });
  };

  // 导出按钮
  clear = values => {
    const { dispatch} = this.props;
    const { formValues ,current,pageSize} = this.state;
    const { areaId, Q } = formValues;
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
      type: 'firecontrolhistory/getFireControlByRegionList',
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
        type: 'firecontrolhistory/getFireControlByRegionList',
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
              visible: false,
              visibleL: false,
              visibleN:false,
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
              visible: false,
              visibleL: false,
              visibleN: false,
            });
          }       
        },
      });
      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  // 处理图片状态
  onComfirmPicSta = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const { dispatch } = this.props;
        const { selectPersons } = this.state;
        const {id} = selectPersons[0]
        const {handlePicStatus} = values
          dispatch({
          type: 'firecontrolhistory/updatetheStatus',
          payload: {
            id,
            handlePicStatus
          },
          callback: data => {
            if(data===200){
              this.getlist()
              this.setState({
                visible: false,
                visibleL: false,
                visibleN:false,
              });
            }       
          },
        });
      }
    });
  };

  // 图片上传确定按钮
  onComfirmPic = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (values.alarmPicId !== undefined) {
          const { dispatch } = this.props;
          const { selectPersons, infopicCode } = this.state;
          const { id } = selectPersons[0];
          const handlePicId = infopicCode;
          dispatch({
            type: 'firecontrolhistory/updatetheStatus',
            payload: {
              id,
              handlePicId,
              handlePicStatus: '02',
            },
            callback: data => {
              if (data === 200) {
                this.getlist();
                this.setState({
                  visible: false,
                  visibleL: false,
                  visibleN: false,
                });
              }
            },
          });
        } else {
          message.error('您还没有上传图片！');
        }
      }
    });
  };

  onCancel = () => {
    this.setState({
      visible: false,
      visibleL: false,
      visibleN: false,
      previewVisible: false,
    });
  };
  
// 点击处理详情td
  onDetail = (id,listData) => {
    this.setState({
      visibleL: true,
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
      selectPersons: [
        {
          status: listData,
          id,
        },
      ],
    });
  };
  
  // 点击处理图片td
  onPic = (id,handlePicId) => {
    this.setState({
      visible: true,
      selectPersons: [
        {
          handlePicId,
          id,
        },
      ],
    });
  }

  // 图片上传
  onUploadChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
          infopicCode: info.fileList[0].response.entity
        }),
      );
    }
  };
  
    normFile = e => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    };
 
  // 点击处理图片状态td  
  onPicStatus = (id,handlePicStatus) => {
    console.log(id,handlePicStatus);
    this.setState({
      visibleN: true,
      modalStatus: 2,
      selectPersons: [
        {
          handlePicStatus,
          id
        },
      ],
    });
  }
  
    // 查看图片
    lookPic = (id,handlePicId) => {
      this.setState({previewImage:`${Host}/services/monitor/wdfile/check/${handlePicId}`})
      this.setState({
        previewImage:`${Host}/services/monitor/wdfile/check/${handlePicId}`,
        previewVisible: true,
      });
    };

  render() {
    const { loading, form:{getFieldDecorator}} = this.props;
    const {data,total,pageSize,current,previewImage} = this.state;
    const searchbarProps = {
      onSubmit: this.onSearch,
      partyTypes: '1',
      onClick: this.clear,
    };
    const tableProps = {
      rowKey: 'id',
      bordered: true,
      columns: FireControlByRegionListPageColumns({ onDelete: this.onDelete,onDetail: this.onDetail, onStatus: this.onStatus, onPic: this.onPic, onPicStatus:this.onPicStatus,lookPic:this.lookPic}),
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
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">请选择上传图片</div>
      </div>
    );
    const { imageUrl } = this.state;

    return (
      <div className={styles.mainlst}>
        <StandardCard src="./assets/MaintenanceEquipment/peizhi.png" className={styles.mainlast2}>
          <Spin spinning={loading}>
            <HistorySearchBar {...searchbarProps} />
            <div className={styles.tableCount}>
              <StandTable {...tableProps} />
              {/* <ModalForm {...modalGetStatus} /> */}
              <Modal 
                className={styles.main} 
                visible={this.state.visibleL}
                onOk={() => this.onComfirmDetail()}
                onCancel={() => this.onCancel()}
              >
                <Form>
                  <Form.Item label='appName'>
                    {getFieldDecorator('appName', {
                      rules: [{ required: true}],
                      initialValue:'处理详情',
                    })(<Input />)}
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                title='图片上传' 
                className={styles.main} 
                visible={this.state.visible}
                destroyOnClose
                onOk={() => this.onComfirmPic()}
                onCancel={() => this.onCancel()}
              >
                <Form.Item>
                  {getFieldDecorator('alarmPicId', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                  })(
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={`${Host}/services/monitor/file/upload`}
                      withCredentials="true"
                      beforeUpload={beforeUpload}
                      onChange={this.onUploadChange}
                    >
                      {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                    </Upload>
                  )}
                </Form.Item>
              </Modal>
              <Modal 
                className={styles.main} 
                visible={this.state.visibleN}
                onOk={() => this.onComfirmPicSta()}
                onCancel={() => this.onCancel()}
              >
                <Form.Item key="handlePicStatus" {...this.formLayout} label="处理图片状态">
                  {getFieldDecorator('handlePicStatus', {
                    initialValue: '已上传',
                  })(
                    <Select style={{ width: '100%' }}>
                      <Option value="01">未上传</Option>
                      <Option value="02">已上传</Option>
                    </Select>
                  )}
                </Form.Item>
              </Modal>
              <Modal
                title="查看图片"
                className={styles.main}
                visible={this.state.previewVisible}
                destroyOnClose
                footer={null}
                mask={false}
                onCancel={() => this.onCancel()}
              >
                <img alt="example" style={{ width: '100%',marginBottom:24 }} src={previewImage} />
              </Modal>
            </div>
          </Spin>
        </StandardCard>
      </div>
    );
  }
}

export default FireControlByRegionListPage;
