// common
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
        component: './User/Register',
      },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/chip',
    component: './ChipStyles',
    hideInMenu: true,
  },
  {
    path: '/',
    redirect: '/user',
  },
  {
    path: '/chip',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '.', redirect: 'index' },
      { path: 'index', name: '样例', component: './ChipStyles' },
      {
        component: '404',
      },
    ],
  },
];
