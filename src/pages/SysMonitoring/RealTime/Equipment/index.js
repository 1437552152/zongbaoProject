/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Tree, Icon } from 'antd';
import { Link } from 'react-router-dom';

import MonitorStream from '@/components/MonitorStream';
import styles from './index.less';

const { Column } = Table;
const { TreeNode } = Tree;

// const redata = [{ name: 'sdas' }, { name: 'sdas' }, { name: 'sdas' }, { name: 'sdas' }];
const loop = tdata =>
  tdata.map(item => {
    if (item.children) {
      return (
        <TreeNode key={`${item.id}`} disableCheckbox title={item.name} isLeaf={item.isLeaf}>
          {loop(item.children)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={`${item.id}`}
        disableCheckbox
        title={item.name}
        dataRef={item}
        isLeaf={item.isLeaf}
      />
    );
  });

@connect(({ equipment, loading }) => ({
  equipment,
  loading: loading.models.equipment,
}))
class Equipment extends PureComponent {
  state = {
    allVideoListright: 0,
    selectVideoTitle: '',
    selectVideoUrl: '',
    hasplan: 'none',
    planlist: [],
    selectedKeys: [],
    expandKeys: [],
    clickCode: 0,
    alarmId: '',
    alarmType: '',
    areaId: '',
    id: '',
    hasmorevideo: 'none',
    deviceOffset:0,
    type:''
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props; // const { dispatch } = this.props;
    const { type } = this.props.location.query;

     this.setState({type})
    dispatch({
      type: 'equipment/fetchDeviceByid',
      payload: { id, type },
      callback: data => {
        this.getPlan(data);
      },
    });
  }

  getPlan = e => {
    this.setState({
      selectVideoTitle: e.name,
      selectVideoUrl: e.videoStream,
      alarmId: e.alarmId,
      alarmType: e.alarmType,
      areaId: e.areaId,
      id: e.id,
  });
    const { dispatch } = this.props;
    dispatch({
      type: 'equipment/fetchAllVideoDevice',
      payload: e.id,
      callback: data => {
        this.seeallvideo(data);
      },
    });
    if (e.planId) {
      dispatch({
        type: 'equipment/fetchPlanDevice',
        payload: e.planId,
        callback: data => {
          this.getallPlan(data);
        },
      });
      // setInterval(() => {
      //   dispatch({
      //     type: 'equipment/fetchPlanDevice',
      //     payload: e.planId,
      //     callback: data => {
      //       this.getallPlan(data);
      //     },
      //   });
      // }, 10000);
    } else {
      this.setState({
        hasplan: 'none',
      });
    }
    // setInterval(()=> {
    //   dispatch({
    //     type: 'equipment/fetchPlanDevice',
    //     payload: 9,
    //     callback:data => {this.getallPlan(data)}
    //     });
    // },10000);
  };

  seeallvideo = e => {
    if (e.length > 4) {
      this.setState({
        hasmorevideo: 'inherit',
      });
    }
  };

  getallPlan = e => {
    const planlist = JSON.parse(e.detail);
    const plandeallist = JSON.parse(e.result);
    const Allplanlist = [];
    const selectedKeys = [];
    const expandKeys = [];
    planlist.forEach((item, index) => {
      this.updateplanlist(item, plandeallist, selectedKeys, expandKeys);
      const theplandata = { index, plantree: planlist };
      Allplanlist.push(theplandata);
    });
    this.setState({
      planlist: Allplanlist,
      selectedKeys,
      hasplan: 'inherit',
      expandKeys,
    });
  };

  rightseevideo= lng => {
    if (this.state.deviceOffset < 0)
      this.setState({
        deviceOffset: this.state.deviceOffset + 1,
      });
  };

  leftseevideo = () => {
    const {
      equipment: { allVideoList },
    } = this.props;

    if (this.state.deviceOffset > 4 - allVideoList.length) {
      this.setState({
        deviceOffset: this.state.deviceOffset - 1,
      });
    }
  };

  seevideo = (item, k) => {
    this.setState({
      clickCode: k,
      selectVideoTitle: item.name,
      selectVideoUrl: item.videoStream,
    });
  };

  updateplanlist = (plandata, plandeallist, checklist, expandKeys) => {
    plandeallist.forEach(item => {
      if (plandata.id === item.id && item.res.code === 1) {
        checklist.push(`${item.id}`);
      }
    });
    if (plandata.children) {
      plandata.isLeaf = false;
      expandKeys.push(`${plandata.id}`);
      plandata.children.forEach(item => {
        this.updateplanlist(item, plandeallist, checklist, expandKeys);
      });
    } else {
      plandata.isLeaf = true;
    }
  };

  render() {
    const {
      equipment: { device, allVideoList, devicePlan },
      loading,
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    const item = {
      checkable: true,
      onExpand: this.onExpand,
      onCheck: this.onCheck,
      defaultCheckedKeys: this.state.selectedKeys,
      defaultExpandedKeys: this.state.expandKeys,
      autoExpandParent: true,
      switcherIcon: <Icon type="down" />,
    };

    const { clickCode, alarmId, alarmType, areaId } = this.state;

    /*
    <Table className={styles.equipmentTable} dataSource={[device]} pagination={false}>
      <Column title="设备名称" dataIndex="name" key="name" />
      <Column title="设备编号" dataIndex="code" key="code" />
      <Column title="设备区域" dataIndex="areaName" key="areaName" />
      <Column title="设备位置" dataIndex="address" key="address" />
      <Column title="设备类型" dataIndex="typeDesp" key="typeDesp" />
    </Table>
    */


    const tableData = {
      pagination: false,
      dataSource: [device].map(it => ({
        key: it.code,
        name: it.name,
        code: it.code,
        areaName: it.areaName,
        address: it.address,
        typeDesp: it.typeDesp,
      })),
      columns: [{
        title: '设备名称',
        dataIndex: 'name',
        width: 100,
        textWrap: 'word-break',
      },{
        title: '设备编号',
        dataIndex: 'code',
        width: 100,
        textWrap: 'word-break',
      },{
        title: '设备区域',
        dataIndex: 'areaName',
        width: 100,
        textWrap: 'word-break',
      },{
        title: '设备位置',
        dataIndex: 'address',
        width: 100,
        textWrap: 'word-break',
      },{
        title: '设备类型',
        dataIndex: 'typeDesp',
        width: 100,
        textWrap: 'word-break',
      },],
    };


    const {deviceOffset,type} = this.state;

    return (
      <div className={styles.equipmentMain}>
        <div className={styles.equipmentLeft}>
          <div className={styles.titleBar}>
            <div className={styles.img} />
            <span>关联摄像头信息</span>
          </div>
          <div className={styles.mainVideo}>
            <div>
              <MonitorStream rtsp={this.state.selectVideoUrl} />
            </div>
            <div>{this.state.selectVideoTitle}</div>
          </div>
          <div className={styles.relating}>
            <div
              style={{ display: this.state.hasmorevideo }}
              onClick={() => this.leftseevideo(allVideoList.length)}
              className={styles.button}
            >
              &lt;
            </div>
            <div className={styles.container}>
              {allVideoList.length > 0 ? (
                allVideoList.map((titem, k) => (
                  <div
                    key={titem.id}
                    onClick={() => this.seevideo(titem, k)}
                    style={{ color: clickCode === k ? '#1862AE' : '#061E3A',  transform: `translateX(${deviceOffset}00%)`}}
                    className={styles.item}
                  >
                    <div className={styles.video}>
                      <div>
                        <MonitorStream rtsp={titem.videoStream} />
                      </div>
                      <div>{titem.name}</div>
                      <div>
                        <div>{titem.code}</div>
                        <div>{titem.address}</div>
                        <div>{titem.ip}</div>
                        <div>{titem.status}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <span className={styles.equipmentNoVideo}>暂无关联摄像头</span>
              )}
            </div>
            <div
              style={{ display: this.state.hasmorevideo }}
              onClick={this.rightseevideo}
              className={styles.button}
            >
              &gt;
            </div>
          </div>
        </div>
        <div className={styles.equipmentRight}>
          <div className={styles.titleBar}>
            <div className={styles.img} />
            <span>设备报警信息</span>
            <Link
              to={`/monitoring/realtime/safeMonitor/firecontrolhistory/${device.id}`}
            >
              历史记录 <img src="./assets/common/right.png" alt="icon" className={styles.right} />
            </Link>
          </div>

          <div>
            <Table className={styles.equipmentTable} {...tableData} />
            <div className={styles.linkPanel}>
              <Link             
                style={device.planId ? {} : { display: 'none' }}
                to={`/monitoring/realtime/recommendation-linkage/recommendation-linkage?alarmId=${alarmId}&type=${type}&alarmType=${alarmType}&areaId=${areaId}&id=${
                  this.state.id
                  }`}
              >
                推荐联动方案
              </Link>
              <Link
                style={device.planId ? {} : { display: 'none' }}
                to={`/monitoring/realtime/selfhelp-linkage/selfhelp-linkage?alarmId=${alarmId}&type=${type}&alarmType=${alarmType}&areaId=${areaId}&id=${
                  this.state.id
                  }`}
              >
                自助联动方案
              </Link>
            </div>
          </div>
          <div className={styles.scheme}>
            <div className={styles.titleBar}>
              <div className={styles.img2} />
              <span>联动方案执行</span>
            </div>
            <div style={{ display: this.state.hasplan }} className={styles.equipmentplan}>
              <ul className={styles.equipmentplanstart}>
                <div className={styles.equipmentpleft}>
                  <div className={styles.equipmentpline}>
                    <p style={{ marginBottom: 0 }} className={styles.equipmentpTitle}>
                      1
                    </p>
                  </div>
                </div>
                <div>
                  <p style={{ marginBottom: 0 }} className={styles.equipmentplanp}>
                    开始
                  </p>
                </div>
              </ul>
              {this.state.planlist.map((titem, index) => (
                <ul key={`key_${titem.index}`} className={styles.equipmenPlanTreeDiv}>
                  <div className={styles.equipmentpleft}>
                    <div className={styles.equipmentpline}>
                      <p style={{ marginBottom: 0 }} className={styles.equipmentpTitle}>
                        {titem.index + 2}
                      </p>
                    </div>
                  </div>
                  <div className={styles.equipmentpTree}>
                    <Tree {...item}>{loop(titem.plantree)}</Tree>
                  </div>
                </ul>
              ))}
              <ul className={styles.equipmentplanend}>
                <div className={styles.equipmentpleft}>
                  <div className={styles.equipmentpline}>
                    <p style={{ marginBottom: 0 }} className={styles.equipmentpTitle}>
                      {this.state.planlist.length + 2}
                    </p>
                  </div>
                </div>
                <div>
                  <p style={{ marginBottom: 0 }} className={styles.equipmentplanpend}>
                    结束
                  </p>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Equipment;
