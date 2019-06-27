import React, { PureComponent } from 'react';
import { Divider, Modal, Upload, Button, Icon, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import SimpleTable from '@/components/SimpleTable';
import { WarningType, WarningStatus } from '../config';
import styles from './index.less';

const PageSize = '10';

@connect(({ malfunction, loading }) => ({
  malfunction,
  loading: loading.models.malfunction,
}))
class OverviewTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentRecord: null,
      isModalVisible: false,
      confirmLoading: false,
      uploading: false,
      uploadedFileId: null,
      currentPage: '1',
    };
  }

  componentDidMount() {
    this.loadList('1');
  }

  componentDidUpdate(prevProps) {
    const { areaId } = this.props;
    const preArea = prevProps ? prevProps.areaId : null;
    if (preArea !== areaId) {
      this.loadList('1');
    }
  }

  loadList = page => {
    const { areaId, warningType, dispatch } = this.props;
    dispatch({
      type: 'malfunction/fetchWarningList',
      payload: {
        areaId,
        page,
        pageSize: PageSize,
        warningType,
      },
    });
  };

  setFalsePositive = record => {
    this.setState({
      currentRecord: record,
      isModalVisible: true,
    });
  };

  handleOk = () => {
    const { currentRecord, uploadedFileId } = this.state;
    if (!uploadedFileId) {
      message.error('请上传一张照片');
      return;
    }
    const { dispatch, updateCallback } = this.props;
    this.setState({
      confirmLoading: true,
    });
    dispatch({
      type: 'malfunction/setFalsePositive',
      payload: {
        id: currentRecord.id,
        attachmentId: uploadedFileId,
      },
      callback: () => {
        const { currentPage } = this.state;
        this.loadList(currentPage);
        this.setState({
          confirmLoading: false,
          isModalVisible: false,
          uploadedFileId: null,
        });
        updateCallback();
      },
    });
  };

  beforeFileUpload = file => {
    this.setState({
      uploading: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'malfunction/uploadFile',
      payload: file,
      callback: entity => {
        this.setState({
          uploading: false,
          uploadedFileId: entity,
        });
      },
    });
    return false;
  };

  onFileRemove = () => {
    this.setState({
      uploadedFileId: null,
    });
    return true;
  };

  handleCancel = () => {
    this.setState({
      currentRecord: null,
      isModalVisible: false,
      confirmLoading: false,
      uploading: false,
    });
  };

  onPageChange = page => {
    this.setState({
      currentPage: page,
    });
    this.loadList(page);
  };

  render() {
    const columns = [
      {
        title: '报警内容',
        dataIndex: 'detail',
        key: 'detail',
      },
      {
        title: '报警位置',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '报警级别',
        dataIndex: 'levels',
        key: 'levels',
        render: (_text, record) => {
          return record.levelsDesp;
        },
      },
      {
        title: '报警时间',
        dataIndex: 'malfunctionTime',
        key: 'malfunctionTime',
      },
      {
        title: '报警通知',
        dataIndex: 'noticePerson',
        key: 'noticePerson',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (_text, record) => {
          return record.status === WarningStatus.unprocessed ? (
            <span>
              <a
                onClick={() => {
                  router.push(`overview/dispatch/${record.id}`);
                }}
              >
                派工单
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.setFalsePositive(record);
                }}
              >
                误报
              </a>
            </span>
          ) : null;
        },
      },
    ];
    const {
      malfunction: {
        realTimeAlarms,
        loadRateAlarms,
        lineLossAlarms,
        contractLoadRateAlarms,
        energyAlarms,
      },
      warningType,
    } = this.props;
    let alrms = { length: 0, list: [] };
    if (warningType === WarningType.realTime) {
      alrms = realTimeAlarms;
    } else if (warningType === WarningType.load) {
      alrms = loadRateAlarms;
    } else if (warningType === WarningType.cable) {
      alrms = lineLossAlarms;
    } else if (warningType === WarningType.maximumDemand) {
      alrms = contractLoadRateAlarms;
    } else if (warningType === WarningType.energy) {
      alrms = energyAlarms;
    }
    const { isModalVisible, confirmLoading, uploadedFileId, uploading } = this.state;
    const uploadProps = {
      name: 'file',
      action: '',
      listType: 'picture',
      accept: 'image/*',
      withCredentials: true,
      beforeUpload: this.beforeFileUpload,
      onRemove: this.onFileRemove,
    };
    return (
      <div>
        <SimpleTable
          className={styles.table}
          columns={columns}
          dataSource={alrms.list}
          pagination={{
            position: 'bottom',
            showQuickJumper: true,
            total: alrms.length,
            onChange: this.onPageChange,
          }}
        />
        <Modal
          title="误报"
          visible={isModalVisible}
          okButtonProps={{ disabled: !uploadedFileId }}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <Upload {...uploadProps}>
            <Button disabled={!!uploadedFileId}>
              <Icon type={uploading ? 'loading' : 'upload'} />
              {uploading ? '正在上传照片' : '请上传照片'}
            </Button>
          </Upload>
        </Modal>
      </div>
    );
  }
}

export default OverviewTable;
