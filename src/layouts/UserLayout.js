import React, { Component, Fragment } from 'react';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 综保区综合服务平台
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
  }

  render() {
    const {
      children
    } = this.props;
    return (
      <DocumentTitle title='登录-综保区综合服务平台'>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <h2 className={styles.title}>综保区综合服务平台</h2>
              </div>
            </div>
            {children}
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout
