import React from 'react';
import { Divider} from 'antd';
import classnames from 'classnames';
import styles from './ColumnsPlubic.less';

export const loadAssociateTableColumns = ({ onDelete, onDetail, onStatus }) => [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
    align: 'center',
  },
  {
    title: '设备编码',
    dataIndex: 'deviceCode',
    key: 'deviceCode',
    align: 'center',
  },
  {
    title: '设备位置',
    dataIndex: 'deviceAddress',
    key: 'deviceAddress',
    align: 'center',
  },
  {
    title: '报警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
    align: 'alarmTime',
  },
  {
    title: '设备类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
  },
  {
    title: '设备详情',
    dataIndex: 'typeDesp',
    key: 'typeDesp',
    align: 'center',
    render: (_, record) => (
      <a onClick={() => onDetail(record.id, record.typeDesp)}>{record.typeDesp}</a>
    ),
  },
  {
    title: '设备状态',
    dataIndex: 'statusDesp',
    key: 'statusDesp',
    align: 'center',
    render: (text, record) => {
      let handlePicStatusDesp = '';
      let statusColor = styles.colorBlue;
      if (record.handlePicStatusDesp == '01') {
        statusColor = classnames(statusColor, styles.colorBlue);
        handlePicStatusDesp = '未上传';
      } else if (record.handlePicStatusDesp == '02') {
        statusColor = classnames(statusColor, styles.colorRed);
        handlePicStatusDesp = '上传中';
      } else {
        statusColor = classnames(statusColor, styles.colorGreen);
        handlePicStatusDesp = '已上传';
      }
      return (
        <a className={statusColor} onClick={() => onStatus(record.id, record.status)}>
          {handlePicStatusDesp}
        </a>
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'delete',
    key: 'delete',
    render: (_, record) => (
      <a onClick={() => onDelete(record.id)} style={{ color: '#FF6A6A' }}>
        [删除]
      </a>
    ),
  },
];

export const AccessControlByRegionListPageColumns = ({
  onDelete,
  onDetail,
  onPic,
  lookPic
}) => [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
  },
  {
    title: '设备编码',
    dataIndex: 'deviceCode',
    key: 'deviceCode',
  },
  {
    title: '设备位置',
    dataIndex: 'deviceAddress',
    key: 'deviceAddress',
  },
  {
    title: '报警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
  },
  {
    title: '报警图片',
    dataIndex: 'alarmPicId',
    key: 'alarmPicId',
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      let status = '';
      let statusColor = styles.colorBlue;
      if (record.status == '01') {
        statusColor = classnames(statusColor, styles.colorBlue);
        status = '未处理';
      } else if (record.status == '02') {
        statusColor = classnames(statusColor, styles.colorRed);
        status = '处理中';
      } else {
        statusColor = classnames(statusColor, styles.colorGreen);
        status = '已处理';
      }
      return (
        <span className={statusColor}>
          {status}
        </span>
      );
    },
  },
  {
    title: '处理详情',
    dataIndex: 'statusDesp',
    key: 'statusDesp',
    render: (_, record) => (
      <a onClick={() => onDetail(record.id, record.statusDesp)} className={styles.detail}>{record.statusDesp}</a>
    ),
  },
  {
    title: '处理图片状态',
    dataIndex: 'handlePicStatus',
    key: 'handlePicStatus',
    render: (text, record) => {
      let handlePicStatus = '';
      let statusColor = styles.colorBlue;
      if (record.handlePicStatus == '01') {
        statusColor = classnames(statusColor, styles.colorsBlue);
        handlePicStatus = '未上传';
      } else if (record.handlePicStatus == '02') {
        statusColor = classnames(statusColor, styles.colorBlack);
        handlePicStatus = '已上传';
      }
      return (
        <span className={statusColor}>{handlePicStatus}</span>
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'delete',
    render: (_, record) => {
      if(record.handlePicStatus==='01'){
        return (
          <span>
            <a onClick={() => onPic(record.id, record.handlePicId)}>[上传图片]</a>
            <Divider type="vertical" />
            <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
          </span>
        )
      }if(record.handlePicStatus==='02'){
        return (
          <span>
            <a onClick={() => lookPic(record.id, record.handlePicId)}>[查看图片]</a>
            <Divider type="vertical" />
            <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
          </span>
        )
      }
    }
  },
];

export const AccessControlDeviceListPageColumns = ({ onDelete }) => [
  {
    title: '报警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
  },
  {
    title: '报警图片',
    dataIndex: 'alarmPicId',
    key: 'alarmPicId',
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      let status = '';
      let statusColor = styles.colorBlue;
      if (record.status == '01') {
        statusColor = classnames(statusColor, styles.colorBlue);
        status = '未处理';
      } else if (record.status == '02') {
        statusColor = classnames(statusColor, styles.colorRed);
        status = '处理中';
      } else {
        statusColor = classnames(statusColor, styles.colorGreen);
        status = '已处理';
      }
      return <span className={statusColor}>{status}</span>;
    },
  },
  {
    title: '处理详情',
    dataIndex: 'statusDesp',
    key: 'statusDesp',
  },
  {
    title: '处理图片状态',
    dataIndex: 'handlePicStatus',
    key: 'handlePicStatus',
    render: (text, record) => {
      let handlePicStatusDesp = '';
      let statusColor = styles.colorBlue;
      if (record.handlePicStatusDesp == '01') {
        statusColor = classnames(statusColor, styles.colorsBlue);
        handlePicStatusDesp = '未上传';
      } else if (record.handlePicStatusDesp == '02') {
        statusColor = classnames(statusColor, styles.colorBlack);
        handlePicStatusDesp = '已上传';
      }
      return <span className={statusColor}>{handlePicStatusDesp}</span>;
    },
  },
  {
    title: '操作',
    dataIndex: 'delete',
    render: (_, record) => (
      <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
    ),
  },
];

