/**
 * Created by skyinno on 2019/5/6.消防历史纪录头部公共组件
 */
import React from 'react';
import { Form, Input, DatePicker, Select, Button, Row, Col } from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import './index.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

const HistorySearchBar = Form.create()(props => {
  const { form, onSubmit, onClick } = props;
  const { validateFields, getFieldDecorator } = form;
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((_, fvalues) => {
      let values = fvalues;

      console.log('fvalues===>', fvalues);
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

  const clear = values => {
    onClick(values);
  };

  return (
    <Form className="search_pannel"  onSubmit={e => handleSubmit(e)}>
      <Row className="row" style={{ minWidth: 1200 }}>
        <div style={{ width: 265, float: 'left', marginRight: 20 }}>
          <FormItem label="设备编码">
            {getFieldDecorator('deviceCode', { initialValue: '' })(
              <Input placeholder="设备编码关键词" />
            )}
          </FormItem>
        </div>
        <div style={{ width: 265, float: 'left', marginRight: 20 }}>
          <FormItem label="设备位置">
            {getFieldDecorator('deviceAddress', { initialValue: '' })(
              <Input placeholder="设备位置关键词" />
            )}
          </FormItem>
        </div>
        <div style={{ width: 440, float: 'left', marginRight: 20 }}>
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
        </div>
        <div style={{ width: 230, float: 'left', marginRight: 20 }}>
          <FormItem label="处理状态">
            {getFieldDecorator('status')(
              <Select placeholder="全部" allowClear>
                <Option value="01"> 未处理</Option>
                <Option value="02">处理中</Option>
                <Option value="03">已处理</Option>
              </Select>
            )}
          </FormItem>
        </div>
        <div style={{ width: 230, float: 'left' }}>
          <FormItem label="处理图片状态">
            {getFieldDecorator('handlePicStatus')(
              <Select placeholder="全部" allowClear>
                <Option value="01">未上传</Option>
                <Option value="02">已上传</Option>
              </Select>
            )}
          </FormItem>
        </div>
      </Row>
      <Col span={4} style={{ marginLeft: '0px', width: '30%' }}>
        <FormItem>
          <Button htmlType="submit" type="primary">
            查询
          </Button>
          <Button style={{ marginLeft: '15px',backgroundColor:'#D8EFFD' }} onClick={clear}>
            导出excel
          </Button>
        </FormItem>
      </Col>
    </Form>
  );
});
export default HistorySearchBar;
