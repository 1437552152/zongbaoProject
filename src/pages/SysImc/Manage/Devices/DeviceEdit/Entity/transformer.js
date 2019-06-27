import { regExp } from '@/utils/regAndFunc';

// 变压器
const loadTransformerInfo = (deviceTransformer = {}, device = {}) => {
  const basicInfo1 = [
    {
      name: 'name',
      label: '设备名称',
      placeholder: '请输入设备名称',
      rules: [{ required: true, message: '请输入设备名称' }],
      initialValue: device.name || '',
    },
    {
      name: 'model',
      label: '规格型号',
      placeholder: '请输入规格型号',
      // rules: [{ required: true, message: '请输入规格型号' }],
      initialValue: deviceTransformer.model || '',
    },
    {
      name: 'ratedVoltage',
      label: '额定电压kV',
      placeholder: '请输入额定电压',
      rules: [
        // { required: true, message: '请输入额定电压' },
        { pattern: regExp.isIntOrFloat, message: '请输入最多带4位小数的数字' },
      ],
      initialValue: deviceTransformer.ratedVoltage || '',
    },
    {
      name: 'windlessBlowingCapacity',
      label: '无风吹容量kVA',
      placeholder: '请输入无风吹容量',
      rules: [
        // { required: true, message: '请输入无风吹容量' },
        { pattern: regExp.isIntOrFloat, message: '请输入最多带4位小数的数字' },
      ],
      initialValue: deviceTransformer.windlessBlowingCapacity || '',
    },
    {
      name: 'noLoadCurrent',
      label: '空载电流A',
      placeholder: '请输入空载电流',
      rules: [
        // { required: true, message: '请输入空载电流' },
        { pattern: regExp.isIntOrFloat, message: '请输入最多带4位小数的数字' },
      ],
      initialValue: deviceTransformer.noLoadCurrent || '',
    },
    {
      name: 'noLoadLoss',
      label: '空载损耗kW',
      placeholder: '请输入空载损耗',
      rules: [
        // { required: true, message: '请输入空载损耗' },
        { pattern: regExp.isIntOrFloat, message: '请输入最多带4位小数的数字' },
      ],
      initialValue: deviceTransformer.noLoadLoss || '',
    },
    {
      name: 'loadLoss',
      label: '负载损耗kW',
      placeholder: '请输入负载损耗',
      rules: [
        // { required: true, message: '请输入负载损耗' },
        { pattern: regExp.isIntOrFloat, message: '请输入最多带4位小数的数字' },
      ],
      initialValue: deviceTransformer.loadLoss || '',
    },
    {
      name: 'impedanceVoltage',
      label: '阻抗电压',
      placeholder: '请输入阻抗电压',
      rules: [
        // { required: true, message: '请输入阻抗电压' },
        { pattern: regExp.isIntOrFloat, message: '请输入最多带4位小数的数字' },
      ],
      initialValue: deviceTransformer.impedanceVoltage || '',
    },
  ];

  const basicInfo2 = [
    {
      name: 'code',
      label: '设备编号',
      placeholder: '请输入设备编号',
      rules: [{ required: true, message: '请输入设备编号' }],
      initialValue: device.code || '',
    },
    {
      name: 'ratedCapacity',
      label: '额定容量kVA',
      placeholder: '请输入额定容量',
      rules: [
        // { required: true, message: '请输入额定容量' },
        { pattern: regExp.isIntOrFloat, message: '请输入最多带4位小数的数字' },
      ],
      initialValue: deviceTransformer.ratedCapacity || '',
    },
    {
      name: 'ratedPower',
      label: '额定功率Hz',
      placeholder: '请输入额定功率',
      rules: [
        // { required: true, message: '请输入额定功率' },
        { pattern: regExp.isIntOrFloat, message: '请输入最多带4位小数的数字' },
      ],
      initialValue: deviceTransformer.ratedPower || '',
    },
    {
      name: 'connectionGroup',
      label: '接线组别',
      placeholder: '请输入接线组别',
      // rules: [{ required: true, message: '请输入接线组别' }],
      initialValue: deviceTransformer.connectionGroup || '',
    },
    {
      name: 'useCondition',
      label: '使用条件',
      placeholder: '请输入使用条件',
      // rules: [{ required: true, message: '请输入使用条件' }],
      initialValue: deviceTransformer.useCondition || '',
    },
    {
      name: 'coolingMode',
      label: '冷却方式',
      placeholder: '请输入冷却方式',
      // rules: [{ required: true, message: '请输入冷却方式' }],
      initialValue: deviceTransformer.coolingMode || '',
    },
    {
      name: 'productCode',
      label: '产品代号',
      placeholder: '请输入产品代号',
      // rules: [{ required: true, message: '请输入产品代号' }],
      initialValue: deviceTransformer.productCode || '',
    },
    {
      name: 'remark',
      label: '备注',
      placeholder: '请输入备注',
      // rules: [{ required: true, message: '请输入备注' }],
      initialValue: deviceTransformer.remark || '',
    },
  ];

  const basicInfo3 = [
    {
      name: 'standardCode',
      label: '标准代号',
      placeholder: '请输入标准代号',
      // rules: [{ required: true, message: '请输入标准代号' }],
      initialValue: deviceTransformer.standardCode || '',
    },
    {
      name: 'weight',
      label: '器身/油重量KG',
      placeholder: '请输入器身/油重量',
      rules: [
        // { required: true, message: '请输入器身/油入重量' },
        { pattern: regExp.isIntOrFloat, message: '请输入最多带4位小数的数字' },
      ],
      initialValue: deviceTransformer.weight || '',
    },
    {
      name: 'manufacturer',
      label: '生产厂家',
      placeholder: '请输入生产厂家',
      // rules: [{ required: true, message: '请输入生产厂家' }],
      initialValue: deviceTransformer.manufacturer || '',
    },
    {
      name: 'serialNumber',
      label: '出厂序号',
      placeholder: '请输入出厂序号',
      // rules: [{ required: true, message: '请输入出厂序号' }],
      initialValue: deviceTransformer.serialNumber || '',
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
      name: 'insulationLevel',
      label: '绝缘水平',
      placeholder: '请输入绝缘水平',
      // rules: [{ required: true, message: '请输入绝缘水平' }],
      initialValue: deviceTransformer.insulationLevel || '',
    },
  ];

  return [
    { mark: 'card', info: basicInfo1, key: 'card001' },
    { mark: 'card', info: basicInfo2, key: 'card002' },
    { mark: 'card', info: basicInfo3, key: 'card003' },
  ];
};

export default loadTransformerInfo;
