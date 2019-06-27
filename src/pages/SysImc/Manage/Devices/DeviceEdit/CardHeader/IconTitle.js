import React from 'react';
import styles from './index.less';

const IconTitle = ({ title, ...props }) => {
  return (
    <div className={styles.iconTitle} {...props}>
      <span className={styles.icon} />
      <span className={styles.title}>{title || ''}</span>
    </div>
  );
};
export default IconTitle;
