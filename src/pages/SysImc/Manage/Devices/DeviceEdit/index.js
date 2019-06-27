import React, { PureComponent } from 'react';
import { Card, Button, Form, Col, Row, Input, Upload, Icon, DatePicker, Spin, Select } from 'antd';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import lodash from 'lodash';
import router from 'umi/router';
import moment from 'moment';
import styles from './index.less';
import loadData from './Entity/index';
import StandardCard from '@/components/StandardCard';
import CardHeader from './CardHeader';
import HorizontalLine from './CardHeader/HorizontalLine';
import devicepng from '@/assets/device.png';

const { Option } = Select;
const StatusList = [
  { id: '001', name: '报警信息' },
  { id: '002', name: '通信错误' },
  { id: '003', name: '无法连接' },
  { id: '004', name: '正常' },
];

@connect(({ deviceEdit, loading, equipmentC }) => ({
  deviceEdit,
  equipmentC,
  loading:
    loading.effects['deviceEdit/addDevice'] ||
    loading.effects['deviceEdit/fetchDeviceByid'] ||
    loading.effects['deviceEdit/updatetheDevice'],
  uploading: loading.effects['deviceEdit/uploadFile'],
}))
@Form.create()
class DeviceEdit extends PureComponent {
  constructor(props) {
    super(props);
    const {
      location: { pathname, query },
    } = props;

    this.type = query.type || '01';
    this.subType = query.subType;

    const match = pathToRegexp('/imc/manage/devices/deviceedit').exec(pathname);
    if (match) {
      // 编辑
      this.isEdit = true;
      this.id = query.id || '';
    } else {
      // 添加
      this.isEdit = false;
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;

    this.clearModel();

    if (this.isEdit) {
      // 根据id获取详情
      dispatch({
        type: 'deviceEdit/fetchDeviceByid',
        payload: this.id,
      });
    } else {
      // 获取区域树形结构
      dispatch({ type: 'deviceEdit/getAreaList' });
    }
  }

  clearModel = () => {
    // 清空数据
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceEdit/save',
      payload: {
        device: {},
        picId: '',
        picUrl: '',
        areaList: [],
        buildingList: [],
        floorList: [],
        roomList: [],
      },
    });
  };

  goBackAndRefresh = () => {
    const { dispatch } = this.props;
    router.goBack();
    dispatch({
      type: 'equipmentC/fetchDeviceListBySubType',
      payload: { type: this.subType, page: 1 },
    });
  };

  updatetheDevice = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceEdit/updatetheDevice',
      payload,
      callback: this.goBackAndRefresh,
    });
  };

  addDevice = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceEdit/addDevice',
      payload,
      callback: this.goBackAndRefresh,
    });
  };

  onSelectChange = (name, value) => {
    const {
      dispatch,
      deviceEdit,
      form: { setFieldsValue },
    } = this.props;
    const { areaList, buildingList, floorList } = deviceEdit;

    if (name === 'area') {
      const area = areaList.find(item => `${item.id}` === value);
      if (area && area.children) {
        dispatch({
          type: 'deviceEdit/save',
          payload: {
            buildingList: area.children || [],
            floorList: [],
            roomList: [],
          },
        });
      }

      setFieldsValue({
        building: null,
        floor: null,
        areaId: null,
      });
    } else if (name === 'building') {
      const building = buildingList.find(item => `${item.id}` === value);
      if (building && building.children) {
        dispatch({
          type: 'deviceEdit/save',
          payload: {
            floorList: building.children || [],
            roomList: [],
          },
        });
      }

      setFieldsValue({
        floor: null,
        areaId: null,
      });
    } else if (name === 'floor') {
      const floor = floorList.find(item => `${item.id}` === value);
      if (floor && floor.children) {
        dispatch({
          type: 'deviceEdit/save',
          payload: {
            roomList: floor.children || [],
          },
        });
      }

      setFieldsValue({
        areaId: null,
      });
    }
  };

  onCancel = () => {
    router.goBack();
  };

  onSubmit = () => {
    const {
      deviceEdit: { picId = '' },
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const results = lodash.omit(values, ['area', 'building', 'floor']);
      results.type = this.subType;
      if (`${picId}`.length > 0) {
        results.picId = picId;
      }

      if (this.isEdit) {
        results.id = this.id;
        this.updatetheDevice(results);
      } else {
        this.addDevice(results);
      }
    });
  };

  renderCardInfo = info => {
    const {
      deviceEdit,
      form: { getFieldDecorator },
    } = this.props;

    const { areaList, buildingList, floorList, roomList } = deviceEdit;

    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const loadItem = item => {
      if (item.type === 1) {
        return (
          <Form.Item label={item.label}>
            {getFieldDecorator(`${item.name}`, {
              rules: item.rules,
              initialValue: `${item.initialValue}`.length > 0 ? moment(item.initialValue) : null,
            })(<DatePicker />)}
          </Form.Item>
        );
      }

      if (item.type === 2) {
        let data = [];
        if (item.name === 'area') {
          data = areaList;
        } else if (item.name === 'building') {
          data = buildingList;
        } else if (item.name === 'floor') {
          data = floorList;
        } else if (item.name === 'areaId') {
          data = roomList;
        } else if (item.name === 'status') {
          data = StatusList;
        }

        return (
          <Form.Item label={item.label}>
            {getFieldDecorator(`${item.name}`, {
              rules: item.rules,
              initialValue: `${item.initialValue}`.length > 0 ? `${item.initialValue}` : undefined,
            })(
              <Select
                placeholder={item.placeholder}
                onChange={value => this.onSelectChange(item.name, value)}
              >
                {data.map(it => (
                  <Option key={it.id} value={`${it.id}`}>
                    {it.name || ''}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        );
      }

      return (
        <Form.Item label={item.label}>
          {getFieldDecorator(`${item.name}`, {
            rules: item.rules,
            initialValue: item.initialValue,
          })(<Input placeholder={item.placeholder} />)}
        </Form.Item>
      );
    };

    return (
      <Card key={JSON.stringify(info).substr(0, 16)} className={styles.card} bordered={false}>
        <Form layout="horizontal" {...formItemLayout} labelAlign="left" hideRequiredMark>
          <Row gutter={24}>
            {info.map(item => (
              <Col span={24} key={item.name} style={{ display: 'block' }}>
                {loadItem(item)}
              </Col>
            ))}
          </Row>
        </Form>
      </Card>
    );
  };

  renderImage = () => {
    const { deviceEdit, uploading } = this.props;
    const { picUrl = '' } = deviceEdit;
    const uploadProps = {
      name: 'avatar',
      action: '',
      listType: 'picture-card',
      accept: 'image/*',
      withCredentials: true,
      showUploadList: false,
      beforeUpload: file => {
        const { dispatch } = this.props;
        dispatch({
          type: 'deviceEdit/uploadFile',
          payload: file,
        });
        return false;
      },
    };
    return (
      <Card key="image" className={styles.imageCard} bordered={false}>
        <Upload {...uploadProps}>
          {`${picUrl}`.length > 0 ? (
            <img style={{ width: 270, height: 180 }} src={picUrl} alt="图片" />
          ) : (
            // eslint-disable-next-line react/jsx-indent
            <Button style={{ width: 270, height: 180 }}>
              <Icon type={uploading ? 'loading' : 'upload'} />
              {uploading ? '正在上传照片' : '请上传照片'}
            </Button>
          )}
        </Upload>
      </Card>
    );
  };

  render() {
    const { deviceEdit, loading } = this.props;
    const { device } = deviceEdit;
    const { basicInfo = [], commonInfo = [] } = loadData(this.type, this.subType, device);
    return (
      <StandardCard style={{ minWidth: 1200 }} src={devicepng}>
        <Spin spinning={loading || false}>
          <div className={styles.container}>
            <div>
              <CardHeader title="基本信息" />
              <div className={styles.basicInfo}>
                {basicInfo.map((item, index) => {
                  if (item.mark === 'card') {
                    if (index === basicInfo.length - 1) {
                      return this.renderCardInfo(item.info);
                    }
                    return [
                      this.renderCardInfo(item.info),
                      <div key={item.key} style={{ flex: 1, minWidth: 24 }} />,
                    ];
                  }
                  if (item.mark === 'image') {
                    return this.renderImage();
                  }
                  return [
                    <div key={item.key} style={{ flex: 1, minWidth: 24 }} />,
                    <div key={`${item.key}div`} className={styles.card} />,
                  ];
                })}
              </div>
            </div>
            <div className={styles.bottomContent}>
              {commonInfo.map(item => {
                if (item.mark === 'card') {
                  return [
                    <div key={item.key}>
                      <CardHeader title={item.name} />
                      {this.renderCardInfo(item.info)}
                    </div>,
                    <div key={`${item.key}div`} style={{ flex: 1, minWidth: 24 }} />,
                  ];
                }

                if (item.mark === 'image') {
                  return this.renderImage();
                }

                return <div key={item.key} className={styles.imageCard} />;
              })}
            </div>
            <HorizontalLine />
            <div style={{ paddingLeft: 126, paddingTop: 20 }}>
              <Button type="primary" style={{ width: 126 }} onClick={this.onSubmit}>
                保存
              </Button>
              <Button type="primary" style={{ marginLeft: 27, width: 126 }} onClick={this.onCancel}>
                取消
              </Button>
            </div>
          </div>
        </Spin>
      </StandardCard>
    );
  }
}
export default DeviceEdit;
