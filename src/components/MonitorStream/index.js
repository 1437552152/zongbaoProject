/*
 * @Desc: 监控视频组件
 * @Author: Jackie
 * @Date: 2019-05-08 12:00:20
 * @Last Modified by: Jackie
 * @Last Modified time: 2019-05-30 15:03:12
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import clazzNames from 'classnames';
import styles from './index.less'

class ms extends PureComponent {
  static propTypes = {
    rtsp: PropTypes.string, // rtsp路径, 必填
    controls: PropTypes.bool, // 是否显示控制选项
    zoom: PropTypes.bool, // 是否显示缩放选项(controls=false时不生效)
    mute: PropTypes.bool, // 是否静音
    width: PropTypes.any, // 显示宽度
    height: PropTypes.any, // 显示高度
    isPercent: PropTypes.bool, // 是否是百分比宽高
  };

  static defaultProps = {
    rtsp: '',
    controls: false,
    isPercent: false,
    zoom: false,
    mute: true,
    width: 640,
    height: 480,
  };

  constructor(props) {
    super(props);
    if (!window.tempAutoId) {
      window.tempAutoId = 0;
    }
    this.state = {
      id: `player${(window.tempAutoId += 1)}`,
    };
  }

  componentDidMount() {
    this.createPlayer();
  }

  componentWillUnmount() {
    const { id } = this.state;
    const player = window.vxgplayer(id);
    if (player && player.stop && player.isPlaying()) {
      player.stop();
    }
  }

  createPlayer = () => {
    const { rtsp, controls, zoom, mute, width, height, isPercent } = this.props;
    const { id } = this.state;
    const player = window.vxgplayer(id, {
      url: rtsp,
      width,
      height,
      nmf_path: 'media_player.nmf',
      nmf_src: './vxgplayer/pnacl/Release/media_player.nmf',
      latency: 1000,
      aspect_ratio_mode: 1,
      autohide: 3,
      controls,
      mute,
      connection_timeout: 5000,
      connection_udp: 0,
      autoreconnect: true,
      custom_digital_zoom: !zoom,
    });
    if (player) {
      player.ready(() => {
        // console.log(`======ready======`);
        if (isPercent) player.size(width, height);

        player.src(rtsp);
        player.play();
      });
    }
  };

  render() {
    const { id } = this.state;
    const { width, height, className } = this.props;
    return (
      <div id={id} className={clazzNames(className, 'vxgplayer', styles.vxgplayer)} twidth={width} theight={height} />
    );
  }
}

export default ms;
