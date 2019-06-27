// 视频设备
const loadVideoInfo = (data = {}, device = {}) => {
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
      name: 'ip',
      label: '设备Ip',
      placeholder: '请输入设备ip',
      // rules: [{ required: true, message: '请输入设备ip' }],
      initialValue: data.ip || '',
    },
    {
      name: 'videoStream',
      label: '视频流地址',
      placeholder: '请输入视频流地址',
      // rules: [{ required: true, message: '请输入视频流地址' }],
      initialValue: data.videoStream || '',
    },
    {
      name: 'deviceType',
      label: '设备型号',
      placeholder: '请输入设备型号',
      // rules: [{ required: true, message: '请输入设备型号' }],
      initialValue: data.deviceType || '',
    },
    {
      name: 'safetyStatus',
      label: '安全状态',
      placeholder: '请输入安全状态',
      // rules: [{ required: true, message: '请输入安全状态' }],
      initialValue: data.safetyStatus || '',
    },
  ];

  const bascInfo2 = [
    {
      name: 'softwareVersion',
      label: '软件版本',
      placeholder: '请输入软件版本',
      initialValue: data.softwareVersion || '',
    },
    {
      name: 'ipv4Network',
      label: 'IPV4网管',
      placeholder: '请输入IPV4网管',
      initialValue: data.ipv4Network || '',
    },
    {
      name: 'subnetMask',
      label: '子网掩码',
      placeholder: '请输入子网掩码',
      initialValue: data.subnetMask || '',
    },
    {
      name: 'macAddress',
      label: '物理地址',
      placeholder: '请输入物理地址',
      initialValue: data.macAddress || '',
    },
    {
      name: 'numberChannel',
      label: '编码通道数',
      placeholder: '请输入编码通道数',
      initialValue: data.numberChannel || '',
    },
    {
      name: 'dspVersion',
      label: 'DSP版本',
      placeholder: '请输入DSP版本',
      initialValue: data.dspVersion || '',
    },
    {
      name: 'ipv4DhcpStatus',
      label: 'IPV4 DHCP状态',
      placeholder: '请输入IPV4 DHCP状态',
      initialValue: data.ipv4DhcpStatus || '',
    },
    {
      name: 'channels',
      label: '通道号',
      placeholder: '请输入通道号',
      initialValue: data.channels || '',
    },
  ];

  const bascInfo3 = [
    {
      name: 'isDhcp',
      label: '是否支持DHCP',
      placeholder: '是否支持DHCP',
      initialValue: data.isDhcp || '',
    },
    {
      name: 'ipv6Address',
      label: 'IPV6地址',
      placeholder: '请输入IPV6地址',
      initialValue: data.ipv6Address || '',
    },
    {
      name: 'ipv6Network',
      label: 'IPV6网关',
      placeholder: '请输入IPV6网关',
      initialValue: data.ipv6Network || '',
    },
    {
      name: 'ipv6Len',
      label: 'IPV6子网前缀长度',
      placeholder: '请输入IPV6子网前缀长度',
      initialValue: data.ipv6Len || '',
    },
    {
      name: 'isIpv6',
      label: '是否支持IPV6',
      placeholder: '请输入是否支持IPV6',
      initialValue: data.isIpv6 || '',
    },
    {
      name: 'isUpdateIpv6',
      label: '是否支持修改IPV6',
      placeholder: '请输入是否支持修改IPV6',
      initialValue: data.isUpdateIpv6 || '',
    },
    {
      name: 'gisCode',
      label: 'GIS编码',
      placeholder: '请输入GIS编码',
      initialValue: data.gisCode || '',
    },
    {
      name: 'gisName',
      label: 'GIS名称',
      placeholder: '请输入GIS名称',
      initialValue: data.gisName || '',
    },
  ];

  return [
    { mark: 'card', info: bascInfo1, key: 'card001' },
    { mark: 'card', info: bascInfo2, key: 'card002' },
    { mark: 'card', info: bascInfo3, key: 'card003' },
  ];
};

export default loadVideoInfo;
