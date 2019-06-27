// 大屏
const loadLedInfo = (data, device = {}) => {
  const bascInfo = [
    {
      name: 'name',
      label: '设备名称',
      placeholder: '请输入设备名称',
      rules: [{ required: true, message: '请输入设备名称' }],
      initialValue: device.name || '',
    },
    {
      name: 'code',
      label: '设备编号',
      placeholder: '请输入设备编号',
      rules: [{ required: true, message: '请输入设备编号' }],
      initialValue: device.code || '',
    },
    {
      type: 1,
      name: 'dateOfManufacturer',
      label: '出厂日期',
      placeholder: '请选择出厂日期',
      // rules: [{ required: true, message: '请选择出厂日期' }],
      initialValue: device.dateOfManufacturer || '',
    },
    {
      type: 1,
      name: 'setupTime',
      label: '投运日期',
      placeholder: '请选择投运日期',
      // rules: [{ required: true, message: '请选择投运日期' }],
      initialValue: device.setupTime || '',
    },
    {
      name: 'content',
      label: '内容',
      placeholder: '请输入发布屏内容',
      // rules: [{ required: true, message: '请输入发布屏内容' }],
      initialValue: data.content || '',
    },
    {
      name: 'ip',
      label: 'ip',
      placeholder: '请输入发布屏ip地址',
      // rules: [{ required: true, message: '请输入发布屏ip地址' }],
      initialValue: data.ip || '',
    },
    {
      name: 'username',
      label: '用户名',
      placeholder: '请输入用户名',
      // rules: [{ required: true, message: '请输入用户名' }],
      initialValue: data.username || '',
    },
    {
      name: 'api',
      label: '接口地址',
      placeholder: '请输入接口地址',
      // rules: [{ required: true, message: '请输入接口地址' }],
      initialValue: data.api || '',
    },
  ];

  return [
    { mark: 'card', info: bascInfo, key: 'card001' },
    { mark: 'image', info: {}, key: 'image002' },
    { mark: 'space', info: {}, key: 'space002' },
  ];
};

export default loadLedInfo;
