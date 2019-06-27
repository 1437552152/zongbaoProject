import React from 'react';
import { Form, Input, Button, Modal } from 'antd';

const FormItem = Form.Item;

const FormInput = Form.create()(props => {
  const { form, handleCommit, content, title, visible, handleCancel, inputType, id } = props;

  const { validateFields, getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, fvalues) => {
      if (err) {
        return;
      }
      form.resetFields();
      handleCommit(id, inputType, fvalues.content);
    });
  };

  const clear = () => {
    form.resetFields();
    handleCancel();
  };

  return (
    <Modal title={title} visible={visible} onCancel={clear} footer={null}>
      <Form onSubmit={e => handleSubmit(e)} style={{ textAlign: 'center' }}>
        <FormItem>
          {getFieldDecorator('content', {
            initialValue: content || '',
            rules: [
              {
                required: true,
                message: '请填写内容',
              },
            ],
          })(<Input.TextArea autosize={{ minRows: 6 }} maxLength={500} />)}
        </FormItem>
        <Button key="back" onClick={clear} style={{ marginRight: 16 }}>
          返回
        </Button>
        <Button key="submit" htmlType="submit" type="primary">
          确定
        </Button>
      </Form>
    </Modal>
  );
});
export default FormInput;
