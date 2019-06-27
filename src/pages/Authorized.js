import React from 'react'
import { Spin, message } from 'antd'
import Redirect from 'umi/redirect'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import Authorized, { reloadAuthorized } from '@/utils/Authorized'
import {setAuthority } from '@/utils/authority'
import Exception403 from '@/pages/Exception/403'
import router from 'umi/router'

function AuthComponent ({
  children,
  location,
  routerData,
  newMenuList,
  initialStatus,
  dispatch
}) {
  const { sysName } = process.env
  const auth =
  newMenuList&&Object.keys(newMenuList).length > 0 && newMenuList[sysName]
      ? newMenuList[sysName]
      : []
  if (initialStatus === 0) {
    dispatch({
      type: 'login/getRoutes',
      callback: data => {
        if (data !== undefined) {
          if (data.data && Object.keys(data.data).length > 0) {
            const list = data.data
            setAuthority(list[sysName])
            reloadAuthorized()
          } else {
            message.error('获取用户权限失败，请重新登录！')
            const { enableCas } = process.env
            if (enableCas === 'true') {
              if (sysName === 'imc') {
                window.open(
                  'https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/writeInfo/control',
                  '_self'
                )
              }
              if (sysName === 'monitoring') {
                window.open(
                  'https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/writeInfo/monitor',
                  '_self'
                )
              }
              if (sysName === 'iop') {
                window.open(
                  'https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/writeInfo/operation',
                  '_self'
                )
              }
            } else {
              dispatch({
                type: "login/getRoutes"
              });
              router.push('/user/login')
              window.location.reload(true);
            }
          }
        } else {
          message.error('获取用户权限失败，请重新登录！')
          const { enableCas } = process.env
          if (enableCas === 'true') {
            if (sysName === 'imc') {
              window.open(
                'https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/writeInfo/control',
                '_self'
              )
            }
            if (sysName === 'monitoring') {
              window.open(
                'https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/writeInfo/monitor',
                '_self'
              )
            }
            if (sysName === 'iop') {
              window.open(
                'https://www.bondedarea.com:8443/cas/login?service=http://10.110.200.145:8080/services/gateway/writeInfo/operation',
                '_self'
              )
            }
          } else {
            dispatch({
              type: "login/getRoutes"
            });
            router.push('/user/login')
            window.location.reload(true);
          }
        }
      }
    })
    return (
      <Spin>
        <div style={{ width: '100%', height: '100%', minHeight: '100vh' }} />
      </Spin>
    )
  }

  const isLogin = auth && auth[0] !== 'guest'
  const getRouteAuthority = (path, routeData) => {
    let authorities
    routeData.forEach(route => {
      // match prefix
      if (pathToRegexp(`${route.path}(.*)`).test(path)) {
        authorities = route.authority || authorities

        // get children authority recursively
        if (route.routes) {
          authorities = getRouteAuthority(path, route.routes) || authorities
        }
      }
    })
    return authorities
  }
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routerData)}
      noMatch={isLogin ? <Exception403 /> : <Redirect to='/user/login' />}
    >
      {children}
    </Authorized>
  )
}
export default connect(({ menu: menuModel, login: newList }) => ({
  routerData: menuModel.routerData,
  newMenuList: newList.newMenuList,
  initialStatus:newList.initialStatus
}))(AuthComponent)
