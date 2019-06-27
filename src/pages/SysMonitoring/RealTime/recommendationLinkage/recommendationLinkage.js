import React from 'react';
import { connect } from 'dva';
import { Divider, Table, Form, Input, Select, Button, Radio, message } from 'antd';
import Prompt from 'umi/prompt';
import styles from './recommendationLinkage.less';
import TreeArr from '@/components/tree/TreeArr.js';

const RadioGroup = Radio.Group;

@Form.create()
@connect(({ recommendationLinkage, loading }) => ({
  recommendationLinkage,
  loading: loading.effects['*'],
}))
class recommendationLinkage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      planIds: [],
      checkIds: [],
      value: 0,
      alarmId: '',
      alarmType: '',
      areaId: '',
      id: '',
      flag: false,
    };
  }

  componentDidMount() {
    const {
      location: { query },
    } = this.props;
    const { alarmId, alarmType, areaId } = query;
    this.setState({ alarmId, alarmType, areaId });
    const { dispatch } = this.props;
    const values = { type: alarmType };
    dispatch({
      type: 'recommendationLinkage/getRecommondlistlist',
      payload: values,
    });
  }

  Release = () => {
    this.setState({ flag: true });
    const {
      dispatch,
      recommendationLinkage: { data },
      location: { query },
    } = this.props;
    const { type } = query;

    const { planIds, alarmId, areaId, id } = this.state;
    const innerPlanIds = [...planIds];
    // 获取选中的下标
    const arrindex = [];
    planIds.map((item, index) => {
      if (item && item.length > 0) {
        arrindex.push(index);
      }
    });

    // 获取data中对应的list
    const detail = [];
    data.list.map((item, index) => {
      const { value } = this.state;
      if (index === value) {
        detail.push(data.list[index]);
      }
    });
    // 数组去除空，undefinded，并将二维数组转为一维数组
    const planIdsbak = [...planIds];
    const arrIds = this.removeEmptyArrayEle(planIdsbak);
    let arr = [];
    arrIds.map((item, index) => {
      arr = arr.concat(item);
    });
    const checkindex = [];
    innerPlanIds.map((item, index) => {
      if (item && item.length > 0) {
        checkindex.push(JSON.parse(detail[0].detail)[index]);
      }
    });

    const arrdetail = [];
    const len = JSON.parse(detail[0].detail).length;
    const recommDetail = JSON.parse(detail[0].detail);
    for (let i = 0; i < len; i += 1) {
      arrdetail.push([]);
    }
    arr.map(item => {
      JSON.parse(detail[0].detail).map((detailitem, detailindex) => {
        detailitem.children.map(childitem => {
          if (item == childitem.id) {
            arrdetail[detailindex].push(childitem);
          }
        });
      });
    });
    if (arr && arr.length > 0) {
      recommDetail.map((item, index) => {
        recommDetail[index].children = arrdetail[index];
      });
      // 触发提交
      const values = {
        detail: recommDetail,
        planIds: arr,
        alarmId,
        areaId,
        id,
        type,
      };

      dispatch({
        type: 'recommendationLinkage/planCreate',
        payload: values,
        callback: () => {
          this.setState({ flag: false });
        },
      });
    } else {
      message.error('请选择方案');
      this.setState({ flag: false });
    }
  };

  handleLegendClick = (checkedKeys, info) => {
    const { planIds } = this.state;
    planIds[info.node.props.ite] = checkedKeys || [];
    this.setState({ planIds });
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
      planIds: [],
    });
  };

  // 去除空数组
  removeEmptyArrayEle = arr => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === undefined || arr[i].length === 0) {
        arr.splice(i, 1);
        i -= 1;
      }
    }
    return arr;
  };

  render() {
    const {
      recommendationLinkage: { data },
    } = this.props;
    const { value, flag } = this.state;
     return (
      <div className={styles.topbg}>
        <div className={styles.headContainer}>
          <span>
            <img src="./assets/liandong.png" className={styles.tubiao} />
            推荐方案组
          </span>
        </div>
        <div className={styles.recommend}>
          <RadioGroup onChange={this.onChange} value={value} className={styles.treeRadio}>
            {data && data.list && data.list.length > 0
              ? data.list.map((item, index) => {
                  return (
                    <div className={styles.recommendReso} key={item.id}>
                      <div className={styles.radio}>
                        <Radio value={index}>方案{index + 1}</Radio>
                      </div>
                      <div className={styles.list}>
                        <p className={styles.coderecomm}>{index + 1}号推荐方案</p>
                        <div className={styles.item1}>
                          <div className={styles.treelist}>
                            <div className={styles.paixuindex}>
                              {' '}
                              <span className={styles.span}>1</span>
                            </div>
                            <div className={styles.head}>
                              <p>开始</p>
                              <p className={styles.start}>START</p>
                              <img src="./assets/start.png" className={styles.end} />
                            </div>
                          </div>
                        </div>

                        {item &&
                          item.detail &&
                          JSON.parse(item.detail).length > 0 &&
                          JSON.parse(item.detail).map((item1, index1) => {
                            return (
                              <div className={styles.item1} key={item1.id}>
                                <div className={styles.treelist}>
                                  {' '}
                                  <div className={styles.paixuindex}>
                                    <span className={styles.span}>{index1 + 2}</span>
                                  </div>
                                  <TreeArr
                                    datalist={item1}
                                    index={index1}
                                    handleLegendClick={this.handleLegendClick}
                                    type={value}
                                    xuanindex={index}
                                  />{' '}
                                </div>
                              </div>
                            );
                          })}

                        <div className={`${styles.item1} ${styles.ul}`}>
                          <div className={styles.treelist}>
                            <div className={styles.paixuindex}>
                              {' '}
                              <span className={styles.span}>
                                {JSON.parse(item.detail).length + 2}
                              </span>
                            </div>
                            <div className={styles.head}>
                              <p>结束</p>
                              <p className={styles.start}>END</p>
                              <img src="./assets/start.png" className={styles.end} />
                            </div>
                          </div>
                        </div>
                      </div>{' '}
                      <div className={styles.clearfix} />
                    </div>
                  );
                })
              : null}
          </RadioGroup>
        </div>
        <div className={styles.clearfix} />
        <div className={styles.right}>
          <Button type="primary" onClick={this.Release} disabled={flag}>
            发布
          </Button>
        </div>
      </div>

      // </div>
    );
  }
}
export default recommendationLinkage;