export const AccessControlListPageColumns = ({ onDelete }) => [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
  },
  {
    title: '设备编码',
    dataIndex: 'deviceCode',
    key: 'deviceCode',
  },
  {
    title: '设备位置',
    dataIndex: 'deviceAddress',
    key: 'deviceAddress',
  },
  {
    title: '报警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
  },
  {
    title: '报警图片',
    dataIndex: 'alarmPicId',
    key: 'alarmPicId',
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      let status = '';
      let statusColor = styles.colorBlue;
      if (record.status == '01') {
        statusColor = classnames(statusColor, styles.colorBlue);
        status = '未处理';
      } else if (record.status == '02') {
        statusColor = classnames(statusColor, styles.colorRed);
        status = '处理中';
      } else {
        statusColor = classnames(statusColor, styles.colorGreen);
        status = '已处理';
      }
      return <span className={statusColor}>{status}</span>;
    },
  },
  {
    title: '处理详情',
    dataIndex: 'statusDesp',
    key: 'statusDesp',
  },
  {
    title: '处理图片状态',
    dataIndex: 'handlePicStatus',
    key: 'handlePicStatus',
    render: (text, record) => {
      let handlePicStatus = '';
      let statusColor = styles.colorBlue;
      if (record.handlePicStatus == '01') {
        statusColor = classnames(statusColor, styles.colorsBlue);
        handlePicStatus = '未上传';
      } else if (record.handlePicStatus == '02') {
        statusColor = classnames(statusColor, styles.colorBlack);
        handlePicStatus = '已上传';
      }
      return <span className={statusColor}>{handlePicStatus}</span>;
    },
  },
  {
    title: '操作',
    dataIndex: 'delete',
    render: (_, record) => (
      <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
    ),
  },
];

