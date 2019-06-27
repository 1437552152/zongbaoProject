/*
 * @Desc: 人员配置
 * @Author: Jackie
 * @Date: 2019-05-14 11:18:16
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-14 15:21:58
 */
import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';

import StandardTable from '@/components/StandardTable';

export default class SelectedPersonModal extends PureComponent {
  /**
   * onAddClick,onDelClick,onCancelClick, visible, data:{list:[],pagination:{}}, onTableChange
   */
  constructor(props) {
    super(props);
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '电话',
        dataIndex: 'tel',
      },
      {
        title: '人员类型',
        dataIndex: 'typeDesp',
      },
      {
        title: '人员状态',
        dataIndex: 'statusDesp',
      },
    ];

    this.state = {
      selectedRows: [],
      columns,
    };
  }

  handleDelClick = () => {
    const { onDelClick } = this.props;
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id);
    if (onDelClick) onDelClick(ids);
    this.setState({ selectedRows: [] });
  };

  handleCancelClick = () => {
    const { onCancelClick } = this.props;
    if (onCancelClick) onCancelClick();
    this.setState({ selectedRows: [] });
  };

  onChange = pagination => {
    const { onTableChange } = this.props;
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (onTableChange) onTableChange(params);
  };

  render() {
    const { onAddClick, visible, data } = this.props;
    const { selectedRows, columns } = this.state;
    return (
      <Modal title="人员配置" visible={visible} onCancel={this.handleCancelClick} footer={null}>
        <div style={{ marginBottom: 16 }}>
          <Button onClick={onAddClick}>新增</Button>
          <Button
            onClick={this.handleDelClick}
            disabled={selectedRows.length === 0}
            style={{ marginLeft: 16 }}
          >
            删除
          </Button>
        </div>
        <StandardTable
          rowKey="id"
          columns={columns}
          selectedRows={selectedRows}
          data={data}
          onSelectRow={rows => this.setState({ selectedRows: rows })}
          onChange={this.onChange}
        />
      </Modal>
    );
  }
}
