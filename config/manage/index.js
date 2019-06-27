const businessRouter = [
  // =================管理==================
  {
    path: '.',
    redirect: 'MaintenanceStatus',
  },
  {
    path: 'MaintenanceStatus',
    name: '设备类型维护',
    component: './Manage/MaintenanceStatus/MaintenanceStatus',
  },
  {
    path: 'MaintenanceEquipment',
    name: '运行状态维护',
    component: './Manage/MaintenanceEquipment/MaintenanceEquipment',
  },
  {
    path: 'alarmsstate',
    name: '报警类型维护',
    component: './Manage/AlarmState',
  },
  {
    path: 'devices',
    name: '设备维护',
    component: './Manage/Devices/',
  },
  {
    path: 'personC',
    name: '人员维护',
    component: './Manage/PersonControl/index',
  },
  {
    path: 'schema',
    name: '联动方案',
    component: './Manage/Scheme',
  },
  {
    path: 'mainSetting',
    name: '运维配置',
    routes: [
      {
        path: 'faultType',
        name: '故障类型维护',
        component: './Manage/MainConfig/FaultType',
      },
      {
        path: 'mainstatus',
        name: '维修状态维护',
        component: './Manage/MainConfig/MainStatus',
      },
      {
        path: 'mainlevel',
        name: '维修级别维护',
        component: './Manage/MainConfig/MainLevel',
      },
      {
        path: 'mainresult',
        name: '维修结果维护',
        component: './Manage/MainConfig/MainResult',
      },
      {
        path: 'planlevel',
        name: '计划级别维护',
        component: './Manage/MainConfig/PlanLevel',
      },
    ],
  },
];

export default businessRouter;
