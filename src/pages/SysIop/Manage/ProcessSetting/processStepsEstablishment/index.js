import React, { PureComponent } from 'react';
import { Breadcrumb, Collapse, Button } from 'antd';
import StandardCard from '@/components/StandardCard';
import styles from './processStepsEstablishment.less';

const { Panel } = Collapse;

export default class processStepsEstablishment extends PureComponent {
  state = {
    expandIconPosition: 'right',
  };

  callback = key => {
    console.log(key);
  };

  text = () => {
    const table = (
      <table border="1" cellSpacing="0" cellPadding="0">
        <tr border="1">
          <th>人员</th>
          <td>张三</td>
        </tr>
        <tr>
          <th>时间</th>
          <td>点检开始前</td>
        </tr>
        <tr>
          <th>步骤</th>
          <td>
          ewkrowjrewrkerkoerkoffkfdks
          </td>
        </tr>
        <tr>
          <th>关键点</th>
          <td>仪器工具 安全用具准备</td>
        </tr>
      </table>
    );
    return table;
  };

  render() {
    const genhead = () => (
      <div className={styles.CollapseHead}>
        <span>步骤1</span>点检准备
        <span />
      </div>
    );
    const { expandIconPosition } = this.state;
    return (
      <StandardCard>
        <div className={styles.container}>
          <div className={styles.left}>这里是不是有个工作流的树？</div>
          <div className={styles.right}>
            <div className={styles.menubrad}>
              <div>
                <Breadcrumb>
                  <Breadcrumb.Item>点检流程</Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <a href="">日常点检</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <a href="">安防日常点检(摄像头)</a>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>

            <div className={styles.tablestyle}>
              <Collapse
                defaultActiveKey={['1']}
                onChange={this.callback}
                expandIconPosition={expandIconPosition}
              >
                <Panel header={genhead()} key="1">
                  <div>{this.text()}</div>
                </Panel>
                <Panel header={genhead()} key="2">
                  <div>{this.text()}</div>
                </Panel>
                <Panel header={genhead()} key="3">
                  <div>{this.text()}</div>
                </Panel>
              </Collapse>
            </div>
            <div className={styles.save}>
              <Button type="primary">保存</Button>
            </div>
          </div>
        </div>
      </StandardCard>
    );
  }
}
