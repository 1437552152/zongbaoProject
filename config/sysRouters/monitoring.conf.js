import commonRouter from './common.conf'

// 安全监控系统
export default [
  ...commonRouter,
  {
    path: '/monitoring',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: 'home',
    routes: [
      { path: '.', redirect: 'home' },
      // 首页=================================================
      {
        path: 'home',
        name: '主页',
        icon: './assets/menu/home',
        authority: 'home',
        component: './SysMonitoring/Home'
      },
      // 实时=================================================
      {
        path: 'realtime',
        name: '实时',
        icon: './assets/menu/time',
        authority: 'realtime',
        // component: './SysMonitoring/RealTime',
        routes: [
          { path: '.', redirect: 'map' },
          {
            path: 'map',
            name: '实时地图',
            authority: 'map',
            component: './SysMonitoring/RealTime/MapShow'
          },
          {
            path: 'zone/:type/home',
            name: '区域首页',
            authority: 'zone',
            component: './SysMonitoring/RealTime/Zone/index',
            hideInMenu: true
          },

          {
            path: 'zone/:type/alarmList',
            authority: 'alarmList',
            name: '历史记录',
            hideInMenu: true,
            component:
              './SysMonitoring/RealTime/SafeMonitorHistory/FireControl/FireControlDeviceListPage'
          },
          {
            path: 'fire/zone',
            name: '消防集成',
            dynamic: true,
            authority: 'fire',
            routes: [
              { path: '.', redirect: 'home/index' },
              {
                path: 'home/index',
                name: '消防集成',
                authority: 'home/index',
                component: './SysMonitoring/RealTime/Zone/FireZone',
                hideInMenu: true
              },
              {
                path: ':id',
                hideInMenu: true,
                authority: 'home/index/area',
                component: './SysMonitoring/RealTime/Area'
              },
              {
                path: ':id/control',
                hideInMenu: true,
                name: '消防报警历史记录',
                authority: 'home/index/control',
                component:
                  './SysMonitoring/RealTime/SafeMonitorHistory/FireControl/FireControlByRegionListPage'
              }
            ]
          },
          {
            path: 'entrance/zone',
            name: '门禁系统',
            dynamic: true,
            authority: 'entrance',
            routes: [
              { path: '.', redirect: 'home/index' },
              {
                path: 'home/index',
                name: '门禁监管',
                authority: 'entrance/index',
                component: './SysMonitoring/RealTime/Zone/EntranceZone',
                hideInMenu: true
              },
              {
                path: ':id',
                hideInMenu: true,
                authority: 'entrance/area',
                component: './SysMonitoring/RealTime/Area'
              },
              {
                path: ':id/control',
                hideInMenu: true,
                authority: 'entrance/control',
                name: '门禁监控历史纪录',
                component:
                  './SysMonitoring/RealTime/SafeMonitorHistory/AccessControl/AccessControlByRegionListPage'
              }
            ]
          },
          {
            path: 'video/zone',
            name: '视频监控',
            dynamic: true,
            authority: 'video',
            routes: [
              { path: '.', redirect: 'home/index' },
              {
                path: 'home/index',
                name: '视频监控',
                authority: 'video/index',
                component: './SysMonitoring/RealTime/Zone/VideoZone',
                hideInMenu: true
              },
              {
                path: ':id',
                hideInMenu: true,
                authority: 'video/area',
                component: './SysMonitoring/RealTime/Area'
              },
              {
                path: ':id/control',
                hideInMenu: true,
                name: '视频监控历史纪录',
                authority: 'video/control',
                component:
                  './SysMonitoring/RealTime/SafeMonitorHistory/VideoMonitor/VideoMonitorByRegionListPage'
              }
            ]
          },
          {
            path: 'equipment/:id',
            name: '设备管理',
            authority: 'equipment',
            hideInMenu: true,
            component: './SysMonitoring/RealTime/Equipment/index'
          },
          {
            path: 'safeMonitor/firecontrolhistory/:id',
            name: '历史纪录',
            hideInMenu: true,
            authority: 'firecontrolhistory',
            component:
              './SysMonitoring/RealTime/SafeMonitorHistory/FireControl/FireControlListPage'
          },
          {
            path: 'recommendation-linkage/recommendation-linkage/',
            name: '推荐联动管理',
            authority: 'recommendation',
            hideInMenu: true,
            component:
              './SysMonitoring/RealTime/recommendationLinkage/recommendationLinkage'
          },
          {
            path: 'selfhelp-linkage/selfhelp-linkage/',
            name: '自助联动管理',
            authority: 'selfhelp',
            hideInMenu: true,
            component:
              './SysMonitoring/RealTime/SelfhelpLinkage/SelfhelpLinkage'
          }
        ]
      },
      // 管理=================================================
      {
        path: 'manage',
        name: '管理',
        icon: './assets/menu/guanli',
        authority: 'manage',
        routes: [
          { path: '.', redirect: 'alarmstate' },
          {
            path: 'alarmstate',
            name: '报警类型维护',
            authority: 'alarmstate',
            component: './SysMonitoring/Manage/alarmState'
          },
          {
            path: 'SelfhelpLinkage',
            name: '联动方案管理',
            authority: 'SelfhelpLinkage',
            component: './SysMonitoring/Manage/SelfhelpLinkage'
          }
        ]
      },
      // 分析=================================================
      // {
      //   path: 'analysis',
      //   name: '分析',
      //   icon: './assets/menu/fenxi',
      //   component: './SysMonitoring/Analysis',
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
