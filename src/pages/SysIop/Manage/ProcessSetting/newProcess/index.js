import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Radio } from 'antd';
import StandardCard from '@/components/StandardCard';
// import SiderContent from '@/components/SiderContent';
import CommonSiderBar from '@/components/CommonSiderBar';
import NewPro from './NewPro';
import NewStep from './NewStep';
// import StandardCard from '@/components/StandardCard';
import styles from './newProcess.less';

const isEdit = true;

@connect(({ newProcess }) => ({
  newProcess,
}))
@Form.create()
class newProcess extends PureComponent {
  state = {
    process: false,
    treeArr: [],
    title: '',
    flag: false,
    flowId: 0,
    currentTreePath: '0', // 树的节点路径
    ischildren: false,
    isChange: false,
    addprocessData: false,
  };

  componentDidMount() {
    this.addprocess();
  }

  addprocess = () => {
    const values = {};
    const { dispatch } = this.props;
    dispatch({
      type: 'newProcess/getnewProcess',
      payload: values,
      callback: res => {
        this.addcallback(res);
      },
    });
  };

  addcallback = res => {
    this.setState({ treeArr: res.data });
  };


  treePath = () => {
    const {
      newProcess: { data },
    } = this.props;
    const { currentTreePath } = this.state;
    let {title}=this.state;
    const paths = currentTreePath.split('-');
    let areas = data;
    for (let i = 1; i < paths.length; i += 1) {
      const index = parseInt(paths[i], 10);
      const area = areas[index];
      title += `> ${area.name}`;
      areas = area.children;
    }
    this.setState({title});
  };

  // 点击树节点
  onAreaTreeSelect = (selectedKeys, e) => {
    const { isChange} = this.state;
    const node = e.selectedNodes[0];
    this.setState({
      currentTreePath: node.props.pos,
      title:"工作流"
    },()=>{
     // 如果有子级则显示步骤或流程，如果没有子级则显示为空   ischildren为true时为空
     if (
      e.selectedNodes[0].props.dataRef.children &&
      e.selectedNodes[0].props.dataRef.isLeaf === '0'
    ) {
      this.setState({ ischildren: true, title: '', isChange: !isChange, addprocessData: false });
    }
    // 如果是最后一级，并且没有创建步骤
    if (
      !e.selectedNodes[0].props.dataRef.children &&
      e.selectedNodes[0].props.dataRef.isLeaf === '0'
    ) {
      this.setState({
        addprocessData: true,
        process: false,
        flag: true,
        flowId: e.selectedNodes[0].props.dataRef.id,
        // title: '新建步骤',
        ischildren: false,
        isChange: !isChange,
      });
      this.treePath();
    }
    // 说明有了步骤,点击应出现步骤
    if (
      !e.selectedNodes[0].props.dataRef.children &&
      e.selectedNodes[0].props.dataRef.isLeaf === '1'
    ) {
      this.setState({
        process: false,
        flowId: e.selectedNodes[0].props.dataRef.id,
        flag: true,
        ischildren: false,
        isChange: !isChange,
        addprocessData: false,
      });
      this.treePath();
    }
    })
  };

  // 点加号时,需要判断流程下面有没有步骤，如果有步骤，则不能再创建流程
  plus = item => {
     const {isChange}=this.state;
     this.setState({ process: true, flowId: item.id,ischildren:false,isChange: !isChange, flag: true,title:"新增流程"});
  };

  // 点减号时
  minus = item => {
    const values = { id: item.id };
    const { dispatch } = this.props;
    dispatch({
      type: 'newProcess/deteleProcess',
      payload: values,
      callback: () => {
        this.addprocess();
        this.setState({flag:true,title:''})
      },
    });
  };

  renderSider = () => {
    const { treeArr } = this.state;
    const areaTreeList = treeArr;
    if (areaTreeList && areaTreeList.length > 0) {
      return (
        <CommonSiderBar
          showTrigger
          areaTreeList={areaTreeList}
          onAreaTreeSelect={this.onAreaTreeSelect}
          isEdit={isEdit}
          plus={this.plus}
          minus={this.minus}
        />
      );
    }
    return true;
  };

  renderContent = () => {
    const { process, flowId, ischildren, addprocessData } = this.state;
    let choiceProcess;
    if (!ischildren) {
      if (process === true) {
        choiceProcess = <NewPro addprocess={this.addprocess} flowId={flowId} />;
      } else {
        choiceProcess = (
          <div>
            <NewStep flowId={flowId} addprocess={this.addprocess} addprocessData={addprocessData} />
          </div>
        );
      }
    } else {
      choiceProcess = <span />;
    }
    return <div>{choiceProcess}</div>;
  };

  render() {
    const { title, flag } = this.state;
    let headtitle;
    if (flag&&title!=='') {
      headtitle = (
        <div style={{ flex: 1 }}>
          <StandardCard.Meta title={title} style={{ marginTop: 0 }} />
          {this.renderContent()}
        </div>
      );
    } else {
      // headtitle
    }
    return (
      <div>
        <StandardCard full showTitle bodyStyle={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: 278 }}>
            <StandardCard.Meta title="工作流" style={{ marginTop: 0 }} />
            <div>{this.renderSider()}</div>
          </div>
          {headtitle}
        </StandardCard>
      </div>
    );
  }
}
export default newProcess;
