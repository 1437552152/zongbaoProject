/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * Created by skyinno on 2019/5/6.消防设备历史纪录公共组件
 */
import React from 'react';
import { Form, DatePicker, Select, Button, Row, Col } from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import styles from './index.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

const DeviceHistorySearchBar = Form.create()(props => {
  const { form, onSubmit, onClick } = props;
  const { validateFields, getFieldDecorator } = form;
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((_, fvalues) => {
      let values = fvalues;
      // 处理时间值
      if (values.time && values.time.length > 1) {
        values.alarmTime = moment(values.time[0]).format('YYYY-MM-DD HH:mm');
        values.lastUpdateDate = moment(values.time[1]).format('YYYY-MM-DD HH:mm');
      }
      if (values.recordTime && values.recordTime.length > 1) {
        values.alarmTime = moment(values.recordTime[0]).format('YYYY-MM-DD HH:mm');
        values.lastUpdateDate = moment(values.recordTime[1]).format('YYYY-MM-DD HH:mm');
      }
      values = lodash.omit(values, ['time', 'recordTime']);
      onSubmit(values);
    });
  };

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  const disabledDate = current => {
    return current && current > moment().endOf('day');
  }

  const disabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  }

  const disabledDateTime = () => {
    return {
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }


  return (
    <Form className={styles.main} onSubmit={e => handleSubmit(e)}>
      <Row className={styles.row} style={{ display: 'flex', minWidth: 1200 }}>
        <Col style={{ width: 440, marginRight: 20 }}>
          <FormItem label="报警时间">
            {getFieldDecorator('time', {})(
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
                showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
              />
            )}
          </FormItem>
        </Col>
        <Col style={{ width: 230, marginRight: 20 }}>
          <FormItem label="处理状态">
            {getFieldDecorator('status')(
              <Select placeholder="全部" allowClear>
                <Option value="01"> 未处理</Option>
                <Option value="02">处理中</Option>
                <Option value="03">已处理</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col style={{ width: 230 }}>
          <FormItem label="处理图片状态">
            {getFieldDecorator('handlePicStatus')(
              <Select placeholder="全部" allowClear>
                <Option value="01">未上传</Option>
                <Option value="02">已上传</Option>
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Col span={4} style={{ marginLeft: '0px', width: '30%' }}>
        <FormItem>
          <Button htmlType="submit" type="primary">
            查询
          </Button>
          <Button style={{ marginLeft: '15px',backgroundColor:'#D8EFFD'}} onClick={onClick}>
            导出excel
          </Button>
        </FormItem>
      </Col>
    </Form>
  );
});

export default DeviceHistorySearchBar;
