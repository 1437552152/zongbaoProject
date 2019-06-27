import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import OverviewTable from './OverviewTable';
import { WarningType } from '../config';
import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';
import StandardCard from '@/components/StandardCard';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ malfunction, loading }) => ({
  malfunction,
  loading: loading.models.malfunction,
}))
class Overview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentArea: '-1', // currentArea值为-1时,表示无区域的筛选,查询的是所有报警记录
      currentTreePath: '0', // 树的节点路径
    };
  }

  componentDidMount() {
    this.fetchAreaTree();
  }

  fetchAreaTree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'malfunction/fetchAreaTree',
      payload: { type: '2', id: '1' },
      callback: areaTree => {
        if (areaTree.length === 0) {
          return;
        }
        const area = areaTree[0];
        this.setState({
          currentArea: area.id,
          currentTreePath: '0-0',
        });
        this.fetchWarningCount(area.id);
      },
    });
  };

  fetchWarningCount = areaId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'malfunction/fetchWarnings',
      payload: areaId,
    });
  };

  onAreaTreeSelect = (selectedKeys, e) => {
    const key = selectedKeys[0];
    const node = e.selectedNodes[0];
    this.setState({
      currentArea: key,
      currentTreePath: node.props.pos,
    });
    this.fetchWarningCount(key);
  };

  treePath = () => {
    const {
      malfunction: { areaTree },
    } = this.props;
    let location = '武汉';
    if (areaTree.length !== 0) {
      const { currentTreePath } = this.state;
      const paths = currentTreePath.split('-');
      let areas = areaTree;
      for (let i = 1; i < paths.length; i += 1) {
        const index = parseInt(paths[i], 10);
        const area = areas[index];
        location += ` > ${area.name}`;
        areas = area.children;
      }
    }
    return location;
  };

  renderContent = () => {
    const {
      malfunction: {
        totalAlarm,
        realTimeAlarm,
        loadRateAlarm,
        lineLossAlarm,
        contractLoadRateAlarm,
        energyAlarm,
      },
    } = this.props;
    const { currentArea } = this.state;
    const location = this.treePath();
    const unprocessedWarningCount =
      realTimeAlarm + loadRateAlarm + lineLossAlarm + contractLoadRateAlarm + energyAlarm;
    const tabConfigs = [
      {
        title: `实时报警(${realTimeAlarm}条)`,
        key: WarningType.realTime,
      },
      {
        title: `负荷率报警(${loadRateAlarm}条)`,
        key: WarningType.load,
      },
      {
        title: `线损报警(${lineLossAlarm}条)`,
        key: WarningType.cable,
      },
      {
        title: `契约负荷率报警(${contractLoadRateAlarm}条)`,
        key: WarningType.maximumDemand,
      },
      {
        title: `能耗报警(${energyAlarm}条)`,
        key: WarningType.energy,
      },
    ];
    return (
      <StandardCard src="./assets/menu/time-s.png" style={{ minHeight: '100%' }}>
        <div className={styles.location}>{location}</div>
        <div className={styles.stat}>
          共<span>{totalAlarm}</span>条报警，其中未处理报警<span>{unprocessedWarningCount}</span>条
        </div>
        <div>
          <Tabs defaultActiveKey={WarningType.realTime} type="card">
            {tabConfigs.map(config => {
              return (
                <TabPane tab={config.title} key={config.key}>
                  <OverviewTable
                    areaId={currentArea}
                    warningType={config.key}
                    updateCallback={() => {
                      this.fetchWarningCount(currentArea);
                    }}
                  />
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      </StandardCard>
    );
  };

  renderSider = () => {
    const {
      malfunction: { areaTree },
    } = this.props;
    const defaultSelectedKeys = areaTree.length > 0 ? [`${areaTree[0].id}`] : [];
    return (
      <CommonSiderBar
        areaTreeList={areaTree}
        onAreaTreeSelect={this.onAreaTreeSelect}
        defaultSelectedKeys={defaultSelectedKeys}
      />
    );
  };

  render() {
    return <SiderContent sider={this.renderSider()} content={this.renderContent()} />;
  }
}

export default Overview;
