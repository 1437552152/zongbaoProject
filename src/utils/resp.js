import { message } from 'antd';

export function judge({ code, msg } = {}) {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
}

export default judge;
