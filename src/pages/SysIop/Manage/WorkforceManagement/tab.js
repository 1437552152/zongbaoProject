import React, { PureComponent } from 'react';
import { Table, Button } from 'antd';
import styles from './index.less';

class Tab extends PureComponent {
  state = {};

  swit = (type, desp) => {
    return <div className={styles[`td-${type}`]}>{desp}</div>;
  };

   getFirstEle = () => {
    return (
      <div className={styles.firstTitleContainer}>
        <span style={{ float: 'left', marginTop: 35, marginLeft: 14 }}>小组</span>
        <span style={{ float: 'right', marginTop: 12, marginRight: 16 }}>日期</span>
      </div>
    );
  };

  getTitleEle = weekDay => {
    return (
      <div className={styles.commonTitleContainer}>
        <span className={styles.date}>{weekDay.date}</span>
        <span className={styles.week}>{weekDay.week}</span>
      </div>
    );
  };

  getColumn = weekDays => {
    const keys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return [
      {
        title: this.getFirstEle(),
        width: 140,
        render: (text, record, index) => `${index + 1}组`,
      },
      ...keys.map((item, i) => {
        return {
          title: this.getTitleEle(weekDays[i]),
          dataIndex: `${item}Desp`,
          key: `${item}Desp`,
          render: (text, record) => this.swit(record[item], text),
        };
      })
    ];
  };

  render() {
    const { weekDays, dataSource } = this.props;
    if (!weekDays || weekDays.length !== 7) {
      return false;
    }
    const columns = this.getColumn(weekDays);

    return (
      <div>
        <Table
          className={styles.tableContainer}
          bordered
          dataSource={dataSource || null}
          columns={columns}
          pagination={false}
          footer={() => {
            return (
              <div className={styles.print}>
                <Button type="primary">新建分组</Button>
                <Button type="primary">编辑</Button>
                <Button type="primary">保存</Button>
                <Button type="primary">打印</Button>
              </div>
            );
          }}
        />
      </div>
    );
  }
}
export default Tab;
