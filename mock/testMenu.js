const testMenu = {
  imc: [
    'home',
    'manage',
    'energyManagement',
    'meterMonitor',
    'meterHistory',
    'waterMonitor',
    'waterHistory',
    'checkManage',
    'wattCheck',
    'waterCheck',
    'operate',
    'informationScreen',
    'airVentilation',
    'waterDrainage',
    'freshAir',
    'person',
    'devices',
    'promises',
    'deviceadd',
    'deviceedit',
    'mainstatus',
    'maintype',
    'fixdevice',
    'showdevice',
    'associate',
    'company',
    'realtime',
    'analysis'
  ],

  iop: [
    'overview',
    'dispatch',
    'operation',
    'process',
    'operationTicket',
    'workTicket',
    'record',
    'check',
    'realtime',
    'workOrder',
    'manage',
    'faulttype',
    'mainlevel',
    'mainresult',
    'mainstatus',
    'planlevel',
    'planlevel',
    'newProcess',
    'processApprovalS',
    'processApprovalZ',
    'processApprovalX'
  ],

  monitoring: [
    'home',
    'realtime',
    'zone',
    'alarmList',
    'fire',
    'home/index',
    'home/index/area',
    'home/index/control',
    'entrance',
    'entrance/index',
    'entrance/area',
    'entrance/control',
    'video',
    'video/index',
    'video/area',
    'video/control',
    'equipment',
    'firecontrolhistory',
    'recommendation',
    'selfhelp',
    'manage',
    'alarmstate',
    'SelfhelpLinkage'
  ]
}

export default {
  'GET /api/getTestMenu': testMenu
}