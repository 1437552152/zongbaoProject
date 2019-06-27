// 门禁
const loadDoorInfo = (data, device = {}) => {
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
      name: 'remark',
      label: '备注',
      placeholder: '请输入备注',
      // rules: [{ required: true, message: '请输入备注' }],
      initialValue: data.remark || '',
    },
  ];

  return [
    { mark: 'card', info: bascInfo, key: 'card001' },
    { mark: 'image', info: {}, key: 'image002' },
    { mark: 'space', info: {}, key: 'space002' },
  ];
};

export default loadDoorInfo;
