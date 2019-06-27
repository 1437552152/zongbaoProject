import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';
import { relative } from 'path';

// table公共组件
class StandardTable extends PureComponent {
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRowKeys, selectedRows);
    }
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  render() {
    const {
      data: { list, pagination },
      rowKey,
      pageSizeOptions = ['10', '20', '30'],
      ...rest
    } = this.props;

// console.log("wwww",this.props)


    const paginationProps = {
      hideOnSinglePage:false,
      showSizeChanger: true,
      showQuickJumper: true,
      ...{
        ...pagination,
        ...{
          pageSizeOptions,
        },
      },
    };

    return (
      <div className={styles.standardTable} style={{ clear: 'both', position: 'relative', top: 1 }}>
        <Table
          rowKey={rowKey || 'key'}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
