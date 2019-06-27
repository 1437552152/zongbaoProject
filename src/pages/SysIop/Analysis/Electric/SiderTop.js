/*
 * @Desc: 侧边栏顶部自定义element
 * @Author: Jackie
 * @Date: 2019-05-23 16:47:10
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-23 17:21:42
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
      <Select style={{ width: '100%' }} onChange={value => this.setState({ tType: value })}>
        <Option value="1">负荷</Option>
      </Select>
    );
  };

  renderData = () => {
    return (
      <Select style={{ width: '100%' }} onChange={value => this.setState({ dataType: value })}>
        <Option value="1">A相</Option>
      </Select>
    );
  };

  onCategoryChange = value => {
    const { categoryType } = this.state;
    if (categoryType !== value) {
      this.setState({
        categoryType: value,
        startValue: null,
        endValue: null,
      });
    }
  };

  renderCategory = () => {
    return (
      <Select style={{ width: '100%' }} onChange={this.onCategoryChange}>
        <Option value="hour">按小时统计</Option>
        <Option value="day">按日统计</Option>
        <Option value="month">按月统计</Option>
        <Option value="year">按年统计</Option>
      </Select>
    );
  };

  renderSiderTop = () => {
    const { categoryType, endValue, startValue } = this.state;
    const { onSearch } = this.props;
    return (
      <div className={styles.siderTop}>
        <div className={styles.siderTopTitleContainer}>
          <Title level={4}>时间类型</Title>
          <Button type="primary" size="small" onClick={() => onSearch && onSearch(this.state)}>
            筛选
          </Button>
        </div>

        <LabelChild title="统计类型" child={this.renderType()} />
        <LabelChild title="统计数据" child={this.renderData()} />
        <LabelChild title="统计类别" child={this.renderCategory()} />
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
