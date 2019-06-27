import React from 'react';
import styles from './index.less';

const HorizontalLine = ({ ...props }) => {
  return <div className={styles.horizontalLine} {...props} />;
};
export default HorizontalLine;
