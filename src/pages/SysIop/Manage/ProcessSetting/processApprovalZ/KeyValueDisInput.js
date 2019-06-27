import React from 'react';
import { Input } from 'antd';
import styles from './processApprovalZ.less';

const KeyValueDisInput = ({ title, content, isArea }) => {
  const props = {
    className: styles.inputArea,
    // autosize: true,
    disabled: true,
    value: content,
  };
  return (
    <div className={styles.keyValueDisInputContainer}>
      <span>{title}</span>
      {isArea ? <Input.TextArea {...props} style={{minHeight:264}} /> : <Input {...props} />}
    </div>
  );
};

export default KeyValueDisInput;
