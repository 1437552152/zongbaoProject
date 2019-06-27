/*
 * @Desc: 多tab
 * @Author: Jackie
 * @Date: 2019-05-21 19:51:45
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-22 17:01:02
 */
import React, { PureComponent } from 'react';
import { Tabs, Input, Spin } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CommonTree from './CommonTree';
import styles from './index.less';

const { TabPane } = Tabs;

class MutiTabSiderBar extends PureComponent {
  static propTypes = {
    onBuildTabChanged: PropTypes.func, // 需要更新建筑树事件
    onCompanyTabChanged: PropTypes.func, // 需要更新公司树事件
    onSearch: PropTypes.func, // 搜索事件

    areaTreeList: PropTypes.array, // 区域树
    buildTreeList: PropTypes.array, // 建筑树
    companyTreeList: PropTypes.array, // 公司树
    searchTreeList: PropTypes.array, // 搜索结果树

    onAreaTreeSelect: PropTypes.func, // 区域树选择事件
    onBuildTreeSelect: PropTypes.func, // 建筑树选择事件
    onCompanyTreeSelect: PropTypes.func, // 公司树选择事件
    onSearchTreeSelect: PropTypes.func, // 搜索结果树选择事件
    loading: PropTypes.bool, // 是否加载中
    tsbClassName: PropTypes.string, // 顶层样式
  };

  static defaultProps = {
    onBuildTabChanged: undefined,
    onCompanyTabChanged: undefined,
    onSearch: undefined,

    areaTreeList: [],
    buildTreeList: [],
    companyTreeList: [],
    searchTreeList: [],

    onAreaTreeSelect: undefined,
    onBuildTreeSelect: undefined,
    onCompanyTreeSelect: undefined,
    onSearchTreeSelect: undefined,

    loading: false,

    tsbClassName: '',
  };

  state = {
    tabDisabled: [true, true],
    needRefresh: [false, false],
    lastKeys: [],
  };

  /**
   * 搜索tab点击搜索按钮触发
   */
  onSearch = value => {
    const { onSearch } = this.props;
    if (onSearch) onSearch(value);
  };

  // ==============tab======start=========

  /**
   * 侧边tab变更触发
   */
  onTabChange = activeKey => {
    const { onBuildTabChanged, onCompanyTabChanged } = this.props;

    const { needRefresh } = this.state;
    this.setState({ ignore: true });
    // console.log('=====onchange====', activeKey)
    switch (
      activeKey // 更新这个tab的数据
    ) {
      case 'build':
        if (needRefresh[0] && onBuildTabChanged) onBuildTabChanged();
        break;
      case 'comp':
        if (needRefresh[1] && onCompanyTabChanged) onCompanyTabChanged();
        break;
      default:
        break;
    }
  };

  // ==============tab======end=========
  // ==============tree=====start========

  /**
   * 判断两个数组是否相同
   */
  isArrayEquals = (array1, array2) => {
    if (array1 && array2) {
      return array1.toString() === array2.toString();
    }
    if (!array1 && !array2) {
      return true;
    }
    return false;
  };

  /**
   * 更新state , 返回当前选中的树节点 与最后一次选择的 是否相同 相同： false 不同： true
   */
  updateState = (keys, e, index) => {
    const { tabDisabled, lastKeys, needRefresh } = this.state;
    let temp = false;
    if (e.selected && e.node.isLeaf()) {
      tabDisabled[index] = false;
    } else {
      tabDisabled[index] = true;
    }
    const tempTabDisabled = tabDisabled.map((item, i) => {
      return i > index ? true : item;
    });
    if (this.isArrayEquals(lastKeys[index], keys)) {
      needRefresh[index] = false;
    } else {
      needRefresh[index] = true;
      lastKeys[index] = keys;
      temp = true;
    }
    this.setState({
      tabDisabled: tempTabDisabled,
      needRefresh,
      lastKeys,
    });
    return temp;
  };

  /**
   * 更新state , 返回当前选中的树节点 与最后一次选择的 是否相同 相同： false 不同： true
   */
  updateLastKeys = (keys, _, index) => {
    const { lastKeys } = this.state;
    if (!this.isArrayEquals(lastKeys[index], keys)) {
      lastKeys[index] = keys;
      this.setState({
        lastKeys,
      });
      return true;
    }
    return false;
  };

  /**
   * 树节点点击事件，重复点击相同节点将不再触发回调事件
   * ignore: 是否忽略重复点击树节点
   */
  onTreeSelected = (checkFun, selectFun, keys, e, index) => {
    const { ignore } = this.state;
    if ((checkFun(keys, e, index) || ignore) && selectFun) selectFun(keys, e);
    this.setState({ ignore: false });
  };

  /**
   * 区域树选择事件
   */
  onAreaTSelect = (keys, e) => {
    const { onAreaTreeSelect } = this.props;
    this.onTreeSelected(this.updateState, onAreaTreeSelect, keys, e, 0);
  };

  /**
   * 建筑树选择事件
   */
  onBuildTSelect = (keys, e) => {
    const { onBuildTreeSelect } = this.props;
    this.onTreeSelected(this.updateState, onBuildTreeSelect, keys, e, 1);
  };

  /**
   * 公司树选择事件
   */
  onCompTSelect = (keys, e) => {
    const { onCompanyTreeSelect } = this.props;
    this.onTreeSelected(this.updateLastKeys, onCompanyTreeSelect, keys, e, 2);
  };

  /**
   * 搜索树选择事件
   */
  onSearchTSelect = (keys, e) => {
    const { onSearchTreeSelect } = this.props;
    this.onTreeSelected(this.updateLastKeys, onSearchTreeSelect, keys, e, 3);
  };

  render() {
    const {
      areaTreeList,
      buildTreeList,
      companyTreeList,
      searchTreeList,
      loading,
      tsbClassName,
      selectedKeys,
    } = this.props;
    const { tabDisabled } = this.state;
    const cls = classnames(styles.mutiSiderBarContainer, tsbClassName);
    const defaultActiveKey = 'area';
    const tabs = [
      {
        tab: '区域',
        key: 'area',
        tree: {
          treeList: areaTreeList,
          selectedKeys,
          onTreeSelect: this.onAreaTSelect,
        },
      },
      {
        tab: '建筑',
        key: 'build',
        disabled: tabDisabled[0],
        tree: {
          treeList: buildTreeList,
          selectedKeys,
          onTreeSelect: this.onBuildTSelect,
        },
      },
      {
        tab: '公司',
        key: 'comp',
        disabled: tabDisabled[1],
        tree: {
          treeList: companyTreeList,
          selectedKeys,
          onTreeSelect: this.onCompTSelect,
        },
      },
      {
        tab: '搜索',
        key: 'search',
        tree: {
          treeList: searchTreeList,
          selectedKeys,
          onTreeSelect: this.onSearchTSelect,
        },
      },
    ];

    return (
      <div className={cls}>
        <Spin spinning={loading}>
          <Tabs defaultActiveKey={defaultActiveKey} tabPosition="left" onChange={this.onTabChange}>
            {tabs.map(item => {
              return (
                <TabPane {...item}>
                  {item.key === 'search' && (
                    <div style={{ margin: 8 }}>
                      <Input.Search
                        placeholder="搜索"
                        onSearch={value => this.onSearch(value)}
                        enterButton
                      />
                    </div>
                  )}
                  <CommonTree {...item.tree} />
                </TabPane>
              );
            })}
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default MutiTabSiderBar;
