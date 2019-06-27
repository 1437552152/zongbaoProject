import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import styles from './index.less';
import IconFont from '@/components/IconFont';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon, isSelected) => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if (icon.startsWith('/') || icon.startsWith('./')) {
      const ticon = isSelected ? `${icon}-s.png` : `${icon}-n.png`;
      return <Icon component={() => <img src={ticon} alt="icon" className={styles.icon2} />} />;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  if (!icon) {
    return (
      <Icon
        component={() => (
          <div
            style={{
              width: 4,
              height: 18,
              margin: 'auto 10px',
              backgroundColor: isSelected ? '#3C5BCE' : '#92ace4',
            }}
          />
        )}
      />
    );
  }
  return icon;
};

export default class BaseMenu extends PureComponent {
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, selectedKey) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item, selectedKey))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item, selectedKey) => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name, path } = item;
      return (
        <SubMenu
          title={
            <span>
              {getIcon(item.icon, path === selectedKey)}
              <span>{name}</span>
            </span>
            // item.icon ? (
            //   <span>
            //     {getIcon(item.icon, path === selectedKey)}
            //     <span>{name}</span>
            //   </span>
            // ) : (
            //   name
            // )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children, selectedKey)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item, selectedKey)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = (item, selectedKey) => {
    const { name, path } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon, selectedKey === path);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  getPopupContainer = (fixedHeader, layout) => {
    if (fixedHeader && layout === 'topmenu') {
      return this.wrap;
    }
    return document.body;
  };

  getRef = ref => {
    this.wrap = ref;
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
      collapsed,
      fixedHeader,
      layout,
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    const selectedKey =
      selectedKeys && selectedKeys.length > 0 ? selectedKeys[selectedKeys.length - 1] : '';
    let props = {};
    if (openKeys && !collapsed) {
      props = {
        openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    const cls = classNames(styles.menu, className, {
      'top-nav-menu': mode === 'horizontal',
    });

    return (
      <>
        <Menu
          key="Menu"
          mode={mode}
          theme={theme}
          onOpenChange={handleOpenChange}
          selectedKeys={selectedKeys}
          style={style}
          className={cls}
          {...props}
          getPopupContainer={() => this.getPopupContainer(fixedHeader, layout)}
        >
          {this.getNavMenuItems(menuData, selectedKey)}
        </Menu>
        <div ref={this.getRef} />
      </>
    );
  }
}
