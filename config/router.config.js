import operation from './operation'
import realtime from './realtime'
import analysis from './analysis'
import manage from './manage'

export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      {
        path: '/user/register',
        name: 'register',
        component: './User/Register'
      },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult'
      },
      {
        component: '404'
      }
    ]
  },
  // 实时
  {
    path: '/realtime',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      ...realtime,
      {
        component: '404'
      }
    ]
  },
  // 运维
  {
    path: '/operation',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      ...operation,
      {
        component: '404'
      }
    ]
  },
  // 分析
  {
    path: '/analysis',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      ...analysis,
      {
        component: '404'
      }
    ]
  },
  // 管理
  {
    path: '/manage',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      ...manage,
      {
        component: '404'
      }
    ]
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/user' },
      {
        path: '/home',
        name: 'home',
        component: './Home'
      },
      {
        path: '/chip',
        name: '公共组件样式',
        component: './ChipStyles',
        hideInMenu: true
      },
      {
        component: '404'
      }
    ]
  }
]
