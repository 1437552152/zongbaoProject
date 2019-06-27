/*
 * @Desc: 可收缩侧边栏的内容容器
 * @Author: Jackie
 * @Date: 2019-05-21 16:47:49
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-23 19:05:55
 */
import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.less';

const { Sider, Content } = Layout;
export default class SiderContent extends PureComponent {
  static propTypes = {
    sider: PropTypes.element.isRequired, // 左边侧边栏内容
    content: PropTypes.element.isRequired, // 右侧内容
    showSider: PropTypes.bool, // 是否显示侧边栏
    className: PropTypes.string,
    style: PropTypes.object,
    width: PropTypes.number, // 侧边栏宽度
  };

  static defaultProps = {
    showSider: true,
    className: '',
    style: {},
    width: 256,
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: !props.showSider,
    };
  }

  onCollapse = collapsed => {
    const { onSiderChange } = this.props;
    this.setState({ collapsed });
    if (onSiderChange) onSiderChange(!collapsed);
  };

  render() {
    const { sider, content, className, style = {}, width, showTrigger } = this.props;
    const { collapsed } = this.state;
    const tempStyle = {
      minWidth: 1,
      ...style,
    };
    const clsString = classNames(styles.container, className);
    let clsSider = styles.sider;
    if (showTrigger) {
      clsSider = classNames(clsSider, styles.siderShowTrigger);
    }
    return (
      <Layout className={clsString} style={tempStyle}>
        <Sider
          collapsible
          width={width}
          theme="light"
          collapsedWidth="0"
          collapsed={collapsed}
          onCollapse={this.onCollapse}
          className={clsSider}
        >
          <div className={styles.siderInner}>{sider}</div>
        </Sider>
        <Content className={styles.content}>{content}</Content>
      </Layout>
    );
  }
}
