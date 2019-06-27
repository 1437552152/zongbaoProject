import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import styles from './EchartContainer.less';

class EchartContainer extends React.PureComponent {
  static propTypes = {
    ChartData: PropTypes.arrayOf(
      PropTypes.objectOf({
        name: PropTypes.string,
        value: PropTypes.string,
        color: PropTypes.string,
      })
    ).isRequired,
  };

  getstatusOption = ChartData => {
    const arrayName = [];
    const arrayValue = [];
    const arrayColor = [];
    for (let i = 0; i < ChartData.length; i += 1) {
      const item = ChartData[i];
      arrayName.push(item.name);
      arrayValue.push({ value: item.value, name: item.name });
      arrayColor.push(item.color);
    }
    const statusOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      calculable: true,
      series: [
        {
          type: 'pie',
          radius: '75%',
          center: ['50%', '40%'],
          itemStyle: {
            normal: {
              color(params) {
                return arrayColor[params.dataIndex];
              },
              label: { formatter: '{b} ：{c}' },
            },
          },
          data: arrayValue,
        },
      ],
    };
    return statusOption;
  };

  render() {
    const { ChartData } = this.props;
    return (
      <div className={styles.echartmain}>
        <div className={styles.echartDiv}>
          <ReactEcharts
            option={this.getstatusOption(ChartData)}
            style={{ height: '220px', width: '380px' }}
          />
        </div>
      </div>
    );
  }
}

export default EchartContainer;
