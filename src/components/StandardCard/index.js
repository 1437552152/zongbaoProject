/*
 * @Desc: 公共Card组件
 * @Author: Jackie
 * @Date: 2019-05-30 14:47:32
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-06-04 10:27:00
 */
import React from 'react';
import CommonCard from './CommonCard';
import RouterCard from './RouterCard';
import Meta from './Meta';
import RouterTitle from './RouterTitle';
import CommonTitle from './CommonTitle';

const StandardCard = ({ showTitle, ...rest }) => {
  return showTitle ? <CommonCard {...rest} /> : <RouterCard {...rest} />;
};
StandardCard.RouterTitle = RouterTitle;
StandardCard.CommonTitle = CommonTitle;
StandardCard.Meta = Meta;
export default StandardCard;
/**
 * full属性： 卡片最小宽度是否占满屏幕，默认：false
 * eg:
 * 顶部显示自定义内容
 * <StandardCard src='./assets/common/peizhi.png' title='你好/你好' showTitle>
 *    内容
 * </StandardCard>
 *
 * 顶部显示路由内容
 * <StandardCard src='./assets/common/peizhi.png'>
 *    内容
 * </StandardCard>
 */
