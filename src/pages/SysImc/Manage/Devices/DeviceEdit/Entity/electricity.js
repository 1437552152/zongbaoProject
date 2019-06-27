// 01消防 04火灾 对应的所有子类型

const loadElectricityInfo = (data, device) => {
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
      type: 2,
      name: 'isFree', // 0 不收费，1收费
      label: '是否收费',
      placeholder: '请选择是否收费',
      rules: [{ required: true, message: '请选择是否收费' }],
      initialValue: data.isFree || '',
    },
    {
      name: 'newDeviceNumber',
      label: ' 新设备号',
      placeholder: '请输入新设备号',
      // rules: [{ required: true, message: '请输入新设备号' }],
      initialValue: data.newDeviceNumber || '',
    },
    {
      name: 'times',
      label: ' 频率',
      placeholder: '请输入频率',
      // rules: [{ required: true, message: '请输入频率' }],
      initialValue: data.times || '',
    },
  ];

  return [
    { mark: 'card', info: bascInfo, key: 'card001' },
    { mark: 'image', info: {}, key: 'image002' },
    { mark: 'space', info: {}, key: 'space003' },
  ];
};

export default loadElectricityInfo;
