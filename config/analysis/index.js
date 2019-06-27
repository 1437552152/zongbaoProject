const businessRouter = [
  // ==================分析==================
  {
    path: '.',
    redirect: 'home',
  },
  {
    path: 'home',
    name: 'home',
    component: './Analysis/Home',
  },
  {
    path: 'electric',
    name: 'electric',
    component: './Analysis/Electric',
  },
  {
    path: 'ambient',
    name: 'ambient',
    component: './Analysis/Ambient',
  },
];

export default businessRouter;
