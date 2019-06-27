import moment from 'moment';

const FMT = 'YYYY-MM-DD';

// 获取当前周or前后某周的起始日期
export function getWeekStartEnd(week) {

  const tableymd = [];
  tableymd.push(
    moment()
      .week(moment().week() + week)
      .startOf('week')
      .format(FMT)
  );
  tableymd.push(
    moment()
      .week(moment().week() + week)
      .endOf('week')
      .format(FMT)
  );
  return tableymd;
}

// 获取某天后的七天内信息（日期以及星期）
export function getWeekDays(startTime) {
  const weeks = [];
  for (let i = 0; i < 7; i += 1) {
    const day = moment(startTime, FMT).add(i, 'days');
    weeks.push({ date: day.format('MMMDD日'), week: day.format('dddd') });
  }
  return weeks;
}
