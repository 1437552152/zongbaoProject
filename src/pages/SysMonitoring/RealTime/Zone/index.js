import React from 'react';
import { Card, Tooltip } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import styles from './index.less';

@connect(({ zone }) => ({ zone }))
class Zone extends React.PureComponent {
  // componentDidMount() {
  //   const { match: { params} } = this.props
  //   console.log('------match params：', params)
  // }

  render() {
    const { zone, zoneType } = this.props;
    const { zones, baseMap, area } = zone;

    const title = (
      <div className={styles.title}>
        <img src="./assets/zone/quyu.png" alt="" />
        <span>区域</span>
      </div>
    );

    const onZoneClick = z => {
      if (z.areaId) {
        router.push(`/monitoring/realtime/${zoneType}/zone/${z.areaId}`);
      }
      // message.info(`点击了：${z.key}`)
    };

    const extra = (
      <Tooltip title="历史记录">
        <Link to={`/monitoring/realtime/zone/${zoneType}/alarmList`}>
          <span className={styles.historyRecord}>
            历史记录 <img src="./assets/common/right.png" alt="icon" className={styles.right} />
          </span>
        </Link>
      </Tooltip>
    );

    return (
      <Card title={title} bordered={false} bodyStyle={{ padding: 8 }} extra={extra}>
        <div className={styles.content}>
          <div className={styles.mapWrapper}>
            <img
              className={styles.baseMap}
              src={baseMap.image}
              alt="区域"
              style={{ width: baseMap.width, height: baseMap.height }}
            />
            {zones
              .filter(_ => _.image)
              .map(z => {
                const style = {
                  position: 'absolute',
                  left: z.x,
                  top: z.y,
                  width: z.width,
                  height: z.height,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                };

                const imageStyle = {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: z.width,
                  height: z.height,
                  zIndex: 101,
                };

                return (
                  <div
                    key={z.key}
                    className={styles.zoneMask}
                    style={style}
                    onClick={() => onZoneClick(z)}
                  >
                    <img src={z.image} style={imageStyle} alt="" />
                    <div className={styles.alarmText}>{z.alarmCount}</div>
                  </div>
                );
              })}
          </div>
          <div className={styles.legend}>
            {area.map(a => {
              return (
                <div key={a.id} className={styles.row}>
                  <div style={{ backgroundColor: a.color }} />
                  <span>{a.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    );
  }
}

export default Zone;
