import React from 'react';
import styles from './index.less';

const LabelChild = ({ title, child, ...rest }) => {
  return (
    <div className={styles.container} {...rest}>
      {title && (
        <div className={styles.label}>
          <span>{title}</span>
        </div>
      )}
      <div className={styles.content}>{child}</div>
    </div>
  );
};

export default LabelChild;
