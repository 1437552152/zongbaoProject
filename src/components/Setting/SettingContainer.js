import React from 'react';
import { Button } from 'antd';
import StandardCard from '@/components/StandardCard';
import styles from './SettingContainer.less';

class SettingContainer extends React.PureComponent {
  render() {
    const { titleImg, buttons, children, other } = this.props;

    return (
      <StandardCard src={titleImg}>
        <div className={styles.toolbar} style={{ marginTop: 0 }}>
          {buttons &&
            buttons.map(item => (
              <Button onClick={item.onClick} key={item.title}>
                <img src={item.src} alt={item.alt} /> {item.title}
              </Button>
            ))}
          {other && other()}
        </div>
        <div className={styles.content}>{children}</div>
      </StandardCard>
    );
  }
}

export default SettingContainer;
