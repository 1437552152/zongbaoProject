/*
 * @Desc: 没有tab的
 * @Author: Jackie
 * @Date: 2019-05-22 12:34:51
 * @Last Modified by: yeyifu
 * @Last Modified time: 2019-06-24 14:49:01
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import classnames from 'classnames';

import styles from './index.less';
import CommonTree from './CommonTree';

const SingleTabSiderBar = props => {
  const {
    renderTop,
    areaTreeList,
    onAreaTreeSelect,
    loading,
    tsbClassName,
    isEdit,
    isApproval,
    plus,
    minus,
    selectedKeys,
    defaultSelectedKeys,
  } = props;

  console.log(selectedKeys);
  const cls = classnames(styles.singleSiderBarContainer, tsbClassName);
  return (
    <Spin spinning={loading}>
      <div className={cls}>
        {renderTop}
        <CommonTree
          treeList={areaTreeList}
          onTreeSelect={onAreaTreeSelect}
          isEdit={isEdit}
          isApproval={isApproval}
          minus={minus}
          plus={plus}
          selectedKeys={selectedKeys}
          defaultSelectedKeys={defaultSelectedKeys}
        />
      </div>
    </Spin>
  );
};

SingleTabSiderBar.propTypes = {
  renderTop: PropTypes.element, // 顶部自定义控件
  areaTreeList: PropTypes.array, // 区域树
  onAreaTreeSelect: PropTypes.func, // 树选择事件
  selectedKeys: PropTypes.array, // 默认选中的树节点
  loading: PropTypes.bool, // 是否加载中
  tsbClassName: PropTypes.string, // 顶层样式
};

SingleTabSiderBar.defaultProps = {
  renderTop: undefined,
  areaTreeList: [],
  onAreaTreeSelect: undefined,
  selectedKeys: [],
  loading: false,
  tsbClassName: '',
};

export default SingleTabSiderBar;
