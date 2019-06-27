const businessRouter = [
  // ==================运维==================
  {
    path: '.',
    redirect: 'plan/planlist',
  },
  // {
  //   path: 'home',
  //   name: 'home',
  //   component: './Operation/Home',
  // },
  {
    path: 'malfunction',
    name: '故障处理',
  },
  // {
  //   path: 'addplan',
  //   name: 'addplan',
  //   component: './Operation/Addplan',
  // },
  {
    path: 'recordview',
    name: '纪录查看',
    component: './Operation/Recordview',
  },
  {
    path: 'plan',
    name: 'plan',
    routes: [
      {
        path: 'addplan',
        name: '新增计划',
        component: './Operation/Addplan',
      },
      {
        path: 'planlist',
        name: 'planlist',
        component: './Operation/PlanList',
      },
      {
        path: 'WorkforceManagement',
        name: '计划排班',
        component: './Operation/WorkforceManagement',
      },
      {
        path: 'monitorProgress',
        name: '进度监控',
        component: './Operation/monitorProgress/monitorProgress',
      },
    ],
  },
  {
    path: '/Operation/ProcessSetting',
    name: '流程设置',
    routes: [
      {
        path: 'processSet',
        name: '管理-流程管理-流程设置',
        component: './Operation/ProcessSetting/ProcessSet/ProcessSet',
      },
      {
        path: 'newProcess',
        name: '管理-流程管理-新建流程',
        component: './Operation/ProcessSetting/newProcess/newProcess',
      },
      {
        path: 'processApprovalS',
        name: '管理-流程管理-流程审批上',
        component: './Operation/ProcessSetting/processApprovalS/processApprovalS',
      },
      {
        path: 'processApprovalZ',
        name: '管理-流程管理-流程步骤审核',
        component: './Operation/ProcessSetting/processApprovalZ/processApprovalZ',
      },
      {
        path: 'processApprovalX',
        name: '管理-流程管理-流程审批下',
        component: './Operation/ProcessSetting/processApprovalX/processApprovalX',
      },
    ],
  },
];

export default businessRouter;
