/*
 * @Desc: 停车场
 * @Author: Jackie
 * @Date: 2019-06-05 11:54:48
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-06-05 16:16:06
 */
import React, { PureComponent } from 'react';
import { Icon, Divider, Tabs, Spin } from 'antd';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';

import StandardCard from '@/components/StandardCard';
import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';

import styles from './index.less';

@connect(({ opCardpark, loading }) => ({
  opCardpark,
  loading: loading.models.opCardpark,
}))
class CardPark extends PureComponent {
  state={
    rotate: 0,
    scales: 100,
    tabKey: '0',
    tabsData:[]
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'opCardpark/treeList',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'opCardpark/clear',
    });
  }

  // 树选择
  onTreeSelect = (selectedKeys, e) => {
    const { dispatch } = this.props;
    let showContent = false;
    if (e.selected && e.node.isLeaf()) {
      showContent = true;
    }
    const curTreeItem = showContent ? e.selectedNodes[0].props.dataRef : {};
    if(showContent){
      this.setState({ tabsData: [], tabKey: '0'})
      dispatch({
        type: 'opCardpark/loadData',
        payload: curTreeItem,
      });
    }
    dispatch({
      type: 'opCardpark/save',
      payload: {
        curTreeItem,
        showContent,
      },
    });
  };

  onPlusClick = () => {
    const { tabKey, tabsData, refresh } = this.state
    if (tabsData[tabKey].scales<200){
      tabsData[tabKey].scales += 10
      this.setState({ tabsData, refresh: !refresh })
    }
  };

  onMinusClick = () => {
    const { tabKey, tabsData, refresh } = this.state
    if (tabsData[tabKey].scales > 20) {
      tabsData[tabKey].scales -= 10
      this.setState({ tabsData, refresh: !refresh })
    }
  };

  onRotateLeftClick = () => {
    this.changeRotate(-30)
  };

  onRotateRightClick = () => { 
    this.changeRotate(30)
  };

  changeRotate = (rotate)=>{
    const { tabKey, tabsData, refresh } = this.state
    tabsData[tabKey].rotate = (tabsData[tabKey].rotate + rotate) % 360

    if (Math.abs(tabsData[tabKey].rotate) % 180 === 0){
      tabsData[tabKey].top = 0
      tabsData[tabKey].left = 0
    }else{
      const el = this.refs[`ic${tabKey}`]
      const h = el.offsetHeight
      const w = el.offsetWidth;
      const r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) / 2
      tabsData[tabKey].top = r - h / 2
      tabsData[tabKey].left = r - w / 2
    }
    this.setState({ tabsData, refresh: !refresh })
  }

  renderSider = () => {
    const {
      opCardpark: { treeList },
    } = this.props;
    return <CommonSiderBar areaTreeList={treeList} onAreaTreeSelect={this.onTreeSelect} />;
  };

  renderCtrl =()=>{
    return(
      <div className={styles.ctrlContainer}>
        <Icon type='plus' className={styles.icon} onClick={this.onPlusClick} />
        <Icon type="minus" className={styles.icon} onClick={this.onMinusClick} />
        <Icon type="undo" className={styles.iconRote1} onClick={this.onRotateLeftClick} />
        <Icon type="redo" className={styles.iconRote2} onClick={this.onRotateRightClick} />
      </div>
    )
  }

  renderMenu = (item)=>{
    const siteCount = item.totalCount // 总车位
    const siteSpace = item.freeCount // 空闲车位
    const siteLast = siteCount - siteSpace // 已占用的车位

    const data=[
      {
        name: '空闲数量',
        value: siteSpace,
        itemStyle:{
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#4D6DE2' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#289FEB' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
          }
        }
      },
      {
        name: '占用数量',
        value: siteLast,
        itemStyle:{
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#FF8A00' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#FFB400' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
          }
        }
      }]
    const options={
      legend:{
        show: true,
        top: 2,
        icon: "circle", 
        textStyle:{
          color: '#3A3A3A',
          fontSize: 14,
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      calculable: true,
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          itemStyle: {
            normal: {
              borderWidth: 2,
              borderColor: '#ffffff',
              label: {
                textStyle: {
                  fontWeight: 200,
                  fontSize: 14,
                  color: '#3a3a3a'
                },
                formatter:'{c}'
              },
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data,
        },
      ],
    }
    return(
      <div className={styles.menuContainer}>
        <StandardCard.Meta title='车位统计' className={styles.menuTitle} />
        <Divider style={{marginTop: 12, marginBottom: 18}} />

        <ReactEcharts
          option={options}
          style={{ height: '200px', width: '100%' }}
        />
        <Divider style={{ marginTop: 0, marginBottom: 16 }} />
        <div className={styles.menuItem}>
          <span>车位总数：</span>
          <span>{siteCount}</span>
        </div>
        <div className={styles.menuItem}>
          <span>车位占用率：</span>
          <span>{Math.round(siteLast * 1000 / siteCount) / 10}%</span>
        </div>
      </div>
    )
  }
  
  renderPanel=(item, i)=>{
    const { tabsData, rotate, scales } = this.state
    if (!tabsData[i]){
      tabsData[i] = {rotate, scales}
      this.setState({ tabsData })
    }
    const curTabData = tabsData[i]
    return(
      <Tabs.TabPane tab={item.floorName} key={`${i}`}>
        <div className={styles.imgScroller}>
          <div ref={`ic${i}`} className={styles.imgContainer} style={{ transform: `rotate(${curTabData.rotate}deg)`, height: `${curTabData.scales}%`, top: curTabData.top || 0, left: curTabData.left || 0 }}>
            <img src={item.src} alt="" height="100%" />
          </div>
        </div>
        <div className={styles.ns} style={{ transform: `rotate(${curTabData.rotate}deg)` }}>
          <img src="./assets/icons/fangxiang.png" alt="" height="100%" />
        </div>
        {this.renderCtrl()}
        {this.renderMenu(item)}
      </Tabs.TabPane>
    )
  }

  renderContent = () => {
    const {
      opCardpark: {
        curTreeItem,
        showContent,
        datas
      },
      loading,
    } = this.props;
    const { tabKey } = this.state
    return (
      <Spin spinning={loading}>
        <StandardCard className={styles.cardContainer} src='./assets/menu/guanli-s.png'>
          {showContent && (
            <div className={styles.contentContainer}>
              <StandardCard.Meta title={curTreeItem.name} style={{marginTop: 0, marginBottom: 20}} />

              {datas && 
                <Tabs type="card" activeKey={tabKey} onChange={(tk)=>this.setState({tabKey: tk})}>
                  {datas.map((item, i) => this.renderPanel(item, i))}
                </Tabs>
              }
            </div>
          )}
        </StandardCard>
      </Spin>
    );
  };

  render() {
    return <SiderContent sider={this.renderSider()} content={this.renderContent()} />;
  }
}

export default CardPark;
