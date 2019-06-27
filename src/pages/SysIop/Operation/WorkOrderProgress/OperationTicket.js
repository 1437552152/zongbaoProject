import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, Button, Upload, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import StandardCard from '@/components/StandardCard';
import Host from '../../../../../config/url.config';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ workOrder, loading }) => ({
  workOrder,
  loading: loading.models.workOrder,
}))
class OperationTicket extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageToUpload: null,
      imageNameForUpload: null,
    };
  }

  componentDidMount() {
    this.fetchTicketTypeOptions();
  }

  fetchTicketTypeOptions = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/fetchTicketTypeOptions',
    });
  };

  onDownloadClick = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      window.open(`${Host}/services/monitor/workorder/download/2/${values.type}`);
    });
  };

  beforeTicketUpload = file => {
    const url = window.URL.createObjectURL(file);
    this.setState({
      imageToUpload: url,
      imageNameForUpload: file.name,
    });
    const { dispatch, match } = this.props;
    const { orderId } = match.params;
    dispatch({
      type: 'workOrder/uploadOperationTicket',
      payload: {
        id: orderId,
        file,
      },
      callback: () => {
        message.success('上传成功', 1, () => {
          router.goBack();
        });
      },
    });
    return false;
  };

  render() {
    const { imageToUpload, imageNameForUpload } = this.state;
    const {
      workOrder: { ticketTypeOptions },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <StandardCard full>
        <Form onSubmit={this.onDownloadClick} layout="inline">
          <FormItem label="类型">
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择类型' }],
            })(
              <Select placeholder="请选择类型" style={{ width: 200 }}>
                {ticketTypeOptions.map(value => {
                  return <Option key={value.id}>{value.desp}</Option>;
                })}
              </Select>
            )}
          </FormItem>
          <Button htmlType="submit" type="primary">
            下载空白操作票
          </Button>
        </Form>
        <Row type="flex" align="middle">
          <Col span={4}>上传工作票扫描件已完成</Col>
          <Col span={4}>{imageNameForUpload}</Col>
          <Col span={2}>
            <Upload
              showUploadList={false}
              accept="image/*"
              name="file"
              action=""
              beforeUpload={this.beforeTicketUpload}
            >
              <Button disabled={imageToUpload !== null}>选择</Button>
            </Upload>
          </Col>
        </Row>
        {imageToUpload && (
          <div style={{ marginTop: 12 }}>
            <img src={imageToUpload} alt="" />
          </div>
        )}
      </StandardCard>
    );
  }
}

export default OperationTicket;