export const FireControlByRegionListPageColumns = ({
  onDelete,
  onDetail,
  onPic,
  lookPic
}) => [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
  },
  {
    title: '设备编码',
    dataIndex: 'deviceCode',
    key: 'deviceCode',
  },
  {
    title: '设备位置',
    dataIndex: 'deviceAddress',
    key: 'deviceAddress',
  },
  {
    title: '报警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
  },
  {
    title: '报警图片',
    dataIndex: 'alarmPicId',
    key: 'alarmPicId',
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      let status = '';
      let statusColor = styles.colorBlue;
      if (record.status == '01') {
        statusColor = classnames(statusColor, styles.colorBlue);
        status = '未处理';
      } else if (record.status == '02') {
        statusColor = classnames(statusColor, styles.colorRed);
        status = '处理中';
      } else {
        statusColor = classnames(statusColor, styles.colorGreen);
        status = '已处理';
      }
      return (
        <span className={statusColor}>
          {status}
        </span>
      );
    },
  },
  {
    title: '处理详情',
    dataIndex: 'statusDesp',
    key: 'statusDesp',
    render: (_, record) => (
      <a onClick={() => onDetail(record,record.planId)} className={styles.detail}>{record.statusDesp}</a>
    ),
  },
  {
    title: '处理图片状态',
    dataIndex: 'handlePicStatus',
    key: 'handlePicStatus',
    render: (text, record) => {
      let handlePicStatus = '';
      let statusColor = styles.colorBlue;
      if (record.handlePicStatus == '01') {
        statusColor = classnames(statusColor, styles.colorsBlue);
        handlePicStatus = '未上传';
      } else if (record.handlePicStatus == '02') {
        statusColor = classnames(statusColor, styles.colorBlack);
        handlePicStatus = '已上传';
      }
      return (
        <span className={statusColor}>{handlePicStatus}</span>
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'delete',
    render: (_, record) => {
      if(record.handlePicStatus==='01'){
        return (
          <span>
            <a onClick={() => onPic(record.id, record.handlePicId)}>[上传图片]</a>
            <Divider type="vertical" />
            <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
          </span>
        )
      }if(record.handlePicStatus==='02'){
        return (
          <span>
            <a onClick={() => lookPic(record.id, record.handlePicId)}>[查看图片]</a>
            <Divider type="vertical" />
            <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
          </span>
        )
      }
    }
  },
];

export const FireControlListPageColumns = ({
  onDelete,
  onDetail,
  onPic,
  lookPic
}) => [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
  },
  {
    title: '设备编码',
    dataIndex: 'deviceCode',
    key: 'deviceCode',
  },
  {
    title: '设备位置',
    dataIndex: 'areaName',
    key: 'areaName',
  },
  {
    title: '报警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
  },
  {
    title: '报警图片',
    dataIndex: 'alarmPicId',
    key: 'alarmPicId',
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      let status = '';
      let statusColor = styles.colorBlue;
      if (record.status == '01') {
        statusColor = classnames(statusColor, styles.colorBlue);
        status = '未处理';
      } else if (record.status == '02') {
        statusColor = classnames(statusColor, styles.colorRed);
        status = '处理中';
      } else {
        statusColor = classnames(statusColor, styles.colorGreen);
        status = '已处理';
      }
      return (
        <span className={statusColor}>
          {status}
        </span>
      );
    },
  },
  {
    title: '处理详情',
    dataIndex: 'statusDesp',
    key: 'statusDesp',
    render: (_, record) => (
      <a onClick={() => onDetail(record.id, record.statusDesp)} className={styles.detail}>{record.statusDesp}</a>
    ),
  },
  {
    title: '处理图片状态',
    dataIndex: 'handlePicStatus',
    key: 'handlePicStatus',
    render: (text, record) => {
      let handlePicStatus = '';
      let statusColor = styles.colorBlue;
      if (record.handlePicStatus === '01') {
        // 01表示未上传
        statusColor = classnames(statusColor, styles.colorsBlue);
        handlePicStatus = '未上传';
      } else if (record.handlePicStatus == '02') {
        // 02表示已上传
        statusColor = classnames(statusColor, styles.colorBlack);
        handlePicStatus = '已上传';
      }
      return (
        <span className={statusColor}>{handlePicStatus}</span>
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'delete',
    render: (_, record) => {
      if(record.handlePicStatus==='01'){
        return (
          <span>
            <a onClick={() => onPic(record.id, record.handlePicId)}>[上传图片]</a>
            <Divider type="vertical" />
            <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
          </span>
        )
      }if(record.handlePicStatus==='02'){
        return (
          <span>
            <a onClick={() => lookPic(record.id, record.handlePicId)}>[查看图片]</a>
            <Divider type="vertical" />
            <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
          </span>
        )
      }
    }
  },
];

export const VideoMonitorByRegionListPageColumns = ({
  onDelete,
  onDetail,
  onPic,
}) => [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
  },
  {
    title: '设备编码',
    dataIndex: 'deviceCode',
    key: 'deviceCode',
  },
  {
    title: '设备位置',
    dataIndex: 'deviceAddress',
    key: 'deviceAddress',
  },
  {
    title: '报警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
  },
  {
    title: '报警图片',
    dataIndex: 'alarmPicId',
    key: 'alarmPicId',
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      let status = '';
      let statusColor = styles.colorBlue;
      if (record.status == '01') {
        statusColor = classnames(statusColor, styles.colorBlue);
        status = '未处理';
      } else if (record.status == '02') {
        statusColor = classnames(statusColor, styles.colorRed);
        status = '处理中';
      } else {
        statusColor = classnames(statusColor, styles.colorGreen);
        status = '已处理';
      }
      return (
        <span className={statusColor}>
          {status}
        </span>
      );
    },
  },
  {
    title: '处理详情',
    dataIndex: 'statusDesp',
    key: 'statusDesp',
    render: (_, record) => (
      <a onClick={() => onDetail(record.id, record.statusDesp)} className={styles.detail}>{record.statusDesp}</a>
    ),
  },
  {
    title: '处理图片状态',
    dataIndex: 'handlePicStatus',
    key: 'handlePicStatus',
    render: (text, record) => {
      let handlePicStatus = '';
      let statusColor = styles.colorBlue;
      if (record.handlePicStatus == '01') {
        statusColor = classnames(statusColor, styles.colorsBlue);
        handlePicStatus = '未上传';
      } else if (record.handlePicStatus == '02') {
        statusColor = classnames(statusColor, styles.colorBlack);
        handlePicStatus = '已上传';
      }
      return (
        <span className={statusColor}>{handlePicStatus}</span>
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'delete',
    render: (_, record) => (
      <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
    ),
  },
];

export const VideoMonitorDeviceListPageColumns = ({ onDelete }) => [
  {
    title: '报警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
  },
  {
    title: '报警图片',
    dataIndex: 'alarmPicId',
    key: 'alarmPicId',
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      let status = '';
      let statusColor = styles.colorBlue;
      if (record.status == '01') {
        statusColor = classnames(statusColor, styles.colorBlue);
        status = '未处理';
      } else if (record.status == '02') {
        statusColor = classnames(statusColor, styles.colorRed);
        status = '处理中';
      } else {
        statusColor = classnames(statusColor, styles.colorGreen);
        status = '已处理';
      }
      return <span className={statusColor}>{status}</span>;
    },
  },
  {
    title: '处理详情',
    dataIndex: 'statusDesp',
    key: 'statusDesp',
  },
  {
    title: '处理图片状态',
    dataIndex: 'handlePicStatus',
    key: 'handlePicStatus',
    render: (text, record) => {
      let handlePicStatus = '';
      let statusColor = styles.colorBlue;
      if (record.handlePicStatus == '01') {
        statusColor = classnames(statusColor, styles.colorsBlue);
        handlePicStatus = '未上传';
      } else if (record.handlePicStatus == '02') {
        statusColor = classnames(statusColor, styles.colorBlack);
        handlePicStatus = '已上传';
      }
      return <span className={statusColor}>{handlePicStatus}</span>;
    },
  },
  {
    title: '操作',
    dataIndex: 'delete',
    render: (_, record) => (
      <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
    ),
  },
];

