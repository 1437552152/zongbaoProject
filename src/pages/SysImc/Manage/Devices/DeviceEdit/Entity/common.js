// 设备通用数据

import { regExp } from '@/utils/regAndFunc';

const loadCommonInfo = (dtype = '01', subType, deviceTransformer = {}, device = {}) => {
  let configInfo = [
    {
      name: 'assetNumber',
      label: '资产编号',
      placeholder: '请输入资产编号',
      // rules: [{ required: true, message: '请输入资产编号' }],
      initialValue: device.assetNumber || '',
    },
    {
      name: 'address',
      label: '安装地点',
      placeholder: '请输入安装地点',
      // rules: [{ required: true, message: '请输入安装地点' }],
      initialValue: device.address || '',
    },
    {
      name: 'typeOfElectricityUsed',
      label: '所属用电类型',
      placeholder: '请输入所属用电类型',
      // rules: [{ required: true, message: '请输入所属用电类型' }],
      initialValue: deviceTransformer.typeOfElectricityUsed || '',
    },
    {
      name: 'usageState',
      label: '使用状态',
      placeholder: '请输入使用状态',
      // rules: [{ required: true, message: '请输入使用状态' }],
      initialValue: device.usageState || '',
    },
    {
      type: 2,
      name: 'area',
      label: '所属区域',
      placeholder: '请选择所属区域',
      rules: [{ required: true, message: '所属区域不能为空' }],
      initialValue: device.area || '',
    },
    {
      type: 2,
      name: 'building',
      label: '所属建筑',
      placeholder: '请选择所属建筑',
      rules: [{ required: true, message: '所属建筑不能为空' }],
      initialValue: device.building || '',
    },
    {
      type: 2,
      name: 'floor',
      label: '所属楼层',
      placeholder: '请选择所属楼层',
      rules: [{ required: true, message: '所属楼层不能为空' }],
      initialValue: device.floor || '',
    },
    {
      type: 2,
      name: 'areaId',
      label: '所属房间',
      placeholder: '请选择所属房间',
      rules: [{ required: true, message: '所属房间不能为空' }],
      initialValue: device.areaId || '',
    },
    {
      name: 'point',
      label: '能耗监测点',
      placeholder: '请输入能耗监测点',
      // rules: [{ required: true, message: '请输入能耗监测点' }],
      initialValue: deviceTransformer.point || '',
    },
  ];

  const maintInfo = [
    {
      type: 2,
      name: 'status',
      label: '设备状态',
      placeholder: '请选择设备状态',
      // rules: [{ required: true, message: '请输入设备状态' }],
      initialValue: device.status || '',
    },
    {
      name: 'deviceUnit',
      label: '设备负责部门',
      placeholder: '请输入设备负责部门',
      // rules: [{ required: true, message: '请输入设备负责部门' }],
      initialValue: device.deviceUnit || '',
    },
    {
      name: 'deviceUser',
      label: '联系人',
      placeholder: '请输入联系人',
      // rules: [{ required: true, message: '请输入联系人' }],
      initialValue: device.deviceUser || '',
    },
    {
      name: 'deviceTel',
      label: '电话',
      placeholder: '请输入电话',
      rules: [
        // { required: true, message: '请输入电话' },
        { pattern: regExp.isPhone, message: '请输入正确的电话号码' },
      ],
      initialValue: device.deviceTel || '',
    },
    {
      name: 'guarantee',
      label: '保修期(年)',
      placeholder: '请输入保修期',
      // rules: [{ required: true, message: '请输入保修期' }],
      initialValue: device.guarantee || '',
    },
    {
      name: 'supplier',
      label: '供应商',
      placeholder: '请输入供应商',
      // rules: [{ required: true, message: '请输入供应商' }],
      initialValue: device.supplier || '',
    },
    {
      name: 'supplierUser',
      label: '联系人',
      placeholder: '请输入供应商联系人',
      // rules: [{ required: true, message: '请输入供应商联系人' }],
      initialValue: device.supplierUser || '',
    },
    {
      name: 'supplierTel',
      label: '电话',
      placeholder: '请输入供应商电话',
      rules: [
        // { required: true, message: '请输入供应商电话' },
        { pattern: regExp.isPhone, message: '请输入正确的电话号码' },
      ],
      initialValue: device.supplierTel || '',
    },
  ];

  if (`${subType}` !== '1101') {
    // 非变压器设备 去掉所属用电类型和能耗监测点
    configInfo = configInfo.filter(
      item => item.name !== 'typeOfElectricityUsed' && item.name !== 'point'
    );
  }

  if (`${dtype}` === '02' || `${subType}` === '1101') {
    // 02视频对应的所有子类型设备 或者 变压器设备
    return [
      { mark: 'card', info: configInfo, name: '配置信息', key: 'card001' },
      { mark: 'card', info: maintInfo, name: '维护信息', key: 'card002' },
      { mark: 'image', info: {}, name: '', key: 'image003' },
    ];
  }

  return [
    { mark: 'card', info: configInfo, name: '配置信息', key: 'card001' },
    { mark: 'card', info: maintInfo, name: '维护信息', key: 'card002' },
    { mark: 'space', info: {}, name: '', key: 'space003' },
  ];
};

export default loadCommonInfo;
