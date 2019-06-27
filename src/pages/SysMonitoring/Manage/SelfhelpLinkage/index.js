import React from 'react';
import { connect } from 'dva';
import { Form, message } from 'antd';
import styles from './index.less';
import TreeArr from '@/components/tree/TreeArr';
import StandardCard from '@/components/StandardCard';

@Form.create()
@connect(({ SelfhelpLink, loading }) => ({
  SelfhelpLink,
  loading: loading.effects['*'],
}))
class SelfhelpLinkage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      planIds: [],
      alarmId: '',
      areaId: '',
      id: '',
    };
  }

  componentDidMount() {
    const {
      location: { query },
    } = this.props;
    const { alarmId, areaId, id } = query;
    this.setState({ alarmId, areaId, id });
    const { dispatch } = this.props;
    const values = {};
    dispatch({
      type: 'SelfhelpLink/getPlanNodelist',
      payload: values,
    });
  }

  // 去除空数组
  removeEmptyArrayEle = arr => {
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i] === undefined || arr[i].length === 0) {
        arr.splice(i, 1);
        i -= 1;
      }
    }
    return arr;
  };

  Release = () => {
    const {
      dispatch,
      SelfhelpLink: { data },
    } = this.props;
    const { planIds, alarmId, areaId, id } = this.state;
    // 获取选中的下标
    const arrindex = [];
    planIds.forEach((item, index) => {
      if (item && item.length > 0) {
        arrindex.push(index);
      }
    });

    // 获取data中对应的list
    const detail = [];
    arrindex.forEach(item => {
      detail.push(data.list[item]);
    });

    // 数组去除空，undefinded，并将二维数组转为一维数组
    const planIdsbak = [...planIds];
    const arrIds = this.removeEmptyArrayEle(planIdsbak);
    let arr = [];
    arrIds.forEach(item => {
      arr = arr.concat(item);
    });
    // 触发提交
    const values = {
      detail,
      planIds: arr,
      alarmId,
      areaId,
      id,
    };
    if (arr && arr.length > 0) {
      dispatch({
        type: 'SelfhelpLink/planCreate',
        payload: values,
      });
    } else {
      message.error('请选择方案');
    }
  };

  handleLegendClick = (checkedKeys, info) => {
    console.log('checkedKeys==>', checkedKeys, info.node.props.ite);
    const { planIds } = this.state;
    planIds[info.node.props.ite] = checkedKeys || [];
    this.setState({ planIds });
  };

  render() {
    const {
      SelfhelpLink: { data },
    } = this.props;

    return (
      <StandardCard src="./assets/liandong.png">
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
              </div>
            </div>
            {data && data.list && data.list.length > 0
              ? data.list.map((item, index) => {
                  return (
                    <div className={styles.item1}>
                      {' '}
                      <div className={styles.paixuindex}>
                        {' '}
                        <span className={styles.span}>{index + 2}</span>{' '}
                      </div>
                      <TreeArr
                        datalist={item}
                        index={index}
                        discheck={false}
                        handleLegendClick={this.handleLegendClick}
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
                {/* <div className={styles.right}>
                  <Button type="primary" onClick={this.Release} size={size}>
                    发布
                  </Button>
                </div> */}
                <img src="./assets/start.png" className={styles.end} alt="" />
              </div>
            </div>
            {/* <div className={styles.clearfix}></div> */}
          </div>
        </div>
      </StandardCard>
    );
  }
}

export default SelfhelpLinkage;
