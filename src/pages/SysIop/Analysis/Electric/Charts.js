/*
 * @Desc: 负荷折线图
 * @Author: Jackie
 * @Date: 2019-05-23 16:46:34
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-23 17:36:56
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';

const Charts = props => {
  const { xData = [], maxValues = [], minValues = [], aveValues = [] } = props;

  const getOption = () => {
    const seriesLineCusStyle = {
      type: 'line',
      smooth: true,
      areaStyle: {},
      lineStyle: {
        normal: {
          color: 'rgba(223,197,178,0.5)',
        },
      },
      itemStyle: {
        normal: {
          color: 'rgba(223,197,178,0.5)',
        },
      },
    };
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        bottom: 10,
        data: ['最大负荷', '最小负荷', '平均负荷'],
      },
      grid: {
        left: '2%',
        right: '3%',
        top: '3%',
        bottom: 60,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xData,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          height: 20,
          bottom: 30,
          handleIcon:
            'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '120%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
        },
      ],
      series: [
        {
          name: '最大负荷',
          data: maxValues,
          ...seriesLineCusStyle,
        },
        {
          name: '最小负荷',
          data: minValues,
          ...seriesLineCusStyle,
        },
        {
          name: '平均负荷',
          data: aveValues,
          ...seriesLineCusStyle,
        },
      ],
    };
  };

  return <ReactEcharts option={getOption()} notMerge style={{ width: '100%', height: '100%' }} />;
};
export default Charts;
