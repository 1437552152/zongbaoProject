// 报警类型
const WarningType = {
  realTime: '01', // 实时报警
  load: '02', // 负载率报警
  cable: '03', // 线损报警
  maximumDemand: '04', // 最大需量报警
  energy: '05', // 能耗报警
};

// 报警级别
const WarningLevel = {
  malfunction: '01', // 故障
  broken: '02', // 损坏
};

// 报警状态
const WarningStatus = {
  unprocessed: '01', // 未处理
  processing: '02', // 处理中
  processed: '03', // 已处理
};

// 工单状态
const OrderState = {
  complete: 0,
};

export { WarningType, WarningLevel, WarningStatus, OrderState };
