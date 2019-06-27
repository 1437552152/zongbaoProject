import React, { PureComponent } from 'react';
import { Card, Divider, Button } from 'antd';
import classnames from 'classnames';
import { connect } from 'dva';
import Link from 'umi/link';
import { find } from 'lodash';
import SimpleTable from '@/components/SimpleTable';
import MonitorStream from '@/components/MonitorStream';
import styles from './index.less';

const VideoView = ({ url, cameraName, width, height, bstyle }) => {
  // console.log('cameraName: ', cameraName, ' width: ', width, 'height: ', height)
  return (
    <Card
      cover={<MonitorStream rtsp={url} width={width} height={height} />}
      style={{ padding: 0, ...bstyle }}
      className={styles.videoCard}
      bodyStyle={{ padding: 0, textAlign: 'center', backgroundColor: '#F7FCFF' }}
    >
      <Card.Meta title={cameraName} />
    </Card>
  );
};

const NoVideo = props => {
  return (
    <div className={styles.novideo} {...props}>
      <img src="./assets/home/novideo.png" alt="" />
      <p>暂无摄像头信息</p>
    </div>
  );
};

const Stat = ({ icon, titleCn, titleEn, count, countDesp, percent, percentDesp }) => {
  return (
    <div className={styles.stat}>
      <div className={styles.statTitle}>
        <img src={icon} alt="" />
        {titleCn}
        <span>{titleEn}</span>
      </div>
      <div className={styles.statContent}>
        <div className={styles.statItem}>
          <p>
            {count}
            <span>条</span>
          </p>
          <p>{countDesp}</p>
        </div>
        <div className={styles.statItem}>
          <p>
            {percent}
            <span>%</span>
          </p>
          <p>{percentDesp}</p>
        </div>
      </div>
    </div>
  );
};

@connect(({ loading, realtimehome }) => ({
  monitorLoading: loading.effects['realtimehome/queryMonitorVideo'],
  realtimehome,
}))
class Home extends PureComponent {
  state = {
    activeButtonKey: 'fire', // fire, entrance, video
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { activeButtonKey } = this.state;
    dispatch({
      type: 'realtimehome/getAlarmStatistics',
    });
    dispatch({
      type: 'realtimehome/queryAlarmList',
      payload: {
        type: activeButtonKey,
        page: 1,
        pageSize: 10,
      },
    });
    // .then(() => {
    //   const {
    //     realtimehome: { videos },
    //   } = this.props;
    //   if (videos && videos.length > 0)
    //     dispatch({
    //       type: 'realtimehome/queryMonitorVideo',
    //       payload: { id: videos[0].deviceId },
    //     });
    // });
  }

  onActiveButtonChange(key) {
    this.setState({ activeButtonKey: key });

    const { dispatch } = this.props;
    dispatch({
      type: 'realtimehome/queryAlarmList',
      payload: {
        type: key,
        page: 1,
        pageSize: 10,
      },
    });
  }

