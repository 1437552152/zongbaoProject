import React from 'react';
import { Modal } from 'antd';

class delModal extends React.PureComponent {
  render() {
    const { onOk, onCancel, title, state, deleteComfirmTxt } = this.props;
    const config = {
      onOk: () => {
        onOk();
      },
      onCancel: () => {
        onCancel();
      },
      visible: state === 1,
      title,
    };
    return (
      <Modal {...config}>
        <div>
          <p>{deleteComfirmTxt}</p>
        </div>
      </Modal>
    );
  }
}

export default delModal;
