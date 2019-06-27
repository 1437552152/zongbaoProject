/*
 * @Desc: 根据类型改变起止时间
 * @Author: Jackie
 * @Date: 2019-05-23 16:47:50
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-23 17:08:30
 */
import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

import LabelChild from '@/components/LabelChild';

const { WeekPicker } = DatePicker;

const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
class StartEndDate extends PureComponent {
  /**
   * onStartChange
   * onEndChange
   * type: hour day month year
   */

  // disabledStartDate = startValue => {
  //   const { endValue } = this.props;
  //   if (!startValue || !endValue) {
  //     return false;
  //   }
  //   return startValue.valueOf() > endValue.valueOf();
  // };

  // disabledStartDateTime = startValue => {
  //   const { endValue: ev } = this.props;
  //   const endValue = ev
  //   if (!startValue || !endValue) {
  //     return {
  //       disabledMinutes: () => range(0, 60),
  //       disabledSeconds: () => range(0, 60),
  //     }
  //   }
  //   const startArr = moment(startValue).toArray()
  //   const endArr = moment(endValue).toArray()
  //   if (startArr[0] < endArr[0] || startArr[1] < endArr[1] || startArr[2] < endArr[2]){
  //     return {
  //       disabledMinutes: () => range(0, 60),
  //       disabledSeconds: () => range(0, 60),
  //     }
  //   }
  //   return {
  //     disabledHours: () => range(endArr[3], 24),
  //     disabledMinutes: () => range(0, 60),
  //     disabledSeconds: () => range(0, 60),
  //   };
  // }

  // disabledEndDate = endValue => {
  //   const { startValue } = this.props
  //   if (!endValue || !startValue) {
  //     return false;
  //   }
  //   return endValue.valueOf() <= startValue.valueOf();
  // };

  // disabledEndDateTime = (endValue) => {
  //   const { startValue: sv } = this.props
  //   const startValue = sv
  //   if (startValue && endValue){
  //     const startArr = moment(startValue).add(1,'hours').toArray()
  //     const endArr = moment(endValue).toArray()
  //     if (startArr[0] < endArr[0] || startArr[1] < endArr[1] || startArr[2] < endArr[2]) {
  //       return {
  //         disabledMinutes: () => range(0, 60),
  //         disabledSeconds: () => range(0, 60),
  //       }
  //     }
  //     return {
  //       disabledHours: () => range(0, startArr[3]),
  //       disabledMinutes: () => range(0, 60),
  //       disabledSeconds: () => range(0, 60),
  //     };
  //   }
  //   return {
  //     disabledMinutes: () => range(0, 60),
  //     disabledSeconds: () => range(0, 60),
  //   }
  // }

  onStartChange = value => {
    // todo 校验时间
    const { onStartChange } = this.props;
    if (onStartChange) onStartChange(value);
  };

  onEndChange = value => {
    // todo 校验时间
    const { onEndChange } = this.props;
    if (onEndChange) onEndChange(value);
  };

  renderTime = (rest, isStart) => {
    const { type } = this.props;
    const params = rest;
    let show = false;
    if (type === 'hour') {
      show = true;
      params.showTime = { defaultValue: moment('00:00:00', 'HH:mm:ss') };
      params.format = 'YYYY-MM-DD HH';
      params.disabledTime = isStart ? this.disabledStartDateTime : this.disabledEndDateTime;
    }
    if (type === 'day') {
      show = true;
      params.mode = 'date';
      params.format = 'YYYY-MM-DD';
    }
    if (type === 'week') {
      return <WeekPicker {...params} />;
    }
    if (type === 'month') {
      show = true;
      params.mode = 'month';
      params.format = 'YYYY-MM';
    }
    if (type === 'year') {
      show = true;
      params.mode = 'year';
      params.format = 'YYYY';
    }
    if (show) {
      return <DatePicker {...params} />;
    }
  };

  renderStartTime = () => {
    const { startValue } = this.props;
    const rest = {
      disabledDate: this.disabledStartDate,
      value: startValue,
      onPanelChange: this.onStartChange,
      onChange: this.onStartChange,
      style: { minWidth: 40 },
    };
    return this.renderTime(rest, true);
  };

  renderEndTime = () => {
    const { endValue } = this.props;
    const rest = {
      disabledDate: this.disabledEndDate,
      value: endValue,
      onPanelChange: this.onEndChange,
      onChange: this.onEndChange,
      style: { minWidth: 40 },
    };
    return this.renderTime(rest);
  };

  render() {
    return (
      <>
        <LabelChild title="开始时间" child={this.renderStartTime()} />
        <LabelChild title="结束时间" child={this.renderEndTime()} />
      </>
    );
  }
}

export default StartEndDate;
