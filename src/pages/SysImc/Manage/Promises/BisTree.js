/*
 * @Desc: 人员配置
 * @Author: Jackie
 * @Date: 2019-05-14 11:18:16
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-14 13:07:06
 */
import React from 'react';
// import { Tree, Icon } from 'antd';
import CommonTree from '@/components/CommonSiderBar/CommonTree';
import styles from './BisTree.less';

// const { TreeNode } = Tree;
const BisTree = props => {
  const { onTreeSelect, treeList } = props;

  // const renderTreeNodes = data =>
  //   data.map(item => {
  //     if (item.children) {
  //       return (
  //         <TreeNode title={item.name} key={item.id} dataRef={item} icon={<Icon type="inbox" />}>
  //           {renderTreeNodes(item.children)}
  //         </TreeNode>
  //       );
  //     }
  //     return <TreeNode title={item.name} key={item.id} dataRef={item} icon={<Icon type="eye" />} />;
  //   });

  return (
    <CommonTree
      treeClassName={styles.tree}
      onTreeSelect={(selectedKeys, e) => onTreeSelect(selectedKeys, e)}
      treeList={treeList}
    />
    // <Tree.DirectoryTree
    //   className={styles.tree}
    //   defaultExpandAll
    //   expandAction={false}
    //   showIcon
    //   onSelect={(selectedKeys, e) => onTreeSelect(selectedKeys, e)}
    // >
    //   {renderTreeNodes(treeList)}
    // </Tree.DirectoryTree>
  );
};
export default BisTree;
