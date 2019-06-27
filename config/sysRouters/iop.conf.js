import commonRouter from './common.conf'

// 综合运维系统
export default [
  ...commonRouter,
  {
    path: '/iop',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: 'overview',
    routes: [
      { path: '.', redirect: 'overview', authority: 'overview' },
      {
        path: 'overview',
        name: '主页',
        icon: './assets/menu/home',
        authority: 'overview',
        component: './SysIop/Overview'
      },
      {
        path: 'overview/dispatch/:id',
        name: '新增派工',
        hideInMenu: true,
        authority: 'dispatch',
        component: './SysIop/Overview/DispatchWorkOrder'
      },
      // 工单管理=================================================
      {
        path: 'operation',
        icon: './assets/menu/home',
        name: '主页',
        authority: 'operation',
        component: './SysIop/Operation'
      },
      {
        path: 'operation/:orderId/process',
        name: '派工过程',
        hideInMenu: true,
        authority: 'process',
        component: './SysIop/Operation/WorkOrderProgress'
      },
      {
        path: 'operation/:orderId/process/operationTicket',
        name: '操作票',
        hideInMenu: true,
        authority: 'operationTicket',
        component: './SysIop/Operation/WorkOrderProgress/OperationTicket'
      },
      {
        path: 'operation/:orderId/process/workTicket',
        name: '工作票',
        hideInMenu: true,
        authority: 'workTicket',
        component: './SysIop/Operation/WorkOrderProgress/WorkTicket'
      },
      {
        path: 'operation/:orderId/process/record',
        name: '派工录入',
        hideInMenu: true,
        authority: 'record',
        component: './SysIop/Operation/WorkOrderProgress/Record'
      },
      {
        path: 'operation/:orderId/process/check',
        name: '派工查验',
        hideInMenu: true,
        authority: 'check',
        component: './SysIop/Operation/WorkOrderProgress/Check'
      },
      // 实时=================================================
      {
        path: 'realtime',
        name: '实时地图',
        icon: './assets/menu/time',
        authority: 'realtime',
        component: './SysIop/RealTime/Mapshow'
      },
      // {
      //   path: 'recordview',
      //   name: '纪录查看',
      //   component: './SysIop/Operation/Recordview',
      // },
      // 运维=================================================
      {
        path: 'workOrder',
        icon: './assets/menu/yunwei',
        name: '运维',
        authority: 'workOrder',
        component: './SysIop/WorkOrder'
      },
      // 管理=================================================
      {
        path: 'manage',
        name: '管理',
        icon: './assets/menu/guanli',
        authority: 'manage',
        routes: [
          { path: '.', redirect: 'faulttype' },
          {
            path: 'faulttype',
            name: '故障类型维护',
            authority: 'faulttype',
            component: './SysIop/Manage/MainConfig/FaultType'
          },
          {
            path: 'mainlevel',
            name: '维修级别维护',
            authority: 'mainlevel',
            component: './SysIop/Manage/MainConfig/MainLevel'
          },
          {
            path: 'mainresult',
            name: '维修结果维护',
            authority: 'mainresult',
            component: './SysIop/Manage/MainConfig/MainResult'
          },
          {
            path: 'mainstatus',
            name: '维修状态维护',
            authority: 'mainstatus',
            component: './SysIop/Manage/MainConfig/MainStatus'
          },
          {
            path: 'planlevel',
            name: '计划级别维护',
            authority: 'planlevel',
            component: './SysIop/Manage/MainConfig/PlanLevel'
          },
          {
            path: 'newProcess',
            name: '流程管理',
            authority: 'newProcess',
            component: './SysIop/Manage/ProcessSetting/newProcess'
          },
          {
            path: 'processApprovalS',
            name: '流程审批',
            authority: 'processApprovalS',
            component: './SysIop/Manage/ProcessSetting/processApprovalS'
          },
          {
            path: 'processApprovalZ/:id',
            name: '流程步骤审核',
            hideInMenu: true,
            authority: 'processApprovalZ',
            component: './SysIop/manage/ProcessSetting/processApprovalZ'
          },
          {
            path: 'processApprovalX/:id',
            name: '流程审批下',
            hideInMenu: true,
            authority: 'processApprovalX',
            component: './SysIop/manage/ProcessSetting/processApprovalX'
          }
          // {
          //   path: 'plan',
          //   name: '计划及排班',
          //   routes: [
          //     {
          //       path: 'addplan',
          //       name: '新增计划',
          //       component: './SysIop/manage/Addplan',
          //     },
          //     {
          //       path: 'planlist',
          //       name: '维护计划',
          //       component: './SysIop/manage/PlanList',
          //     },
          //     {
          //       path: 'WorkforceManagement',
          //       name: '计划排班',
          //       component: './SysIop/manage/WorkforceManagement',
          //     },
          //     {
          //       path: 'monitorProgress',
          //       name: '进度监控',
          //       component: './SysIop/manage/monitorProgress',
          //     },
          //   ],
          // },
        ]
      },
      // 分析=================================================
      // {
      //   path: 'analysis',
      //   name: '分析',
      //   icon: './assets/menu/fenxi',
      //   routes: [
      //     {
      //       path: 'electric',
      //       name: '电力分析',
      //       component: './SysIop/Analysis/Electric',
      //     },
      //     {
      //       path: 'ambient',
      //       name: '环境能耗',
      //       component: './SysIop/Analysis/Ambient',
      //     },
      //     {
      //       path: 'jfjh',
      //       name: '降锋减耗',
      //       component: './SysIop/Analysis/Jfjh',
      //     },
      //   ],
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
