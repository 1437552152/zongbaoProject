import React from 'react';
import { connect } from 'dva';
import { Divider, Table, Form, Input, Select, Button, message } from 'antd';
import styles from './SelfhelpLinkage.less';
import TreeArr from '@/components/tree/TreeArr.js';

@Form.create()
@connect(({ SelfhelpLinkage, loading }) => ({
  SelfhelpLinkage,
  loading: loading.effects['*'],
}))
class SelfhelpLinkage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      planIds: [],
      checkIds: [],
      alarmId: '',
      alarmType: '',
      areaId: '',
      id: '',
      checkedtreenode: true,
      flag:false
    };
  }

  componentDidMount() {
    const { alarmId, alarmType, areaId, id } = this.props.location.query;
    this.setState({ alarmId, alarmType, areaId, id });
    const { dispatch } = this.props;
    const values = {};
    dispatch({
      type: 'SelfhelpLinkage/getPlanNodelist',
      payload: values,
    });
  }

  // 去除空数组
  removeEmptyArrayEle = arr => {
    for (let i = 0; i < arr.length; i+=1) {
      if (arr[i] === undefined || arr[i].length === 0) {
        arr.splice(i, 1);
        i -= 1;
      }
    }
    return arr;
  };

  debounce = () => {
      const that=this;
      this.setState({flag:true})
      that.release();
  };

  release = () => {
    const {
      dispatch,
      SelfhelpLinkage: { data },
      location: { query },
    } = this.props;
    const { type } = query;
    const { planIds, alarmId, areaId, id } = this.state;
    // 获取选中的下标
    const arrindex = [];
    planIds.map((item, index) => {
      if (item && item.length > 0) {
        arrindex.push(index);
      }
    });

    // 获取data中对应的list
    const detail = [];
    arrindex.map((item, index) => {
      console.log('test==>');
      detail.push(data.list[item]);
    });

    // 数组去除空，undefinded，并将二维数组转为一维数组
    const planIdsbak = [...planIds];
    const arrIds = this.removeEmptyArrayEle(planIdsbak);
    let arr = [];
    arrIds.map((item, index) => {
      console.log('test==>');
      arr = arr.concat(item);
    });
    // 触发提交
    const values = {
      detail,
      planIds: arr,
      alarmId,
      areaId,
      id,
      type,
    };

    // 过滤传的item项
    const arrdetail = [];
    const len = detail.length;
    for (let i = 0; i < len; i++) {
      arrdetail.push([]);
    }
    arr.map(item => {
      detail.map((detailitem, detailindex) => {
        detailitem.children.map(childitem => {
          if (item == childitem.id) {
            arrdetail[detailindex].push(childitem);
          }
        });
      });
    });
    if (arr && arr.length > 0) {
      values.detail.map((item, index) => {
        values.detail[index].children = arrdetail[index];
      });
      dispatch({
        type: 'SelfhelpLinkage/planCreate',
        payload: values,
        callback:()=>{
          this.setState({flag:false})
        }
      });
    } else {
      message.error('请选择方案');
      this.setState({flag:false})
    }
  };

  handleLegendClick = (checkedKeys, info) => {
    const { planIds } = this.state;
    planIds[info.node.props.ite] = checkedKeys || [];
    this.setState({ planIds, checkedtreenode: true });
  };

  reset = () => {
    this.setState({ checkedtreenode: false });
  };

  render() {
    const {
      SelfhelpLinkage: { data },
    } = this.props;
    const { checkedtreenode,flag } = this.state;
    const size = 'large';
    return (
      <div className={styles.topbg}>
        <div className={styles.headContainer}>
          <span>
            <img src="./assets/liandong.png" className={styles.tubiao} alt="" />
            自助联动管理
          </span>
        </div>
        <div className={styles.recommend}>
          <div className={styles.list}>
            <div className={styles.item1}>
              <div className={styles.paixuindex}>
                {' '}
                <span className={styles.span}>1</span>
              </div>
              <div className={styles.head}>
                <p>开始</p>
                <p className={styles.start}>START</p>
                <img src="./assets/start.png" className={styles.end} alt="" />
              </div>{' '}
            </div>
            {data && data.list && data.list.length > 0
              ? data.list.map((item, index) => {
                  return (
                    <div className={styles.item1} key={item.id}>
                      <div className={styles.paixuindex}>
                        <span className={styles.span}>{index + 2}</span>{' '}
                      </div>
                      <TreeArr
                        datalist={item}
                        index={index}
                        handleLegendClick={this.handleLegendClick}
                        checkedKeys={checkedtreenode}
                      />
                    </div>
                  );
                })
              : null}
            <div className={`${styles.item1} ${styles.ul}`}>
              <div className={styles.paixuindex}>
                {' '}
                <span className={styles.span}>{data.list.length + 2}</span>
              </div>
              <div className={styles.head}>
                <p>结束</p>
                <p className={styles.start}>END</p>
                <div className={styles.right}>
                  <Button type="primary" onClick={this.debounce} size={size} disabled={flag}>
                    发布
                  </Button>
                  <Button type="primary" onClick={this.reset} size={size} className={styles.reset}>
                    重置
                  </Button>
                </div>
                <img src="./assets/start.png" className={styles.end} alt="" />
              </div>
            </div>
            {/* <div className={styles.clearfix}></div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default SelfhelpLinkage;
