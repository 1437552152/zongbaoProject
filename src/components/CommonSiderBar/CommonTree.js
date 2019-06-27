/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/*
 * @Desc: tree
 * @Author: Jackie
 * @Date: 2019-05-14 11:18:16
 * @Last Modified by: yeyifu
 * @Last Modified time: 2019-06-24 14:46:42
 */
import React from 'react';
import { Tree, Icon } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

const { TreeNode, DirectoryTree } = Tree;
const CommonTree = props => {
  // treeClassName 树顶层样式
  const {
    onTreeSelect,
    treeList = [],
    isEdit = false,
    isApproval = false,
    plus,
    minus,
    selectedKeys,
    defaultSelectedKeys,
  } = props;

  /**
   * item{id,name,children}
   */

  const Title = ps => {
    const { item, edit } = ps;

    return (
      <span className={styles.title}>
        <span className={styles.content}>{item.name}</span>
        {edit && (
          <span className={styles.control}>
            <Icon
              type="plus-square"
              style={{ display: item.isLeaf === '1' ? 'none' : 'inline-block' }}
              onClick={e => {
                e.stopPropagation();
                if (plus) {
                  plus(item);
                }
              }}
            />
            <Icon
              type="minus-square"
              onClick={e => {
                e.stopPropagation();
                if (minus) {
                  minus(item);
                }
              }}
            />
          </span>
        )}
      </span>
    );
  };

  const renderTreeNodes = data =>
    data.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      return (
        <TreeNode
          title={<Title item={item} edit={isEdit} />}
          key={item.id}
          dataRef={item}
          disabled={item.disabled}
          selectable={item.selectable === undefined ? true : item.selectable}
        >
          {hasChildren && renderTreeNodes(item.children)}
        </TreeNode>
      );
    });

  const keys = {};
  if (selectedKeys && selectedKeys.length) {
    keys.selectedKeys = selectedKeys;
  }
  if (defaultSelectedKeys && defaultSelectedKeys.length) {
    keys.defaultSelectedKeys = defaultSelectedKeys;
  }

  return (
    <DirectoryTree
      className={
        isEdit || isApproval ? classnames(styles.tree, styles.processtree) : classnames(styles.tree)
      }
      defaultExpandAll
      expandAction={false}
      showIcon={false}
      onSelect={(thekeys, e) => onTreeSelect && onTreeSelect(thekeys, e)}
      {...keys}
    >
      {renderTreeNodes(treeList)}
    </DirectoryTree>
  );
};

export default CommonTree;
