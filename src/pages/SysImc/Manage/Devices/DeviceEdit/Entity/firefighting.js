// 消防气体、消防喷淋

const loadFirefightingInfo = (data, device) => {
  const bascInfo1 = [
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
      name: 'eventControllerId',
      label: '机号',
      placeholder: '请输入机号',
      // rules: [{ required: true, message: '请输入机号' }],
      initialValue: data.eventControllerId || '',
    },
  ];

  const bascInfo2 = [
    {
      name: 'eventLoopPanelId',
      label: '回路盘号',
      placeholder: '请输入回路盘号',
      // rules: [{ required: true, message: '请输入回路盘号' }],
      initialValue: data.eventLoopPanelId || '',
    },
    {
      name: 'eventAddress',
      label: '地址号',
      placeholder: '请输入地址号',
      // rules: [{ required: true, message: '请输入地址号' }],
      initialValue: device.eventAddress || '',
    },
    {
      name: 'eventChannel',
      label: '通道号',
      placeholder: '请输入通道号',
      rules: [{ required: true, message: '请输入通道号' }],
      initialValue: device.eventChannel || '',
    },
    {
      name: 'panelCardType',
      label: '盘卡类型',
      placeholder: '请输入盘卡类型',
      // rules: [{ required: true, message: '请输入盘卡类型' }],
      initialValue: device.panelCardType || '',
    },
    {
      name: 'eventAlarmValue',
      label: '报警值',
      placeholder: '请输入报警值',
      // rules: [{ required: true, message: '请输入报警值' }],
      initialValue: device.eventAlarmValue || '',
    },
  ];

  return [
    { mark: 'card', info: bascInfo1, key: 'card001' },
    { mark: 'card', info: bascInfo2, key: 'card002' },
    { mark: 'image', info: {}, key: 'image003' },
  ];
};

export default loadFirefightingInfo;
