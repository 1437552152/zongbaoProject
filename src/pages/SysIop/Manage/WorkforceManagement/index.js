import React, { PureComponent } from 'react';
import { Tabs, Spin } from 'antd';
import StandardCard from '@/components/StandardCard';
import logo from '@/assets/setting.png';
import { connect } from 'dva';
import styles from './index.less';
import Tab from './tab';
import { getWeekStartEnd, getWeekDays } from './exportFun';

const { TabPane } = Tabs;

@connect(({ workforceManagement, loading }) => ({
  workforceManagement,
  loading: loading.models.workforceManagement,
}))
class WorkforceManagement extends PureComponent {
  state = {
    tableymd: [], // length = 2, 某周的开始和结束时间 YYYY-MM-DD
    weekDays: [], // [{date: M月DD日,week: 星期几}]
  };

  componentDidMount() {
    this.initWeekData(0);
  }

  request = () => {
    const { dispatch } = this.props;
    const { tableymd } = this.state;
    const values = {
      schemeId: 1,
      startTime: tableymd[0],
      endTime: tableymd[1],
    };
    dispatch({
      type: 'workforceManagement/schedulelist',
      payload: values,
    });
  };

  onTabClick = e => {
    let week = 0;
    switch (Number(e)) {
      case 1:
        week = -1;
        break;
      case 2:
        week = 0;
        break;
      case 3:
        week = 1;
        break;
      default:
        week = 1;
    }
    // -1 上周，0 本周 1 下周
    this.initWeekData(week);
  };

  initWeekData = (week = 0) => {
    const tableymd = getWeekStartEnd(week);
    const weekDays = getWeekDays(tableymd[0]);
    this.setState({ weekDays, tableymd }, () => {
      this.request();
    });
  };

  render() {
    const { weekDays } = this.state;
    const {
      workforceManagement: { data },
      loading,
    } = this.props;
    const weeks = ['上一周', '本 周', '下一周'];
    return (
      <StandardCard src={logo} full>
        <Spin spinning={loading}>
          <div className={styles.card_container}>
            <Tabs type="card" onTabClick={this.onTabClick} defaultActiveKey="2">
              {weeks.map((item, i) => (
                <TabPane tab={item} key={(i + 1).toString()}>
                  <Tab weekDays={weekDays} dataSource={data} />
                </TabPane>
              ))}
            </Tabs>
          </div>
        </Spin>
      </StandardCard>
    );
  }
}
export default WorkforceManagement;
