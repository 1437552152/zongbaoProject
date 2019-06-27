/*
 * @Desc: 公共Card组件,自带路由title
 * @Author: Jackie
 * @Date: 2019-05-30 14:47:32
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-06-01 16:05:30
 */
import React from 'react';
import { withRouter } from 'umi';
// import Link from 'umi/link';
import { Card } from 'antd';
import classnames from 'classnames';
import RouterTitle from './RouterTitle';
import styles from './index.less';

const RouterCard = ({ src, children, className, full, staticContext, ...rest }) => {
  const titleEle = <RouterTitle src={src} />;

  let cls = classnames('card_container', className);
  if (full) {
    cls = classnames(cls, styles.cardFull);
  }
  return (
    <Card className={cls} {...rest} title={titleEle}>
      {children}
    </Card>
  );
};

export default withRouter(RouterCard);

/**
 * eg:
 * <StandardCard src='./assets/common/peizhi.png'>
 *    内容
 * </StandardCard>
 */
