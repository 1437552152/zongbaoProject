import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Select,
  Icon,
  Radio,
  Checkbox,
  Table,
  Pagination,
  Card,
  Tabs,
  Upload,
  message,
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';

import StandardCard from '@/components/StandardCard';

const { Option } = Select;
const { TabPane } = Tabs;
// const CheckboxGroup = Checkbox.Group;

@connect(({ fileModal }) => ({
  fileModal,
}))
@Form.create()
class chipStyles extends Component {
  state = {
    total: 500,
    current: 1,
    pageSize: 10,
    current1: 1,
    pageSize1: 10,
    afterIcon: <Icon type="edit" />,
    fileList: [],
    uploading: false,
  };

  inputChange = e => {
    const { value } = e.target;
    if (value !== '' && value !== undefined) {
      this.setState({
        afterIcon: <Icon type="check-circle" theme="filled" />,
      });
    } else {
      this.setState({
        afterIcon: <Icon type="edit" />,
      });
    }
  };

  handleUpload = () => {
    const { dispatch } = this.props;
    const { fileList } = this.state;
    this.setState({
      uploading: true,
    });

    dispatch({
      type: 'fileModal/upload',
      payload: {
        files: fileList,
      },
      callback: resp => {
        if (resp && resp.sucess) {
          this.setState({
            fileList: [],
            uploading: false,
          });
          message.success('上传成功');
        } else {
          this.setState({
            uploading: false,
          });
          message.error('上传失败');
        }
      },
    });
  };

  renderUpload = () => {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(() => ({
          // fileList: [...state.fileList, file],
          fileList: [file], // 只上传一个文件
        }));
        return false;
      },
      fileList,
    };
    return (
      <div style={{ marginTop: 32 }}>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> 选择文件
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? '上传中' : '开始上传'}
        </Button>
      </div>
    );
  };

  render() {
    const { selectedKeys } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: selectedRowKeys => {
        this.setState({
          // selecItems: selectedRows,
          selectedKeys: selectedRowKeys,
        });
      },
    };
    const columns = [
      {
        title: '表头A',
        dataIndex: 'name1',
      },
      {
        title: '表头B',
        dataIndex: 'name2',
      },
      {
        title: '表头C',
        dataIndex: 'name3',
      },
    ];
    const { total, current, pageSize, current1, pageSize1, afterIcon } = this.state;
    const itemRender = (curr, type, originalElement) => {
      // console.log(curr);
      if (type === 'prev') {
        return <a>上一页</a>;
      }
      if (type === 'next') {
        return <a>下一页</a>;
      }
      return originalElement;
    };
    const tableData = [
      {
        key: 1,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 2,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 3,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 4,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 5,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 6,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 7,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 8,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 9,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 10,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 11,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 12,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 13,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 14,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 15,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
      {
        key: 16,
        name1: '显示内容',
        name2: '显示内容',
        name3: '显示内容',
      },
    ];
    return (
      <div>
        <p>1.按钮样式</p>
        <Row span={24} className={styles.btn_box}>
          <Button type="primary" className="multicolor_btn">
            按钮1
          </Button>
          <Button type="primary" className="blue_btn">
            按钮2
          </Button>
          <Button type="primary" className="red_btn">
            按钮3
          </Button>
          <Button type="primary" className="green_btn">
            按钮4
          </Button>
          <Button type="primary" className="pithy_btn">
            按钮5
          </Button>
        </Row>
        <p>2.输入框样式</p>
        <Row span={24}>
          <Input placeholder="请输入" style={{ width: '300px' }} />
        </Row>
        <Row span={24}>
          <Input
            placeholder="请输入"
            style={{ width: '300px' }}
            suffix={afterIcon}
            onChange={this.inputChange}
          />
        </Row>
        <p>3.选择框样式</p>
        <Row span={24}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="请选择"
            suffixIcon={<Icon type="caret-down" />}
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
          </Select>
        </Row>
        <p>4.单选样式</p>
        <Row span={24}>
          <Radio.Group name="radiogroup" defaultValue={1}>
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
            <Radio value={3}>C</Radio>
            <Radio value={4}>D</Radio>
          </Radio.Group>
        </Row>
        <p>5.多选样式</p>
        <Row span={24}>
          <Checkbox.Group>
            <Checkbox value="A">A</Checkbox>
            <Checkbox value="B">B</Checkbox>
            <Checkbox value="C" disabled>
              C
            </Checkbox>
            <Checkbox value="D" disabled>
              D
            </Checkbox>
          </Checkbox.Group>
        </Row>
        <p>6.表格样式</p>
        <Row span={24}>
          <Table
            rowSelection={rowSelection}
            dataSource={tableData}
            columns={columns}
            bordered
            pagination={{
              pageSize: pageSize1,
              current: current1,
              showSizeChanger: true,
              showQuickJumper: { goButton: <Button>确定</Button> },
              itemRender,
              total: tableData.length,
              showTotal: totals => {
                return (
                  <span>
                    当前：第<font>{current1}</font>
                    <font>/</font>
                    <font>{Math.ceil(Number(totals) / Number(pageSize1))}</font>
                    页&nbsp;&nbsp;共
                    <font>{totals}</font>条记录&nbsp;&nbsp;每页
                    <font>{pageSize1}</font>条
                  </span>
                );
              },
              onChange: (page, size) => {
                this.setState({
                  current1: page,
                  pageSize1: size,
                });
              },
              onShowSizeChange: (page, size) => {
                this.setState({
                  current1: page,
                  pageSize1: size,
                });
              },
            }}
          />
        </Row>
        <p>7.翻页样式</p>
        <Row span={24}>
          <Pagination
            pageSize={pageSize}
            current={current}
            showSizeChanger
            showQuickJumper={{ goButton: <Button>确定</Button> }}
            itemRender={itemRender}
            total={total}
            showTotal={totals => {
              return (
                <span>
                  当前：第<font>{current}</font>
                  <font>/</font>
                  <font>{Math.ceil(Number(totals) / Number(pageSize))}</font>
                  页&nbsp;&nbsp;共
                  <font>{totals}</font>条记录&nbsp;&nbsp;每页
                  <font>{pageSize}</font>条
                </span>
              );
            }}
            onChange={(page, size) => {
              this.setState({
                current: page,
                pageSize: size,
              });
            }}
            onShowSizeChange={(page, size) => {
              this.setState({
                current: page,
                pageSize: size,
              });
            }}
          />
        </Row>
        <Card className="card_container" title="123" style={{ marginTop: 32 }}>
          test
        </Card>
        <Tabs type="card" style={{ marginTop: 32 }}>
          <TabPane tab="Tab 1" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
        {/*<StandardCard src="./assets/common/peizhi.png" style={{ marginTop: 32 }}>*/}
        {/*  RouterCard*/}
        {/*  <StandardCard.Meta title="StandardCard.Meta" />*/}
        {/*  高度为内容高度*/}
        {/*</StandardCard>*/}
        {/*<StandardCard src="./assets/common/peizhi.png" style={{ marginTop: 32 }} full>*/}
        {/*  RouterCard*/}
        {/*  <StandardCard.Meta*/}
        {/*    title="StandardCard.Meta"*/}
        {/*    titleStyle={{ color: 'red', fontSize: 22 }}*/}
        {/*  />*/}
        {/*  高度占满*/}
        {/*</StandardCard>*/}
        {this.renderUpload()}
      </div>
    );
  }
}
export default chipStyles;
