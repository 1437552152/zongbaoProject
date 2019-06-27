import React from 'react';

export const loadAssociateTableColumns = ({ onDelete, onDetail }) => [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    align: 'center',
    width: '15%',
  },
  {
    title: '设备编码',
    dataIndex: 'deviceCode',
    align: 'center',
    width: '10%',
  },
  {
    title: '设备位置',
    dataIndex: 'deviceAddress',
    align: 'center',
    width: '25%',
  },
  {
    title: '安装时间',
    dataIndex: 'installTime',
    align: 'center',
    width: '13%',
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    align: 'center',
    width: '15%',
  },
  {
    title: '设备详情',
    dataIndex: 'deviceDetail',
    align: 'center',
    width: '7%',
    render: (_, record) => <a onClick={() => onDetail(record.meta.id)}>详情</a>,
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    align: 'center',
    width: '10%',
  },
  {
    title: '操作',
    dataIndex: 'delete',
    render: (_, record) => <a onClick={() => onDelete(record.meta.id)}>删除</a>,
    width: '5%',
  },
];

export const loadAssociateTableDataSource = datas =>
  datas.map(data => ({
    deviceName: data.name,
    deviceCode: data.code,
    deviceAddress: data.address,
    installTime: data.setupTime,
    deviceType: data.typeDesp,
    deviceDetail: data.typeDesp,
    deviceStatus: data.statusDesp,
    meta: {
      deviceRelationId: data.deviceRelationId,
      deviceId: data.deviceId,
      id: data.id, // 设备关联表的 id, 通过这个 id 删除设备
    },
  }));

export const loadQueryData = query => {
  return [
    {
      key: 'query.type',
      title: '设备类型',
      placeholder: '请选择设备类型',
      value: query.type,
      options: query.typeOptions.map(item => ({
        value: item.code,
        name: item.desp,
      })),
    },
    {
      key: 'query.area',
      title: '所属区域',
      placeholder: '请选择所属区域',
      value: query.area,
      options: query.areaOptions.map(item => ({
        value: item.id,
        name: item.name,
      })),
    },
    {
      key: 'query.building',
      title: '所属楼栋',
      placeholder: '请选择所属楼栋',
      value: query.building,
      options: query.buildingOptions.map(item => ({
        name: item.name,
        value: item.id,
      })),
    },
    {
      key: 'query.floor',
      title: '所属楼层',
      placeholder: '请选择所属楼层',
      value: query.floor,
      options: query.floorOptions.map(item => ({
        name: item.name,
        value: item.id,
      })),
    },
  ];
};

export const loadFilterData = filter => {
  const findOptions = (id, array) => {
    if (id && array) {
      for (let i = 0; i < array.length; i += 1) {
        const value = array[i];
        if (value.id === id) {
          return value.children;
        }
      }
    }

    return [];
  };

  const {
    type,
    area,
    selectedDevice,
    building,
    floor,
    supportTypes,
    supportAreas,
    supportDevice,
  } = filter;
  const areaOption = supportAreas;
  const buildingOptions = findOptions(area, supportAreas);
  const floorOption = findOptions(building, buildingOptions);

  return [
    {
      key: 'filter.type',
      title: '设备类型',
      placeholder: '请选择设备类型',
      value: type,
      options: supportTypes.map(item => ({
        value: item.code,
        name: item.desp,
      })),
    },
    {
      key: 'filter.area',
      title: '所属区域',
      placeholder: '请选择所属区域',
      value: area,
      options: areaOption.map(item => ({
        value: item.id,
        name: item.name,
      })),
    },
    {
      key: 'filter.building',
      title: '所属楼栋',
      placeholder: '请选择所属楼栋',
      value: building,
      options: buildingOptions.map(item => ({
        name: item.name,
        value: item.id,
      })),
    },
    {
      key: 'filter.floor',
      title: '所属楼层',
      placeholder: '请选择所属楼层',
      value: floor,
      options: floorOption.map(item => ({
        name: item.name,
        value: item.id,
      })),
    },
    {
      key: 'filter.selectedDevice',
      title: '设备编码',
      placeholder: '请选择设备编码',
      value: selectedDevice,
      options: supportDevice.map(item => ({
        name: item.name,
        value: item.id,
      })),
    },
  ];
};

export const loadInfo = info => [
  {
    key: 'name',
    title: '设备名称',
    value: info.name || '',
  },
  {
    key: 'install',
    title: '安装时间',
    value: info.setupTime || '',
  },
  {
    key: 'statue',
    title: '设备状态',
    value: info.statusDesp || '',
  },
];

export const loadDeviceInfo = data => [
  {
    key: 'name',
    title: '设备名称',
    value: data.name,
  },
  {
    key: 'code',
    title: '设备编码',
    value: data.code,
  },
  {
    key: 'area',
    title: '设备区域',
    value: data.areaName,
  },
  {
    key: 'position',
    title: '设备位置',
    value: data.address,
  },
  {
    key: 'type',
    title: '设备类型',
    value: data.typeDesp || '',
  },
];
