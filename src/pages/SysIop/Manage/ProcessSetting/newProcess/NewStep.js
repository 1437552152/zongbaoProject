import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Col, Row, Modal, Collapse, Radio, message } from 'antd';
import classnames from 'classnames';
import Mytree from './tree';
// import CommonSiderBar from '@/components/CommonSiderBar';

import styles from './newProcess.less';

const { TextArea } = Input;
const { Panel } = Collapse;
@connect(({ newProcess }) => ({
  newProcess,
}))
@Form.create()
class NewStep extends PureComponent {
  state = {
    modal2Visible: false,
    expandIconPosition: 'right',
    processData: [],
    treeArr: [],
    persongroup: [],
    audit: { Radioname: '', id: '' },
    currentindex: 0,
    flagCur: false,
    copyprocessData: 0,
    flag: false,
    flowId: 0,
    sortnumber: 0,
    status: 0,
  };

  componentDidMount() {
    const { flowId } = this.props;
    this.setState({ flowId }, () => {
      this.getStep();
      this.getGroup();
    });
  }

  // 监听props值得变化
  componentWillReceiveProps(nextProps) {
    const { flowId } = this.state;
    if (nextProps.flowId !== flowId) {
      this.setState({ flowId: nextProps.flowId }, () => {
        this.getStep();
        this.getGroup();
      });
    }
  }

  // 获取所有组
  getGroup = () => {
    const values = {};
    const { dispatch } = this.props;
    dispatch({
      type: 'newProcess/getGroupData',
      payload: values,
      callback: res => {
        this.getGroupcallback(res);
      },
    });
  };

  // 获取组树中的数据
  getGroupcallback = res => {
    console.log('resres==>', res);

    this.setState({ treeArr: res.data });
  };

  // 渲染步骤
  getStep = () => {
    const { flowId } = this.state;
    const values = { flowId };
    const { dispatch } = this.props;
    dispatch({
      type: 'newProcess/flowstep',
      payload: values,
      callback: res => {
        this.getcallback(res);
      },
    });
  };

  getcallback = res => {
    this.setState({ status: res.status });

    const {
      form: { setFieldsValue },
      addprocess,
      flowId,
      flagCur,
    } = this.props;
    addprocess();
    // 如果返回的数据为空，则默认有一个表单;否则正常显示
    if (res.data.length === 0) {
      this.setState({ processData: [] }, () => {
        const processData = [];
        const params = {};
        params.flowId = flowId;
        params.name = '';
        params.userId = '';
        params.detail = '';
        params.orders = 1;
        params.keypoint = '新建中';
        params.times = '';
        params.auditName = '';
        params.approvalStatus = '-1';
        processData.push(params);
        this.setState({ processData, flagCur: !flagCur });
      });
    } else {
      this.setState({ processData: res.data, copyprocessData: res.data.length }, () => {
        res.data.forEach((item, index) => {
          setFieldsValue({
            [`name${index}`]: item.name,
            [`auditName${index}`]: item.auditName,
            [`times${index}`]: item.times,
            [`detail${index}`]: item.detail,
            [`keypoint${index}`]: item.keypoint,
          });
        });
      });
    }
  };

  // 确认提交审核
  sureForm = () => {
    const { flowId } = this.state;
    const values = { flowId };
    const { dispatch } = this.props;
    dispatch({
      type: 'newProcess/commitstep',
      payload: values,
      callback: () => {
        this.getStep();
      },
    });
  };