  onTableChange = pagination => {
    const { dispatch } = this.props;
    const { activeButtonKey } = this.state;

    const params = {
      type: activeButtonKey,
      page: pagination.current,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'realtimehome/queryAlarmList',
      payload: params,
    });
  };

  getStatData() {
    const { realtimehome } = this.props;
    const { statisticsData } = realtimehome;
    const { activeButtonKey } = this.state;
    const data = find(statisticsData, { typeDesc: activeButtonKey });

    if (data) {
      const getPercentNumber = str => Number(str ? str.replace('%', '') : 0);
      const {
        alarmCount,
        disConnectPercent,
        disConnectedCount,
        mailCount,
        mailPercent,
        alarmPercent,
      } = data;

      return {
        alarm: {
          icon: './assets/home/alarm.png',
          titleCn: '报警信息',
          titleEn: 'Alarm Message',
          count: alarmCount,
          countDesp: '报警信息',
          percent: getPercentNumber(alarmPercent),
          percentDesp: '已处理百分比',
        },
        mail: {
          icon: './assets/home/mail.png',
          titleCn: '通信错误',
          titleEn: 'Communication Error',
          count: mailCount,
          countDesp: '通信错误',
          percent: getPercentNumber(mailPercent),
          percentDesp: '总量百分比',
        },
        connection: {
          icon: './assets/home/connection.png',
          titleCn: '无法连接',
          titleEn: 'Cannot Connect',
          count: disConnectedCount,
          countDesp: '无法连接',
          percent: getPercentNumber(disConnectPercent),
          percentDesp: '总量百分比',
        },
      };
    }
    return {};
  }

  render() {
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'deviceCode',
        width: '15%',
      },
      {
        title: '报警区域',
        dataIndex: 'areaName',
        width: '20%',
      },
      {
        title: '报警位置',
        dataIndex: 'deviceAddress',
        width: '25%',
      },
      {
        title: '报警时间',
        dataIndex: 'alarmTime',
        width: '20%',
      },
      {
        title: '报警类型',
        dataIndex: 'typeDesp',
        width: '15%',
        render: text => {
          return <span style={{ color: '#FF6A6A' }}>{text}</span>;
        },
      },
      {
        title: '操作',
        width: '10%',
        key: 'operate',
        render: record => {
          return (
            <Link
              style={{ color: '#3c5bce' }}
              to={`/monitoring/realtime/equipment/${record.id}?type=alarm`}
            >
              进入
            </Link>
          );
        },
      },
    ];

    const { monitorLoading, realtimehome, dispatch } = this.props;
    const { alarmList, pagination, videos, selectDevice } = realtimehome;

    const mainVideoProps = {
      width: 480,
      height: 360,
      bstyle: { marginTop: 10 },
    };

    const assistantVideoProps = {
      width: 120,
      height: 90,
      bstyle: {
        marginTop: 10,
      },
    };

    const title = (titleText, icon) => (
      <div className={styles.cardTitle}>
        <img src={icon} alt="" />
        <span>{titleText}</span>
      </div>
    );

    const { activeButtonKey } = this.state;
    const statData = this.getStatData();
    const main = videos[0];
    const assistants = videos.slice(1, 4);

    const tableProps = {
      className: styles.table,
      dataSource: alarmList,
      columns,
      pagination,
      scroll: { y: 350 },
      rowKey: r => r.id,
      rowClassName: r => (selectDevice && r.id === selectDevice.id ? styles.rowSelected : ''),
      onRow: record => {
        return {
          onClick: () => {
            dispatch({
              type: 'realtimehome/updateState',
              payload: { selectDevice: record },
            });
            dispatch({
              type: 'realtimehome/queryMonitorVideo',
              payload: { id: record.deviceId },
            });
          }, // 点击行
        };
      },
      onChange: this.onTableChange,
    };

    return (
      <div className={styles.container}>
        <div className={styles.button_group}>
          <Button
            className={classnames({ [styles.active]: activeButtonKey === 'fire' })}
            onClick={() => this.onActiveButtonChange('fire')}
          >
            消防集成
          </Button>
          <Button
            className={classnames({ [styles.active]: activeButtonKey === 'entrance' })}
            onClick={() => this.onActiveButtonChange('entrance')}
          >
            门禁监管
          </Button>
          <Button
            className={classnames({ [styles.active]: activeButtonKey === 'video' })}
            onClick={() => this.onActiveButtonChange('video')}
          >
            视频监控
          </Button>
        </div>
        <div className={styles.statRow}>
          <Link to={`realtime/${activeButtonKey}/zone/home/index`}>
            <Stat {...statData.alarm} />
          </Link>
          <Link to={`realtime/${activeButtonKey}/zone/home/index`}>
            <Stat {...statData.mail} />
          </Link>
          <Link to={`realtime/${activeButtonKey}/zone/home/index`}>
            <Stat {...statData.connection} />
          </Link>
        </div>
        <Divider dashed style={{ height: 1, margin: '30px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 20 }}>
          <Card
            title={title('关联摄像头', './assets/home/shexiangtou.png')}
            bordered={false}
            className={styles.videoArea}
            loading={monitorLoading}
          >
            {alarmList.length === 0 && <NoVideo />}
            {!selectDevice ? (
              // <NoVideo />
              '请选择报警设备查看关联摄像视频画面！'
            ) : (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {main ? ( // 占位
                  <VideoView url={main.videoStream} cameraName={main.name} {...mainVideoProps} />
                ) : (
                  <NoVideo />
                )}
                {assistants && assistants.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
                    {assistants.map(v => (
                      <VideoView
                        key={v.id}
                        url={v.videoStream}
                        cameraName={v.name}
                        {...assistantVideoProps}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          <div style={{ flex: 1, marginLeft: 21 }}>
            <Card
              title={title('设备记录', './assets/home/jilu.png')}
              bordered={false}
              className={styles.alarmlist}
            >
              <SimpleTable {...tableProps} />
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
