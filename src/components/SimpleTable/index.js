import React from 'react';
import { Table, Button } from 'antd';

const SimpleTable = props => {
  const { pagination, ...restProps } = props;
  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>上一页</a>;
    }
    if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  };
  let pageSize = '10';
  if (pagination) {
    // eslint-disable-next-line prefer-destructuring
    pageSize = pagination.pageSize;
  }
  const defaultPagination = {
    showSizeChanger: true,
    showQuickJumper: { goButton: <Button>确定</Button> },
    itemRender,
    showTotal: (total, range) => {
      return (
        <span>
          当前：第<font>{Math.ceil(Number(range[0]) / Number(pageSize || '10'))}</font>
          <font>/</font>
          <font>{Math.ceil(Number(total) / Number(pageSize || '10'))}</font>
          页&nbsp;&nbsp;共
          <font>{total}</font>条记录&nbsp;&nbsp;每页
          <font>{pageSize || '10'}</font>条
        </span>
      );
    },
  };

  const pg = pagination === false ? pagination : Object.assign({}, defaultPagination, pagination);

  return <Table bordered rowKey={r => r.id} pagination={pg} {...restProps} />;
};

export default SimpleTable;
