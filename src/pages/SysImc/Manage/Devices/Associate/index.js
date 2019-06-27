import React from 'react';
import { connect } from 'dva';
import { Table, Form, Select, Row, Col, Button } from 'antd';
import styles from './associate.less';

import {
  loadAssociateTableColumns,
  loadAssociateTableDataSource,
  loadFilterData,
  loadInfo,
  loadDeviceInfo,
  loadQueryData,
} from './help';

const mapDispatchToProps = dispatch => {
  return {
    updateFilter: filter => dispatch({ type: 'associate/updateFilter', payload: filter }),
    updateListQuery: query => dispatch({ type: 'associate/updateListQuery', payload: query }),
    linkDevice: callback => dispatch({ type: 'associate/linkDevice', callback }),
    unlinkDevice: id => dispatch({ type: 'associate/unlinkDevice', payload: { id } }),
    loadAssociateDevice: () => dispatch({ type: 'associate/loadAssociateDevice' }),
  };
};

@connect(
  ({ associate, loading }) => ({
    associate,
    loading: loading.effects['associate/loadAssociateDevice'],
  }),
  mapDispatchToProps
)
@Form.create({
  onValuesChange(props, changedValues) {
    const { updateFilter, updateListQuery } = props;
    const { filter, query } = changedValues;
    props.form.resetFields();
    if (filter) {
      updateFilter(filter);
    } else if (query) {
      updateListQuery(query);
    }
  },
})
class Associate extends React.Component {
  onDetail = () => {
    // 跳转详情页面
  };

  render() {
    const { form, associate, linkDevice, unlinkDevice, loadAssociateDevice } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <img alt="" src="./assets/equipment/listplan.png" />
          <span>联动管理</span>
        </div>
        <Form className={styles.filter} labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
          <div className={styles.queryTool}>
            <Row className={styles.filterGroup} gutter={24}>
              {loadQueryData(associate.query).map(data => (
                <Col xxl={5} xs={8} key={data.key} className={styles.clearCol}>
                  <Form.Item label={data.title}>
                    {getFieldDecorator(data.key, {
                      initialValue: data.value,
                    })(
                      <Select placeholder={data.placeholder} disabled={data.options.length === 0}>
                        {data.options.map(opt => {
                          return (
                            <Select.Option key={opt.value || '-1'} value={opt.value}>
                              {opt.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              ))}
            </Row>
            <div className={styles.buttonContainer}>
              <Button onClick={loadAssociateDevice}>查询</Button>
            </div>
          </div>
        </Form>
        <Row type="flex" align="middle" justify="start" className={styles.infoLine} gutter={24}>
          {loadDeviceInfo(associate.deviceInfo).map(item => (
            <Col xxl={4} xs={6} key={item.key} className={styles.clearCol}>
              <span>{`${item.title}: `}</span>
              <span style={{ color: '#1D95E2FF' }}>{`${item.value}`}</span>
            </Col>
          ))}
        </Row>
        <Table
          scroll={{ y: 420 }}
          pagination={false}
          columns={loadAssociateTableColumns({ onDelete: unlinkDevice, onDetail: this.onDetail })}
          dataSource={loadAssociateTableDataSource(associate.deviceList)}
          className={styles.table}
          bordered
        />
        <Form className={styles.filter} labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
          <div className={styles.queryTool}>
            <Row className={styles.filterGroup} gutter={24}>
              {loadFilterData(associate.filter).map(data => (
                <Col xxl={4} xs={8} key={data.key} className={styles.clearCol}>
                  <Form.Item label={data.title}>
                    {getFieldDecorator(data.key, {
                      initialValue: data.value,
                    })(
                      <Select placeholder={data.placeholder} disabled={data.options.length === 0}>
                        {data.options.map(opt => {
                          return (
                            <Select.Option key={opt.value} value={opt.value}>
                              {opt.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </div>
        </Form>
        <Row type="flex" align="middle" justify="start" className={styles.selectedInfo} gutter={24}>
          {loadInfo(associate.selectedInfo).map(item => (
            <Col span={4} key={item.key} className={styles.col}>
              <span>{`${item.title}: `}</span>
              <span style={{ color: '#1D95E2FF' }}>{`${item.value}`}</span>
            </Col>
          ))}
        </Row>
        <Button
          disabled={!associate.filter.selectedDevice}
          className={styles.linkButton}
          onClick={() =>
            linkDevice(() => {
              form.resetFields();
            })
          }
        >
          关联
        </Button>
      </div>
    );
  }
}

export default Associate;
