import React, { PureComponent } from 'react';
import { Form, Row, Col, TreeSelect, Select, DatePicker, Input, Divider, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import StandardCard from '@/components/StandardCard';
import styles from './index.less';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
const { Option } = Select;
const { TextArea } = Input;

@Form.create()
@connect(({ malfunction, loading }) => ({
  malfunction,
  loading: loading.models.malfunction,
}))
class DispatchWorkOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      buildings: [],
      floors: [],
      rooms: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchOrderTypes(dispatch);
    this.fetchProcess(dispatch);
    this.fetchResponsibleMember(dispatch);
    this.fetchDepartment(dispatch);
    this.fetchfLevel(dispatch);
    this.fetchMember(dispatch);
    this.fetchAreaTreeWithRoom(dispatch);
  }

  fetchOrderTypes = dispatch => {
    dispatch({
      type: 'malfunction/fetchOrderTypes',
    });
  };

  fetchProcess = dispatch => {
    dispatch({
      type: 'malfunction/fetchProcess',
    });
  };

  fetchResponsibleMember = dispatch => {
    dispatch({
      type: 'malfunction/fetchResponsibleMember',
    });
  };

  fetchDepartment = dispatch => {
    dispatch({
      type: 'malfunction/fetchDepartment',
    });
  };

  fetchfLevel = dispatch => {
    dispatch({
      type: 'malfunction/fetchfLevel',
    });
  };

  fetchMember = dispatch => {
    dispatch({
      type: 'malfunction/fetchMember',
    });
  };

  fetchAreaTreeWithRoom = dispatch => {
    dispatch({
      type: 'malfunction/fetchAreaTreeWithRoom',
    });
  };

  onAreaChange = value => {
    const {
      malfunction: { areaTreeWithRoom },
      form,
    } = this.props;
    const { setFieldsValue } = form;
    let buildings = [];
    for (let i = 0; i < areaTreeWithRoom.length; i += 1) {
      const area = areaTreeWithRoom[i];
      if (`${area.id}` === value) {
        if (area.children) {
          buildings = area.children;
        }
        break;
      }
    }
    setFieldsValue({
      building: null,
      floor: null,
      areaId: null,
    });
    this.setState({
      buildings,
      floors: [],
      rooms: [],
    });
  };

  onBuildingChange = value => {
    const { form } = this.props;
    const { buildings } = this.state;
    const { setFieldsValue } = form;
    let floors = [];
    for (let i = 0; i < buildings.length; i += 1) {
      const building = buildings[i];
      if (`${building.id}` === value) {
        if (building.children) {
          floors = building.children;
        }
        break;
      }
    }
    setFieldsValue({
      floor: null,
      room: null,
    });
    this.setState({
      floors,
      rooms: [],
    });
  };

  onFloorChange = value => {
    const { form } = this.props;
    const { floors } = this.state;
    const { setFieldsValue } = form;
    let rooms = [];
    for (let i = 0; i < floors.length; i += 1) {
      const floor = floors[i];
      if (`${floor.id}` === value) {
        if (floor.children) {
          rooms = floor.children;
        }
        break;
      }
    }
    setFieldsValue({
      areaId: null,
    });
    this.setState({
      rooms,
    });
  };

  onRoomChange = value => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({
      areaId: value,
    });
  };

  onSubmit = () => {
    const { form, dispatch, match } = this.props;
    const { id } = match.params;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const data = values;
      const start = data.startTime.format('YYYY-MM-DD HH:mm:ss');
      const end = data.endTime.format('YYYY-MM-DD HH:mm:ss');
      data.startTime = start;
      data.endTime = end;
      dispatch({
        type: 'malfunction/createOrder',
        payload: { id, data },
        callback: () => {
          router.goBack();
        },
      });
    });
  };

  onCancel = () => {
    router.goBack();
  };

  orderTypeItem = getFieldDecorator => {
    const {
      malfunction: { orderTypes },
    } = this.props;
    return (
      <Col span={12}>
        <FormItem label="类型">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择类型' }],
          })(
            <Select placeholder="请选择类型" style={{ width: '100%' }}>
              {orderTypes.map(ele => {
                return <Option key={ele.code}>{ele.desp}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  processItem = getFieldDecorator => {
    const {
      malfunction: { processTree },
    } = this.props;
    const loop = data => {
      return data.map(item => {
        if (item.children && item.children.length) {
          return (
            <TreeNode
              selectable={false}
              key={`${item.fid}-${item.id}`}
              value={item.id}
              title={item.name}
            >
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={`${item.fid}-${item.id}`} value={item.id} title={item.name} />;
      });
    };
    return (
      <FormItem label="流程选择">
        {getFieldDecorator('flowId', {
          rules: [{ required: true, message: '请选择流程' }],
        })(
          <TreeSelect style={{ width: '100%' }} placeholder="请选择流程">
            {loop(processTree)}
          </TreeSelect>
        )}
      </FormItem>
    );
  };

  responsibleMemberItem = getFieldDecorator => {
    const {
      malfunction: { responsibleMember },
    } = this.props;
    return (
      <Col span={12}>
        <FormItem label="责任人">
          {getFieldDecorator('responsibilityUserId', {
            rules: [{ required: true, message: '请选择责任人' }],
          })(
            <Select style={{ width: '100%' }} placeholder="请选择责任人">
              {responsibleMember.map(member => {
                return <Option key={member.id}>{member.name}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  dispatchTimeItem = getFieldDecorator => {
    return (
      <Col span={12}>
        <FormItem label="派工时间">
          {getFieldDecorator('startTime', {
            rules: [{ required: true, message: '请选择派工时间' }],
          })(<DatePicker showTime style={{ width: '100%' }} />)}
        </FormItem>
      </Col>
    );
  };

  responsibleDepartmentItem = getFieldDecorator => {
    const {
      malfunction: { departmentList },
    } = this.props;
    return (
      <FormItem label="责任部门">
        {getFieldDecorator('responsibilityDepartment', {
          rules: [{ required: true, message: '请选择责任部门' }],
        })(
          <Select placeholder="请选择责任部门" style={{ width: '100%' }}>
            {departmentList.map(department => {
              return <Option key={department.id}>{department.name}</Option>;
            })}
          </Select>
        )}
      </FormItem>
    );
  };

  coordinationDepartmentItem = getFieldDecorator => {
    const {
      malfunction: { departmentList },
    } = this.props;
    return (
      <Col span={12}>
        <FormItem label="配合部门">
          {getFieldDecorator('coordinateDepartment', {
            rules: [{ required: true, message: '请选择配合部门' }],
          })(
            <Select placeholder="请选择配合部门" style={{ width: '100%' }}>
              {departmentList.map(department => {
                return <Option key={department.id}>{department.name}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  completeTimeItem = getFieldDecorator => {
    return (
      <Col span={12}>
        <FormItem label="完工时间">
          {getFieldDecorator('endTime', {
            rules: [{ required: true, message: '请选择完工时间' }],
          })(<DatePicker showTime style={{ width: '100%' }} />)}
        </FormItem>
      </Col>
    );
  };

  levelItem = getFieldDecorator => {
    const {
      malfunction: { levelList },
    } = this.props;
    return (
      <FormItem label="派工级别">
        {getFieldDecorator('grade', {
          rules: [{ required: true, message: '请选择派工级别' }],
        })(
          <Select placeholder="请选择派工级别" style={{ width: '100%' }}>
            {levelList.map(level => {
              return <Option key={level.id}>{level.desp}</Option>;
            })}
          </Select>
        )}
      </FormItem>
    );
  };

  contentItem = getFieldDecorator => {
    return (
      <FormItem label="工作项目">
        {getFieldDecorator('project', {
          rules: [
            { required: true, message: '请输入工作项目' },
            { max: 50, message: '工作项目最多可输入50个字' },
          ],
        })(<Input style={{ width: '100%' }} />)}
      </FormItem>
    );
  };

  memberItem = getFieldDecorator => {
    const {
      malfunction: { memberList },
    } = this.props;
    return (
      <FormItem label="派工人员">
        {getFieldDecorator('personId', {
          rules: [{ required: true, message: '请选择派工人员' }],
        })(
          <Select placeholder="请选择派工人员" style={{ width: '100%' }}>
            {memberList.map(member => {
              return <Option key={member.id}>{member.name}</Option>;
            })}
          </Select>
        )}
      </FormItem>
    );
  };

  descriptionItem = getFieldDecorator => {
    const layout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
    };
    return (
      <Col span={24}>
        <FormItem label="派工描述" {...layout}>
          {getFieldDecorator('description', {
            rules: [
              { required: true, message: '请输入派工描述' },
              { max: 1000, message: '派工描述最多可输入1000个字' },
            ],
          })(<TextArea rows={4} style={{ width: '100%' }} />)}
        </FormItem>
      </Col>
    );
  };

  areaItem = getFieldDecorator => {
    const {
      malfunction: { areaTreeWithRoom },
    } = this.props;
    return (
      <Col span={12}>
        <FormItem label="所属区域">
          {getFieldDecorator('area', {
            rules: [{ required: true, message: '请选择所属区域' }],
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择所属区域"
              onChange={this.onAreaChange}
            >
              {areaTreeWithRoom.map(area => {
                return <Option key={area.id}>{area.name}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  buildingItem = getFieldDecorator => {
    const { buildings } = this.state;
    return (
      <Col span={12}>
        <FormItem label="所属建筑">
          {getFieldDecorator('building', {
            rules: [{ required: true, message: '请选择所属建筑' }],
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择所属建筑"
              onChange={this.onBuildingChange}
            >
              {buildings.map(b => {
                return <Option key={b.id}>{b.name}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  floorItem = getFieldDecorator => {
    const { floors } = this.state;
    return (
      <Col span={12}>
        <FormItem label="所属楼层">
          {getFieldDecorator('floor', {
            rules: [{ required: true, message: '请选择所属楼层' }],
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择所属楼层"
              onChange={this.onFloorChange}
            >
              {floors.map(f => {
                return <Option key={f.id}>{f.name}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  roomItem = getFieldDecorator => {
    const { rooms } = this.state;
    return (
      <Col span={12}>
        <FormItem label="所属房间">
          {getFieldDecorator('areaId', {
            rules: [{ required: true, message: '请选择所属房间' }],
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择所属房间"
              onChange={this.onRoomChange}
            >
              {rooms.map(r => {
                return <Option key={r.id}>{r.name}</Option>;
              })}
            </Select>
          )}
        </FormItem>
      </Col>
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const itemlayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
      labelAlign: 'left',
    };

    return (
      <StandardCard full src="./assets/menu/time-s.png" bodyStyle={{ paddingTop: 0 }}>
        <Divider />
        <Row gutter={24}>
          <Col span={8}>
            <Form {...itemlayout}>
              {this.processItem(getFieldDecorator)}
              {this.responsibleDepartmentItem(getFieldDecorator)}
              {this.levelItem(getFieldDecorator)}
              {this.contentItem(getFieldDecorator)}
              {this.memberItem(getFieldDecorator)}
            </Form>
          </Col>
          <Col span={16}>
            <Form {...itemlayout}>
              {this.responsibleMemberItem(getFieldDecorator)}
              {this.dispatchTimeItem(getFieldDecorator)}
              {this.coordinationDepartmentItem(getFieldDecorator)}
              {this.completeTimeItem(getFieldDecorator)}
              {this.descriptionItem(getFieldDecorator)}
              {this.orderTypeItem(getFieldDecorator)}
            </Form>
          </Col>
        </Row>
        <Divider />
        <Form {...itemlayout}>
          <Row>
            <Col span={16}>
              {this.areaItem(getFieldDecorator)}
              {this.buildingItem(getFieldDecorator)}
              {this.floorItem(getFieldDecorator)}
              {this.roomItem(getFieldDecorator)}
            </Col>
            <Col span={16} push={3}>
              <FormItem>
                <Button className={styles.button} type="primary" onClick={this.onSubmit}>
                  添加
                </Button>
                <Button className={styles.button} type="primary" onClick={this.onCancel}>
                  取消
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </StandardCard>
    );
  }
}

export default DispatchWorkOrder;
