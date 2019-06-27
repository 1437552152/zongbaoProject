import React from 'react';
// import Link from 'umi/link';
import { Breadcrumb } from 'antd';
import { conversionBreadcrumbList } from '@/components/PageHeaderWrapper/breadcrumb';
import MenuContext from '@/layouts/MenuContext';
import styles from './index.less';

const RouterTitle = ({ src }) => {
  return (
    <MenuContext.Consumer>
      {value => {
        const breadcrumbList = conversionBreadcrumbList({ ...value });
        const extraBreadcrumbItems = breadcrumbList.routes.map(item => (
          <Breadcrumb.Item key={item.path} href={`#${item.path}`}>
            <span>{item.breadcrumbName}</span>
          </Breadcrumb.Item>
        ));
        const breadcrumbItems = extraBreadcrumbItems;
        // const breadcrumbItems = [
        //   <Breadcrumb.Item key='home'>
        //     <Link to='/home'>Home</Link>
        //   </Breadcrumb.Item>,
        // ].concat(extraBreadcrumbItems)
        return (
          <div className={styles.title}>
            {src && <img src={src} alt="" />}
            <Breadcrumb>{breadcrumbItems}</Breadcrumb>
          </div>
        );
      }}
    </MenuContext.Consumer>
  );
};

export default RouterTitle;
