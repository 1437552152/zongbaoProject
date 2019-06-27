import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import styles from './modalForm.less';

const renderItem = {
  input: (_, message, disabled) => {
    return <Input disabled={disabled} placeholder={message || ''} />;
  },

  select: (datas, message) => {
    const { options, title, value } = datas;
    return (
      <Select placeholder={message || '请选择启用状态'}>
        {options.map(item => (
          <Select.Option key={item.value || item[value]} value={item.value || item[value]}>
            {item.title || item[title]}
          </Select.Option>
        ))}
      </Select>
    );
  },
};

@Form.create()
class ModalForm extends React.PureComponent {
  render() {
    const { form, onOk, onCancel, title, state, datas } = this.props;
    const config = {
      onOk: () => {
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          // 如果外部返回true  禁止重置，这样处理是为了解决人员维护的bug
          if (!onOk(values, state)) {
            form.resetFields();
          }
        });
      },
      onCancel: () => {
        onCancel();
        form.resetFields();
      },
      visible: state === 1 || state === 2,
      title,
    };
    return (
      <Modal {...config} className={styles.main}>
        <Form>
          {datas.map(item => (
            <Form.Item key={item.field} label={item.label}>
              {form.getFieldDecorator(item.field, {
                rules: [{ required: true, message: item.message }],
                initialValue: item.value,
              })(
                renderItem[item.type](
                  item.datas,
                  item.message,
                  item.disabled ? item.disabled : false
                )
              )}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    );
  }
}

export default ModalForm;
