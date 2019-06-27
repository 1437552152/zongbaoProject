/*
 * @Desc: 时间区间选择，根据类型改变区间类型，type: year,day,month,year
 * @Author: Jackie
 * @Date: 2019-05-23 17:20:08
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-23 17:20:48
 */
import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
class StartEndDate extends PureComponent {
  onChange = values => {
    const { onDateChange } = this.props;
    if (onDateChange) onDateChange(values[0], values[1]);
  };

  getSomeParams = () => {
    const { type } = this.props;
    let rest;
    switch (type) {
      case 'hour':
        rest = {
          showTime: [
            { defaultValue: moment('00:00:00', 'HH:mm:ss') },
            { defaultValue: moment('00:00:00', 'HH:mm:ss') },
          ],
          format: 'YYYY-MM-DD HH',
        };
        break;
      case 'day':
        rest = {};
        break;
      case 'month':
        rest = {
          mode: ['month', 'month'],
        };
        break;
      case 'year':
        rest = {
          mode: ['year', 'year'],
        };
        break;
      default:
        rest = undefined;
        break;
    }
    return rest;
  };

  render() {
    const someParams = this.getSomeParams();
    if (!someParams) {
      return false;
    }
    const { startValue, endValue } = this.props;
    const params = {
      ...someParams,
      value: [startValue, endValue],
      style: { width: '100%' },
      onChange: this.onChange,
      onPanelChange: this.onChange2,
    };
    return <RangePicker {...params} />;
  }
}

export default StartEndDate;
