import React, { PureComponent } from 'react';
import { Collapse } from 'antd';
import { connect } from 'dva';
import styles from './newProcess.less';

const { Panel } = Collapse;
@connect(({ newProcess }) => ({
  newProcess,
}))
class MyTree extends PureComponent {
  state = {
    groupId: 0,
    level: '00',
  };

  // 点击组
  tanchu = id => {
    this.setState({ level: '00' });
    const { dispatch, onpesonData } = this.props;
    const values = { groupId: id };
    this.setState({ groupId: id });
    dispatch({
      type: 'newProcess/listBindPersonGroup',
      payload: values,
      callback: res => {
        onpesonData(res);
      },
    });
  };

  head = (item, onClick) => {
    return <div onClick={onClick}>{item}</div>;
  };

  // 点击组里的分类
  permanent = params => {
    this.setState({ level: params });
    const { groupId } = this.state;
    const { dispatch, onpesonData } = this.props;
    const values = { groupId, positionLevel: params };
    dispatch({
      type: 'newProcess/listBindPersonGroup',
      payload: values,
      callback: res => {
        onpesonData(res);
      },
    });
  };

  parent = node => {
    const { level } = this.state;
    const getStyle = bl => {
      return bl ? { color: '#3C5BCE' } : {};
    };
    return (
      <Collapse
        accordion
        className={styles.treecollapse}
        expandIcon={({ isActive }) =>
          isActive ? <img src="./zhankai.png" alt="" /> : <img src="./hebing.png" alt="" />
        }
      >
        {node && node.length > 0
          ? node.map(child => (
            <Panel
              header={this.head(child.name, () => {
                  this.tanchu(child.id);
                })}
              key={child.id.toString()} 
            >
              <ul className={styles.panelleft}>
                <li onClick={() => this.permanent('01')} style={getStyle(level === '01')}>
                  班长
                </li>
                <li onClick={() => this.permanent('02')} style={getStyle(level === '02')}>
                  组长
                </li>
                <li onClick={() => this.permanent('03')} style={getStyle(level === '03')}>
                  小组长
                </li>
              </ul>
            </Panel>
            ))
          : null}
      </Collapse>
    );
  };

  render() {
    const { treeArr } = this.props;
    return <div>{this.parent(treeArr)}</div>;
  }
}
export default MyTree;
