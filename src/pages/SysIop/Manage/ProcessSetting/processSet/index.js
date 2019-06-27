import React from 'react';
// import { connect } from 'dva'
import {
  Divider,
  Table,
  Form,
  Input,
  Select,
  Breadcrumb,
  Button,
  Row,
  Col,
  DatePicker,
  Tabs,
  Steps,
  Menu,
  Icon,
} from 'antd';
import moment from 'moment';
import styles from './ProcessSet.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Step } = Steps;
const person = [
  {
    title1: '班长审批',
    title2: '张三    审批',
    dataIndex: 'index',
    key: 'index',
  },
];

const steps = [
  {
    title: person.map(item => (
      <div>
        <span className={styles.titleO} style={{ display: 'block' }}>
          {item.title1}
        </span>
        <span className={styles.titleT} style={{ display: 'block' }}>
          {item.title2}
        </span>
      </div>
    )),
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: person.map(item => (
      <div>
        <span className={styles.titleO} style={{ display: 'block' }}>
          {item.title1}
        </span>
        <span className={styles.titleT} style={{ display: 'block' }}>
          {item.title2}
        </span>
      </div>
    )),
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: person.map(item => (
      <div>
        <span className={styles.titleO} style={{ display: 'block' }}>
          {item.title1}
        </span>
        <span className={styles.titleT} style={{ display: 'block' }}>
          {item.title2}
        </span>
      </div>
    )),
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: person.map(item => (
      <div>
        <span className={styles.titleO} style={{ display: 'block' }}>
          {item.title1}
        </span>
        <span className={styles.titleT} style={{ display: 'block' }}>
          {item.title2}
        </span>
      </div>
    )),
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: person.map(item => (
      <div>
        <span className={styles.titleO} style={{ display: 'block' }}>
          {item.title1}
        </span>
        <span className={styles.titleT} style={{ display: 'block' }}>
          {item.title2}
        </span>
      </div>
    )),
    dataIndex: 'index',
    key: 'index',
  },
];

class ProcessSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // const values={id:1083};
    // dispatch({
    //   type: 'Recordview/getRecordviewList',
    //   payload: values
    // });
  }

  handleClick = e => {
    console.log('click ', e);
  };

  render() {
    return (
      <div className={styles.Recordview}>
        {/* 左侧导航 */}
        <div className={styles.asideLe}>
          <div className={styles.headContainer1}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href="">工作流</a>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Menu
            onClick={this.handleClick}
            style={{ width: '20%', marginTop: 50, height: 750 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="mail" />
                  <span>工作流</span>
                </span>
              }
            >
              <MenuItemGroup key="g1" title="常用工作流程">
                <Menu.Item key="1">维修审批流程</Menu.Item>
                <Menu.Item key="2">巡检审批流程</Menu.Item>
                <Menu.Item key="3">维护审批流程</Menu.Item>
              </MenuItemGroup>
              <MenuItemGroup key="g2" title="常用工作流程">
                <Menu.Item key="4">维修审批流程1</Menu.Item>
                <Menu.Item key="5">巡检审批流程2</Menu.Item>
                <Menu.Item key="6">维护审批流程3</Menu.Item>
              </MenuItemGroup>
            </SubMenu>
          </Menu>
        </div>
        {/* <div className={styles.stepBox}>
          <Steps style={{marginTop:50,marginLeft:30}}>
            {steps.map(item => (
              <Step key={item.key} title={item.title} styles={styles.stepItem} />
          ))}
          </Steps>
          <div className={styles.box} />
        </div> */}
        <div className={styles.asideRi}>
          <div className={styles.headContainer}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href="">维护审批</a>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className={styles.box}>
            <div className={styles.circl}>
              <span className={styles.circlNum}>1</span>
            </div>
            <div className={styles.PersonBox}>
              <span className={styles.firstName}>班长审批</span>
              <span className={styles.lineb} />
              <span className={styles.secName}>张三 审批</span>
            </div>
          </div>
          <div className={styles.IconJT}>
            <Icon
              type="arrow-right"
              style={{ position: 'absolute', top: 290, left: 980, fontSize: 30, color: 'blue' }}
            />
          </div>
          <div className={styles.box1}>
            <div className={styles.circl1}>
              <span className={styles.circlNum1}>2</span>
            </div>
            <div className={styles.PersonBox1}>
              <span className={styles.firstName1}>班长审批</span>
              <span className={styles.lineb1} />
              <span className={styles.secName1}>张三 审批</span>
            </div>
          </div>
          <div className={styles.IconJT}>
            <Icon
              type="arrow-right"
              style={{ position: 'absolute', top: 290, left: 1390, fontSize: 30, color: 'blue' }}
            />
          </div>
          <div className={styles.box2}>
            <div className={styles.circl2}>
              <span className={styles.circlNum2}>3</span>
            </div>
            <div className={styles.PersonBox2}>
              <span className={styles.firstName2}>班长审批</span>
              <span className={styles.lineb2} />
              <span className={styles.secName2}>张三 审批</span>
            </div>
          </div>
          <div className={styles.IconJT}>
            <Icon
              type="arrow-right"
              style={{ position: 'absolute', top: 290, left: 1770, fontSize: 30, color: 'blue' }}
            />
          </div>
          <div className={styles.box3}>
            <div className={styles.circl3}>
              <span className={styles.circlNum3}>4</span>
            </div>
            <div className={styles.PersonBox3}>
              <span className={styles.firstName3}>班长审批</span>
              <span className={styles.lineb3} />
              <span className={styles.secName3}>张三 审批</span>
            </div>
          </div>
          <div className={styles.IconJT}>
            <Icon
              type="arrow-right"
              style={{ position: 'absolute', top: 540, left: 980, fontSize: 30, color: 'blue' }}
            />
          </div>
          <div className={styles.box4}>
            <div className={styles.circl4}>
              <span className={styles.circlNum4}>5</span>
            </div>
            <div className={styles.PersonBox4}>
              <span className={styles.firstName4}>班长审批</span>
              <span className={styles.lineb4} />
              <span className={styles.secName4}>张三 审批</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProcessSet;