  // 点击确认
  onComfirm = (i, e) => {
    const { form } = this.props;
    const { flowId, processData, audit } = this.state;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (
        values[`auditName${i}`] !== '' &&
        values[`auditName${i}`] !== undefined &&
        values[`name${i}`] !== '' &&
        values[`name${i}`] !== undefined&&
        values[`name${i}`].length<50 &&
        values[`times${i}`] !== '' &&
        values[`times${i}`] !== undefined&&
        values[`times${i}`].length<50 &&
        values[`detail${i}`] !== '' &&
        values[`detail${i}`] !== undefined&&
        values[`detail${i}`].length<1000 &&
        values[`keypoint${i}`] !== '' &&
        values[`keypoint${i}`] !== undefined&&
        values[`keypoint${i}`].length<50
      ) {
        const value = {};
        value.flowId = flowId;
        value.name = values[`name${processData.length - 1}`];
        value.userId = audit.id;
        value.detail = values[`detail${processData.length - 1}`];
        value.orders = processData.length;
        value.keypoint = values[`keypoint${processData.length - 1}`];
        value.times = values[`times${processData.length - 1}`];
        const { dispatch } = this.props;
        dispatch({
          type: 'newProcess/flowstepCreate',
          payload: value,
          callback: () => {
            this.getStep();
          },
        });
      } else if (err) {
        return false;
      }
    });
  };

  // 修改
  updateForm = (values1, i) => {
    console.log('values1===>', values1);
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (
        values[`auditName${i}`] !== '' &&
        values[`auditName${i}`] !== undefined &&
        values[`name${i}`] !== '' &&
        values[`name${i}`] !== undefined &&
        values[`name${i}`].length<50 &&
        values[`times${i}`] !== '' &&
        values[`times${i}`] !== undefined &&
        values[`times${i}`].length<50&&
        values[`detail${i}`] !== '' &&
        values[`detail${i}`] !== undefined &&
        values[`detail${i}`].length<1000&&
        values[`keypoint${i}`] !== '' &&
        values[`keypoint${i}`] !== undefined&&
        values[`keypoint${i}`].length<50
      ) {
        const params = {};
        params.id = values1.id;
        params.name = values[`name${i}`];
        params.times = values[`times${i}`];
        params.userId = values1.userId;
        params.detail = values[`detail${i}`];
        params.keypoint = values[`keypoint${i}`];
        const { dispatch } = this.props;
        dispatch({
          type: 'newProcess/flowstepUpdate',
          payload: params,
          callback: () => {
        
            this.getStep();
          },
        });
      } else if (err) {
        return false;
      }
    });
  };

  // 选择人员的模态框消失
  setModal2Visible = () => {
    this.setState({ modal2Visible: false });
  };

  // 折叠面板
  callback = key => {
    console.log(key);
  };

  // 点击输入框审核人员弹出
  inputOnClick = i => {
    this.setState({ modal2Visible: true, currentindex: i });
  };

  // 删除表单
  deleteForm = item => {
    const values = { id: item.id };
    const { dispatch } = this.props;
    const { processData } = this.state;

    if (item && item.id) {
      dispatch({
        type: 'newProcess/flowstepDelete',
        payload: values,
        callback: () => {
          this.getStep();
        },
      });
    } else {
      processData.pop();
      console.log(processData);
      const { flag,flowId,flagCur } = this.state;
       if(processData.length===0){
        this.setState({ processData: [] }, () => {
          const processDat = [];
          const params = {};
          params.flowId = flowId;
          params.name = '';
          params.userId = '';
          params.detail = '';
          params.orders = 1;
          params.keypoint = '新建中';
          params.times = '';
          params.auditName = '';
          params.approvalStatus = '-1';
          processDat.push(params);
          this.setState({ processData:processDat, flagCur: !flagCur });
        });
       }else{
        this.setState({ processData, flag: !flag });
       }
    }
  };

  // 单选框选择
  radiogroupChange = e => {
    const { audit, currentindex,processData} = this.state;
    audit.id = e.target.value;
    audit.Radioname = e.target.Radioname;
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      [`auditName${currentindex}`]: audit.Radioname,
    });
    processData[currentindex].userId=e.target.value;
    processData[currentindex].auditName=e.target.Radioname
    this.setState({ audit,processData });
  };

  // 人员数据
  onpesonData = res => {
    this.setState({ persongroup: res.data });
  };

  // 新增表单
  addform = () => {
    const { processData, flagCur, copyprocessData, flowId, status } = this.state;

    if (status === '1') {
      message.error('已提交审核,不能再添加步骤');
      return false;
    }
    if (processData[0].approvalStatus==='-1') {
      message.error(`请完善新增步骤${processData.length}`);
      return false;
    }
    if (processData.length > copyprocessData) {
      message.error(`请完善新增步骤${processData.length}`);
      return false;
    }
    const params = {};
    params.flowId = flowId;
    params.name = '';
    params.userId = '';
    params.detail = '';
    params.orders = processData.length + 1;
    params.keypoint = '新建中';
    params.times = '';
    params.auditName = '';
    params.approvalStatus = '-1';
    processData.push(params);
    this.setState({ processData, flagCur: !flagCur });
  };

  // 表单
  text = (i, item) => {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { status } = this.state;

    const wrapform = (
      <div className={styles.box}>
        <Form {...formItemLayout} onSubmit={e => this.onComfirm(i, e)} labelAlign="left">
          <Form.Item label="步骤名称" className={styles.eqModalItem}>
            {getFieldDecorator(`name${i}`, {
              rules: [{ required: true, message: '请填写步骤名称' },{
                max:50,
                message: '长度不能大于50个字符',
              }],
              initialValue: '',
            })(
              <Input
                disabled={item && item.approvalStatus !== '3' && item.approvalStatus !== '-1'}
              />
            )}
          </Form.Item>
          <Form.Item label="审批人员：" className={styles.eqModalItem}>
            {getFieldDecorator(`auditName${i}`, {
              rules: [{ required: true, message: '请选择审批人员' }],
            })(
              <Input
                onClick={() => this.inputOnClick(i)}
                disabled={item && item.approvalStatus !== '3' && item.approvalStatus !== '-1'}
                readonly="readonly"
              />
            )}
          </Form.Item>

          <Form.Item label="步骤时间点：" className={styles.eqModalItem}>
            {getFieldDecorator(`times${i}`, {
              rules: [{ required: true, message: '请选择步骤时间点' },{
                max:50,
                message: '长度不能大于50个字符',
              }],
            })(
              <Input
                disabled={item && item.approvalStatus !== '3' && item.approvalStatus !== '-1'}
              />
            )}
          </Form.Item>
          <Form.Item label="步骤内容：" className={styles.eqModalItem}>
            {getFieldDecorator(`detail${i}`, {
              rules: [{ required: true, message: '请填写步骤内容' },{
                max:1000,
                message: '长度不能大于1000个字符',
              }],
            })(
              <TextArea
                autosize={{ minRows: 4, maxRows: 10 }}
                disabled={item && item.approvalStatus !== '3' && item.approvalStatus !== '-1'}
              />
            )}
          </Form.Item>
          <Form.Item label="步骤关键点：" className={styles.eqModalItem}>
            {getFieldDecorator(`keypoint${i}`, {
              rules: [{ required: true, message: '请填写步骤关键点' },{
                max:50,
                message: '长度不能大于50个字符',
              }],
            })(
              <Input
                disabled={item && item.approvalStatus !== '3' && item.approvalStatus !== '-1'}
              />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 18, offset: 6 },
            }}
            style={{ marginTop: 20 }}
          >
            <Button
              className={classnames(styles.btn, 'red_btn')}
              type="primary"
              onClick={() => this.deleteForm(item)}
              style={status && status === '1' ? { display: 'none' } : {}}
            >
              删除
            </Button>
            <Button
              className={classnames(styles.btn, 'blue_btn')}
              onClick={() => this.updateForm(item, i)}
              type="primary"
              style={item.approvalStatus === '3' ? {} : { display: 'none' }}
            >
              编辑
            </Button>

            <Button
              className={classnames(styles.btn, 'blue_btn')}
              type="primary"
              htmlType="submit"
              style={status === '1' || item.approvalStatus === '3' ? { display: 'none' } : {}}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
    return wrapform;
  };

  head = (item, hideFirst, hideLast, onClick) => {
    let colorBg;
    switch (item.approvalStatus) {
      case '0':
        colorBg = styles.nopasss;
        break;
      case '1':
        colorBg = styles.passs;
        break;
      case '2':
        colorBg = styles.audit;
        break;
      case '3':
        colorBg = styles.uncommitted;
        break;
      default:
        colorBg = styles.uncommitted;
    }

    return (
      <div className={styles.Collapsehead} onClick={onClick}>
        <div className={styles.subscriptContainer}>
          <div className={styles.line} style={hideFirst ? { display: 'none' } : {}} />
          <div className={styles.subscript} style={item.orders===1?{marginTop:'10px'}:{}}>
            <span>{item.orders}</span>
            {/* <span>{hideFirst}</span> */}
          </div>
          <div className={styles.line} style={hideLast ? { display: 'none' } : {}} />
        </div>

        {item.approvalStatusDesp && <span className={colorBg}>{item.approvalStatusDesp}</span>}
        <span className={styles.approvalStatus}>{item.keypoint}</span>
      </div>
    );
  };

  render() {
    const {
      modal2Visible,
      processData,
      expandIconPosition,
      treeArr,
      persongroup,
      status,
    } = this.state;
    const arr = [];
    processData.map((item, index) => {
      arr.push((index + 1).toString());
    });
    console.log("arr==>",arr);
    return (
      <div className={styles.equipmenCMain}>
        <Modal
          title="领导架构"
          width={840}
          centered
          destroyOnClose
          visible={modal2Visible}
          onOk={() => this.setModal2Visible(false)}
          onCancel={() => this.setModal2Visible(false)}
        >
          <div className={styles.modalContainer}>
            <div style={{ width: 278 }}>
              {/* <CommonSiderBar areaTreeList={treeArr} onAreaTreeSelect={this.onAreaTreeSelect} /> */}
              <Mytree treeArr={treeArr} onpesonData={this.onpesonData} />
            </div>
            <div className={styles.modalContent}>
              <Radio.Group
                name="radiogroup"
                size="small"
                onChange={e => this.radiogroupChange(e)}
                defaultValue=""
              >
                {persongroup && persongroup.length > 0 ? (
                  persongroup.map((item,index) => {
                    return (
                      <Radio
                        value={item.id}
                        className={styles.radiochioce}
                        Radioname={item.name}
                        style={{ width: 110 }}
                      >
                        {item.name}
                      </Radio>
                    );
                  })
                ) : (
                  <div>暂无人员</div>
                )}
              </Radio.Group>
            </div>
          </div>
        </Modal>
        <div>
          <div className={styles.processASListMain}>
            {arr && arr.length > 0 ? (
              <Collapse
                activeKey={arr}
                onChange={this.callback}
                expandIconPosition={expandIconPosition}
              >
                {processData.map((item, i) => (
                  <Panel header={this.head(item, i === 0)} key={(i + 1).toString()}>
                    <div>{this.text(i, item)}</div>
                  </Panel>
                ))}
                <div className={styles.add_step}>
                  {this.head({ orders: '+', keypoint: '添加流程步骤' }, false, true, () => {
                    this.addform();
                  })}
                </div>
              </Collapse>
            ) : null}
          </div>
          <div className={styles.auditsure} style={status === '1' ? { display: 'none' } : {}}>
            <Button
              className={classnames(styles.btn, 'red_btn')}
              type="primary"
              onClick={this.sureForm}
            >
              提交审核
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default NewStep;
