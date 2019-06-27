/*
 * @Desc: 电力分析
 * @Author: Jackie
 * @Date: 2019-05-21 15:02:05
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-23 17:36:13
 */
import React, { PureComponent } from 'react';
import { Table } from 'antd';

import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';

import SiderTop from './SiderTop';
import Charts from './Charts';

import styles from './index.less';

class Electric extends PureComponent {
  state = {
    showSider: true,
  };

  onAreaTreeSelect = (selectedKeys, e) => {
    console.log(
      '====onTreeSelect',
      selectedKeys,
      e,
      e && e.selectedNodes && e.selectedNodes.length > 0 && e.selectedNodes[0].props.dataRef
    );
    this.setState({ curTreeData: e.selectedNodes[0].props.dataRef });
  };

  onSiderTopSearch = values => {
    console.log('=====onSiderTopSearch=', values);
  };

  renderSider = () => {
    const areaTreeList = [
      {
        id: 1,
        name: '父节点',
        children: [
          {
            id: 2,
            name: '子节点',
            children: [
              {
                id: 17,
                name: '子节点',
              },
            ],
          },
          {
            id: 3,
            name: '子节点2',
          },
          {
            id: 4,
            name: '子节点2',
          },
          {
            id: 5,
            name: '子节点2',
          },
        ],
      },
      {
        id: 6,
        name: '父节点',
        children: [
          {
            id: 7,
            name: '子节点',
          },
          {
            id: 8,
            name: '子节点2',
          },
          {
            id: 9,
            name: '子节点2',
          },
          {
            id: 10,
            name: '子节点2',
          },
        ],
      },
    ];

    return (
      <CommonSiderBar
        areaTreeList={areaTreeList}
        onAreaTreeSelect={this.onAreaTreeSelect}
        renderTop={<SiderTop onSearch={this.onSiderTopSearch} />}
      />
    );
  };

  // header 的数据 需要后台根据树选择返回
  renderContentHeader = () => {
    const { curTreeData } = this.state;
    return (
      <div className={styles.contentHeader}>
        <span>{curTreeData && curTreeData.name}</span>
        <div className={styles.center}>
          <span>类型：负荷</span>
          <span>数组：A相</span>
        </div>
        <span>按小时统计：2019-05-10 10:15—23:15</span>
      </div>
    );
  };

  renderContentCenter = () => {
    const params = {
      xData: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      maxValues: [3800, 3900, 4000, 4100, 3600, 3800, 4000],
      minValues: [1800, 1900, 2000, 1100, 1600, 3800, 2000],
      aveValues: [2800, 2900, 3000, 2100, 2600, 3800, 3000],
    };

    return (
      <div style={{ height: 500, marginLeft: 16 }}>
        <Charts {...params} />
      </div>
    );
  };

  renderContentFooter = () => {
    const columns = [
      {
        title: '信息名称',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '平均值（KW）',
        key: 'ave',
        dataIndex: 'ave',
      },
      {
        title: '最大值',
        children: [
          {
            title: '值（KW）',
            key: 'maxValue',
            dataIndex: 'maxValue',
          },
          {
            title: '时间',
            key: 'maxTime',
            dataIndex: 'maxTime',
          },
        ],
      },
      {
        title: '最小值',
        children: [
          {
            title: '值（KW）',
            key: 'minValue',
            dataIndex: 'minValue',
          },
          {
            title: '时间',
            key: 'minTime',
            dataIndex: 'minTime',
          },
        ],
      },
    ];
    const dataSource = [
      {
        name: '总负荷',
        ave: '2800',
        maxValue: '3500',
        maxTime: '2019-05-10 11:22',
        minValue: '1200',
        minTime: '2019-05-10 10:11',
      },
    ];
    const params = {
      bordered: true,
      columns,
      pagination: { pageSize: 12 },
      dataSource,
    };
    return <Table {...params} />;
  };

  renderContent = () => {
    const { showSider } = this.state;
    const style = {};
    if (showSider) style.marginLeft = 8;
    return (
      <div className={styles.contentContainer} style={style}>
        {this.renderContentHeader()}
        {this.renderContentCenter()}
        {this.renderContentFooter()}
      </div>
    );
  };

  render() {
    return (
      <SiderContent
        sider={this.renderSider()}
        content={this.renderContent()}
        onSiderChange={show => this.setState({ showSider: show })}
      />
    );
  }
}

export default Electric;
