import React from 'react';
// import Overview from '../Overview'
// import Operation from '../Operation'

export default function Home(props) {
  const { role } = props;
  // TODO: 根据不同的角色显示不同内容
  // return role === 1 ? <Overview /> : <Operation />
  return role === 1 ? <p>报警总览</p> : <p>工单管理</p>;
}
