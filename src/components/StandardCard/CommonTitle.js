import React from 'react';
import styles from './index.less';

const CommonTitle = ({ src, title }) => {
  return (
    <div className={styles.title}>
      {src && <img src={src} alt="" />}
      {title}
    </div>
  );
};

export default CommonTitle;
