import React, { Component } from 'react';
import { Tree } from 'antd';
import styles from './TreeArr.less';

const { TreeNode } = Tree;
export default class TreeArr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [],
      flag:false
    };
  }

  componentDidMount() {}

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  componentWillReceiveProps = nextProps => {
    const { type } = this.props;
    const {flag}=this.state;
    if (type !== nextProps.type) {
      this.setState({
        checkedKeys: [],
      });
    }
    if(nextProps.checkedKeys===false){
      this.setState({
        flag:!flag,
        checkedKeys: [],
      });
    }
  };

  onCheck = (checkedKeys, info) => {

console.log("checkedKeys==>",checkedKeys,info)

    this.setState({
      checkedKeys,
    });
    const { handleLegendClick } = this.props;
    handleLegendClick(checkedKeys, info);
  };

  render() {
    const { datalist, index,discheck} = this.props;
    const list = datalist;
    const ite = index;
    const {checkedKeys}=this.state;

    console.log("wwwwww",discheck)

    return (
      // <Tree checkable onCheck={this.onCheck} disabled={type || xuanindex ? (type === xuanindex ? false : true) : false} checkedKeys={this.state.checkedKeys} className={styles.treeHeight} defaultExpandAll={true}>
      <Tree
        checkable={discheck!==false}
        onCheck={this.onCheck}
        checkedKeys={checkedKeys}
        className={styles.treeHeight}
        defaultExpandAll
      >
        <TreeNode title={list.name} key={`${list.id}`} ite={ite}>
          {list &&
            list.children &&
            list.children.map((item, index) => {
              return <TreeNode title={item.name} key={`${item.id}`} ite={ite} />;
            })}
        </TreeNode>
      </Tree>
    );
  }
}