export const VideoMonitorListPageColumns = ({ onDelete }) => [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
  },
  {
    title: '设备编码',
    dataIndex: 'deviceCode',
    key: 'deviceCode',
  },
  {
    title: '设备位置',
    dataIndex: 'deviceAddress',
    key: 'deviceAddress',
  },
  {
    title: '报警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
  },
  {
    title: '报警图片',
    dataIndex: 'alarmPicId',
    key: 'alarmPicId',
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      let status = '';
      let statusColor = styles.colorBlue;
      if (record.status == '01') {
        statusColor = classnames(statusColor, styles.colorBlue);
        status = '未处理';
      } else if (record.status == '02') {
        statusColor = classnames(statusColor, styles.colorRed);
        status = '处理中';
      } else {
        statusColor = classnames(statusColor, styles.colorGreen);
        status = '已处理';
      }
      return <span className={statusColor}>{status}</span>;
    },
  },
  {
    title: '处理详情',
    dataIndex: 'statusDesp',
    key: 'statusDesp',
  },
  {
    title: '处理图片状态',
    dataIndex: 'handlePicStatus',
    key: 'handlePicStatus',
    render: (text, record) => {
      let handlePicStatus = '';
      let statusColor = styles.colorBlue;
      if (record.handlePicStatus == '01') {
        statusColor = classnames(statusColor, styles.colorsBlue);
        handlePicStatus = '未上传';
      } else if (record.handlePicStatus == '02') {
        statusColor = classnames(statusColor, styles.colorBlack);
        handlePicStatus = '已上传';
      }
      return <span className={statusColor}>{handlePicStatus}</span>;
    },
  },
  {
    title: '操作',
    dataIndex: 'delete',
    render: (_, record) => (
      <a className={styles.delete} onClick={() => onDelete(record.id)}>[删除]</a>
    ),
  },
];
