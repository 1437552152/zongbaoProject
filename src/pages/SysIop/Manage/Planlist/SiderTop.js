/*
 * @Desc: 侧边栏顶部自定义element
 * @Author: Jackie
 * @Date: 2019-05-23 16:47:10
 * @Last Modified by: yeyifu
 * @Last Modified time: 2019-05-24 10:21:07
 */
import React, { PureComponent } from 'react';
import { Button, Select, Typography } from 'antd';
import LabelChild from '@/components/LabelChild';
// import StartEndDate from './StartEndDate'
import StartEndDate2 from './StartEndDate2';

import styles from './index.less';

const { Title } = Typography;
const { Option } = Select;

export default class SiderTop extends PureComponent {
  state = {
    startValue: null,
    endValue: null,
  };

  renderType = () => {
    return (
      <Select style={{ width: '100%' }} onChange={value => this.setState({})}>
        <Option value="1">类型1</Option>
        <Option value="2">类型2</Option>
        <Option value="3">类型3</Option>
      </Select>
    );
  };

  renderData = () => {
    return (
      <Select style={{ width: '100%' }} onChange={value => this.setState({})}>
        <Option value="1">部门1</Option>
        <Option value="2">部门2</Option>
        <Option value="3">部门3</Option>
      </Select>
    );
  };

  renderCategory = () => {
    return (
      <Select style={{ width: '100%' }} onChange={value => this.setState({ categoryType: value })}>
        <Option value="1">张三</Option>
        <Option value="2">李四</Option>
        <Option value="3">王二麻子</Option>
      </Select>
    );
  };

  renderStatus = () => {
    return (
      <Select style={{ width: '100%' }} onChange={value => this.setState({ categoryType: value })}>
        <Option value="1">张三</Option>
        <Option value="2">李四</Option>
        <Option value="3">王二麻子</Option>
      </Select>
    );
  };

  // ==================datepicker===================

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  // ===================datepicker====end======
  renderTime = rest => {
    const { categoryType } = this.state;
    if (categoryType === '1') {
      return <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" {...rest} />;
    }
  };

  renderStartTime = () => {
    const { startValue } = this.state;
    const rest = {
      disabledDate: this.disabledStartDate,
      value: startValue,
      onChange: this.onStartChange,
    };
    return this.renderTime(rest);
  };

  renderEndTime = () => {
    const { endValue } = this.state;
    const rest = {
      disabledDate: this.disabledEndDate,
      value: endValue,
      onChange: this.onEndChange,
    };
    return this.renderTime(rest);
  };

  renderSiderTop = () => {
    const { categoryType, endValue, startValue } = this.state;
    const { onSearch } = this.props;
    return (
      <div className={styles.siderTop}>
        <div className={styles.siderTopTitleContainer}>
          <Title level={4}>计划类型</Title>
          <Button type="primary" size="small" onClick={() => onSearch && onSearch(this.state)}>
            筛选
          </Button>
        </div>

        <LabelChild title="计划类型" child={this.renderType()} />
        <LabelChild title="计划部门" child={this.renderData()} />
        <LabelChild title="部门负责人" child={this.renderCategory()} />
        <LabelChild title="完成状态" child={this.renderStatus()} />
        <LabelChild title="统计类别" child={this.renderStartTime()} />

        {/* <StartEndDate
          type={categoryType}
          startValue={startValue}
          endValue={endValue}
          onStartChange={(value) => this.setState({ startValue: value })}
          onEndChange={(value) => this.setState({ endValue: value })}
        /> */}
        <StartEndDate2
          type={categoryType}
          startValue={startValue}
          endValue={endValue}
          onDateChange={(start, end) => this.setState({ startValue: start, endValue: end })}
        />
      </div>
    );
  };

  render() {
    return this.renderSiderTop();
  }
}
