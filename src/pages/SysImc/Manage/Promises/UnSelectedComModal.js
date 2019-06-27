/*
 * @Desc: 未绑定人员配置
 * @Author: Jackie
 * @Date: 2019-05-14 11:18:16
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-14 15:22:05
 */
import React, { PureComponent } from 'react';
import { Button, Modal, Input } from 'antd';

import StandardTable from '@/components/StandardTable';

export default class SelectedComModal extends PureComponent {
  /**
   * onAddClick,onCancelClick, visible, data:{list:[],pagination:{}}, onTableChange
   */
  constructor(props) {
    super(props);
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
    ];

    this.state = {
      selectedRows: [],
      values: {},
      columns,
    };
  }

  handleAddClick = () => {
    const { onAddClick } = this.props;
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id);
    if (onAddClick) onAddClick(ids);
    this.setState({ selectedRows: [], values: {} });
  };

  handleCancelClick = () => {
    const { onCancelClick } = this.props;
    if (onCancelClick) onCancelClick();
    this.setState({ selectedRows: [], values: {} });
  };

  onInputChange = event => {
    if (event && event.target && event.target.value) {
      this.setState({ values: { name_S_LK: event.target.value } });
    } else {
      this.setState({ values: {} });
    }
  };

  onSearch = value => {
    const { onTableSearch } = this.props;
    const values = { name_S_LK: value };
    this.setState({ values });
    if (onTableSearch) onTableSearch(values);
  };

  onChange = pagination => {
    const { onTableChange } = this.props;
    const { values } = this.state;
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...values,
    };
    if (onTableChange) onTableChange(params);
  };

  render() {
    const { visible, data } = this.props;
    const { selectedRows, columns } = this.state;
    return (
      <Modal
        title="未绑定公司配置"
        visible={visible}
        onCancel={this.handleCancelClick}
        footer={null}
      >
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Input.Search
            placeholder="名称"
            style={{ width: 200 }}
            onSearch={value => this.onSearch(value)}
            onChange={this.onInputChange}
            enterButton
            allowClear
          />
          <Button onClick={this.handleAddClick} disabled={selectedRows.length === 0}>
            添加
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
