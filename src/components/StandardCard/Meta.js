/*
 * @Desc: Meta标签 配合StandardCard使用，如果自定义title,请自觉使用Card.Meta
 * @Author: Jackie
 * @Date: 2019-06-04 10:25:22
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-06-04 10:44:42
 */
import React from 'react';
import { Card } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

const Meta = ({ title, titleStyle, className, src, ...rest }) => {
  const titleNode = (
    <div className={styles.metaTitleContainer}>
      <div />
      <span style={titleStyle}>{title}</span>
    </div>
  );
  const cls = classnames(styles.meta, className);

  return <Card.Meta className={cls} title={titleNode} {...rest} />;
};
export default Meta;
