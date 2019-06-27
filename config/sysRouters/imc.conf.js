import commonRouter from './common.conf'

// 综合管控系统
export default [
  ...commonRouter,
  {
    path: '/imc',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: 'home',
    routes: [
      { path: '.', redirect: 'home', authority: 'home' },
      // 首页=================================================
      {
        path: 'home',
        name: '主页地图',
        icon: './assets/menu/home',
        component: './SysImc/Home',
        authority: 'home'
      },
      // 实时=================================================
      {
        path: 'realtime',
        name: '实时地图',
        icon: './assets/menu/time',
        authority: 'realtime',
        component: './SysImc/RealTime/MapShow'
      },
      // 管理=================================================
      {
        path: 'manage',
        name: '管理',
        icon: './assets/menu/guanli',
        authority: 'manage',
        routes: [
          { path: '.', redirect: 'energyManagement' },
          {
            path: 'energyManagement',
            name: '能耗管理',
            authority: 'energyManagement',
            routes: [
              { path: '.', redirect: 'meterMonitor' },
              {
                path: 'meterMonitor',
                name: '电表监控',
                component: './SysImc/Manage/energyManagement/meterMonitor',
                authority: 'meterMonitor'
              },
              {
                path: 'wattCheck',
                name: '电表抄表',
                hideInMenu: true,
                authority: 'wattCheck',
                component:
                  './SysImc/Manage/energyManagement/meterMonitor/wattCheck'
              },
              {
                path: 'meterHistory',
                name: '历史数据',
                authority: 'meterHistory',
                hideInMenu: true,
                component:
                  './SysImc/Manage/energyManagement/meterMonitor/meterHistory'
              },
              {
                path: 'waterMonitor',
                name: '水表监控',
                authority: 'waterMonitor',
                component: './SysImc/Manage/energyManagement/waterMonitor'
              },
              {
                path: 'waterCheck',
                name: '水表抄表',
                authority: 'waterCheck',
                hideInMenu: true,
                component:
                  './SysImc/Manage/energyManagement/waterMonitor/waterCheck'
              },
              {
                path: 'waterHistory',
                name: '历史数据',
                authority: 'waterHistory',
                hideInMenu: true,
                component:
                  './SysImc/Manage/energyManagement/waterMonitor/waterHistory'
              }
            ]
          },
          // {
          //   path: 'checkManage',
          //   name: '抄表管理',
          //   authority: 'checkManage',
          //   routes: [
          //     { path: '.', redirect: 'wattCheck' },
          //     {
          //       path: 'wattCheck',
          //       name: '电表抄表',
          //       authority: 'wattCheck',
          //       component: './SysImc/Manage/checkManage/wattCheck',
          //     },
          //     {
          //       path: 'waterCheck',
          //       name: '水表抄表',
          //       authority: 'waterCheck',
          //       component: './SysImc/Manage/checkManage/waterCheck',
          //     },
          //   ],
          // },
          {
            path: 'operate',
            name: '运营管理',
            authority: 'operate',
            routes: [
              { path: '.', redirect: 'cardpark' },
              {
                path: 'cardpark',
                name: '停车场',
                authority: 'cardpark',
                component: './SysImc/Manage/Operate/CardPark'
              },
              {
                path: 'informationScreen',
                name: '信息发布屏',
                authority: 'informationScreen',
                component: './SysImc/Manage/Operate/informationScreen'
              },
              // {
              //   path: 'settingScreen',
              //   name: '信息发布屏',
              //   component: './SysImc/Manage/Operate/informationScreen/settingScreen'
              // },
              {
                path: 'airVentilation',
                name: '空调通风',
                authority: 'airVentilation',
                component: './SysImc/Manage/Operate/airVentilation'
              },
              {
                path: 'waterDrainage',
                name: '给排水',
                authority: 'waterDrainage',
                component: './SysImc/Manage/Operate/waterDrainage'
              },
              {
                path: 'freshAir',
                name: '新风',
                authority: 'freshAir',
                component: './SysImc/Manage/Operate/freshAir'
              }
            ]
          },
          {
            path: 'person',
            name: '人员维护',
            authority: 'person',
            component: './SysImc/Manage/personControl'
          },
          {
            path: 'devices',
            name: '设备维护',
            authority: 'devices',
            component: './SysImc/Manage/Devices'
          },
          {
            path: 'promises',
            name: '楼宇配置',
            authority: 'promises',
            component: './SysImc/Manage/Promises'
          },
          {
            path: 'devices/deviceadd',
            name: '添加设备',
            hideInMenu: true,
            authority: 'deviceadd',
            component: './SysImc/Manage/Devices/DeviceEdit'
          },
          {
            path: 'devices/deviceedit',
            name: '修改设备',
            hideInMenu: true,
            authority: 'deviceedit',
            component: './SysImc/Manage/Devices/DeviceEdit'
          },
          {
            path: 'mainstatus',
            name: '运行状态维护',
            authority: 'mainstatus',
            component: './SysImc/Manage/MaintenanceStatus/MaintenanceStatus'
          },
          {
            path: 'maintype',
            name: '设备类型维护',
            authority: 'maintype',
            component:
              './SysImc/Manage/MaintenanceEquipment/MaintenanceEquipment'
          },
          {
            path: 'devices/associate/:id',
            name: 'device',
            hideInMenu: true,
            authority: 'associate',
            component: './SysImc/Manage/Devices/Associate'
          },
          {
            path: 'company',
            name: '公司部门维护',
            authority: 'company',
            component: './SysImc/Manage/companyManage'
          }
        ]
      },
      // 分析=================================================
      // {
      //   path: 'analysis',
      //   name: '分析',
      //   icon: './assets/menu/fenxi',
      //   authority: 'analysis',
      //   component: './SysImc/Analysis'
      // },
      {
        component: '404'
      }
    ]
  },
  {
    component: '404'
  }
]
