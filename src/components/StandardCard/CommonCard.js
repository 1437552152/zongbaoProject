/*
 * @Desc: 公共Card组件
 * @Author: Jackie
 * @Date: 2019-05-30 14:47:32
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-30 14:57:30
 */
import React from 'react';
import { Card } from 'antd';
import classnames from 'classnames';
import CommonTitle from './CommonTitle';
import styles from './index.less';

const CommonCard = ({ src, title, children, className, full, ...rest }) => {
  const titleEle = <CommonTitle title={title} src={src} />;
  let cls = classnames('card_container', className);
  if (full) {
    cls = classnames(cls, styles.cardFull);
  }
  return (
    <Card title={title && titleEle} className={cls} {...rest}>
      {children}
    </Card>
  );
};
export default CommonCard;
