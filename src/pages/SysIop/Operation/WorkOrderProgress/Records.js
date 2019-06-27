import React from 'react';
import { Tabs } from 'antd';
import SimpleTable from '@/components/SimpleTable';

const { TabPane } = Tabs;

export default function Records(props) {
  const columns = [
    {
      title: '处理时间',
      dataIndex: 'time',
      key: 'time',
      align: 'left',
      width: '20%',
    },
    {
      title: '处理内容',
      dataIndex: 'opinion',
      key: 'opinion',
      align: 'left',
      width: '50%',
    },
    {
      title: '操作人',
      dataIndex: 'username',
      align: 'left',
      key: 'username',
      width: '30%',
    },
  ];
  const { dataSource } = props;
  return (
    <div>
      <Tabs type="card">
        <TabPane tab="跟踪记录" key="1">
          <SimpleTable columns={columns} dataSource={dataSource} pagination={false} />
        </TabPane>
      </Tabs>
    </div>
  );
}
