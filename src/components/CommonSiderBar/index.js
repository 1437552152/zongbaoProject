/*
 * @Desc: 通用菜单组件
 * @Author: Jackie
 * @Date: 2019-05-21 19:51:11
 * @Last Modified by: yeyifu
 * @Last Modified time: 2019-05-24 10:24:28
 */
import React from 'react';
import PropTypes from 'prop-types';

import SingleTabSiderBar from './SingleTabSiderBar';
import MutiTabSiderBar from './MutiTabSiderBar';

const CommonSiderBar = props => {
  const { isMuti, ...rest } = props;
  return isMuti ? <MutiTabSiderBar {...rest} /> : <SingleTabSiderBar {...rest} />;
};

CommonSiderBar.propTypes = {
  isMuti: PropTypes.bool, // 是否是多tab
};

CommonSiderBar.defaultProps = {
  isMuti: false,
};

export default CommonSiderBar;
