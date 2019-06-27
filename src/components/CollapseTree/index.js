/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Collapse } from 'antd';
import styles from './index.less';

const { Panel } = Collapse;

class CollapseTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeId: '11',
    };
  }

  render() {
    const { treeData, children } = this.props;
    const { activeId } = this.state;
    return (
      <div className={styles.content}>
        <div className={styles.treeContent}>
          <Collapse defaultActiveKey={['1']}>
            {treeData.map(item => (
              <Panel header={item.name} key={item.id}>
                <ul>
                  {item.children.map(item1 => (
                    <li
                      onClick={() =>
                        this.setState({
                          activeId: item1.id,
                        })
                      }
                      key={item1.id}
                      style={{ color: activeId === item1.id ? '#3c5bce' : '#000' }}
                    >
                      {item1.name}
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </Collapse>
        </div>
        <div className={styles.treeInfo}>{children}</div>
      </div>
    );
  }
}

export default CollapseTree;
