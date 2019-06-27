const topSysList = [
  {
    label: '安全监控系统',
    value: '/monitoring',
  },
  {
    label: '综合运维系统',
    value: '/iop',
  },
  {
    label: '综合管控系统',
    value: '/imc',
  },
];

export default {
  namespace: 'topsys',
  state: {
    logoSrc: '',
  },
  reducers: {
    init(state) {
      const urlParams = new URL(window.location.href);
      const filters = topSysList.filter(
        item =>
          urlParams.hash.startsWith(`#${item.value}`) || urlParams.pathname.startsWith(item.value)
      );
      let params = {};
      if (filters && filters.length > 0) {
        const param = filters[0].value;
        params = {
          logoSrc: `./logos${param}.png`,
        };
      }

      return {
        ...state,
        ...params,
      };
    },
  },
};
