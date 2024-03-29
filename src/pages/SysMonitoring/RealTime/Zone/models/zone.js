export default {
  namespace: 'zone',

  state: {
    baseMap: {
      image: './assets/zone/map.png',
      width: 1173,
      height: 600,
    },
    zones: [
      // {
      //     key: '1',
      //     x: 80,
      //     y: 42,
      //     width: 183,
      //     height: 233,
      //     fillColor: '#b2eefe',
      //     image: './assets/zone/q1.png',
      //     alarmCount: 12,
      // },
      // {
      //     key: '2',
      //     x: 274,
      //     y: 50,
      //     width: 160,
      //     height: 225,
      //     fillColor: '#b2eefe',
      //     image: './assets/zone/q2.png',
      //     alarmCount: 7,
      // },
      // {
      //     key: '3',
      //     x: 451,
      //     y: 83,
      //     width: 140,
      //     height: 192,
      //     fillColor: '#ccd0fd',
      //     image: './assets/zone/q6.png',
      //     alarmCount: 6,
      // },
      // {
      //     key: '4',
      //     x: 602,
      //     y: 78,
      //     width: 166,
      //     height: 197,
      //     fillColor: '#ccd0fd',
      //     alarmCount: 1,
      //     image: './assets/zone/q7.png',
      // },
      // {
      //     key: '5',
      //     x: 821,
      //     y: 28,
      //     width: 72,
      //     height: 52,
      //     fillColor: '#ffcefb',
      //     image: './assets/zone/q11.png',
      //     alarmCount: 16,
      // },
      // {
      //     key: '6',
      //     x: 780,
      //     y: 50,
      //     width: 168,
      //     height: 105,
      //     fillColor: '#ccd0fd',
      //     image: './assets/zone/q12.png',
      //     alarmCount: 9,
      // },
      {
        key: '7',
        x: 780,
        y: 159,
        width: 184,
        height: 113,
        fillColor: '#ccd0fd',
        image: './assets/zone/q13.png',
        alarmCount: 16,
        areaId: '61',
      },
      // {
      //     key: '8',
      //     x: 900,
      //     y: 189,
      //     width: 93,
      //     height: 80,
      //     fillColor: '#bcf2c3',
      //     image: './assets/zone/q14.png',
      //     alarmCount: 5,
      // },
      // {
      //     key: '9',
      //     x: 80,
      //     y: 284,
      //     width: 183,
      //     height: 137,
      //     fillColor: '#b2eefe',
      //     image: './assets/zone/q3.png',
      //     alarmCount: 16,
      // },
      // {
      //     key: '10',
      //     x: 274,
      //     y: 283,
      //     width: 153,
      //     height: 138,
      //     fillColor: '#ffbcbf',
      //     image: './assets/zone/q5.png',
      //     alarmCount: 16,
      // },
      // {
      //     key: '11',
      //     x: 274,
      //     y: 284,
      //     width: 48,
      //     height: 22,
      //     fillColor: '#fff7db',
      //     image: './assets/zone/q4.png',
      //     alarmCount: 16,

      // },
      // {
      //     key: '12',
      //     x: 451,
      //     y: 283,
      //     width: 140,
      //     height: 144,
      //     fillColor: '#ccd0fd',
      //     image: './assets/zone/q8.png',
      //     alarmCount: 1,
      // },
      // {
      //     key: '13',
      //     x: 602,
      //     y: 286,
      //     width: 178,
      //     height: 141,
      //     fillColor: '#ccd0fd',
      //     image: './assets/zone/q9.png',
      //     alarmCount: 16,
      // },
      // {
      //     key: '14',
      //     x: 681,
      //     y: 381,
      //     width: 29,
      //     height: 46,
      //     fillColor: '#bcf2c3',
      //     alarmCount: 16,
      //     image: './assets/zone/q19.png',
      // },
      // {
      //     key: '15',
      //     x: 781,
      //     y: 287,
      //     width: 118,
      //     height: 141,
      //     fillColor: '#b2eefe',
      //     image: './assets/zone/q10.png',
      //     alarmCount: 16,
      // },
      {
        key: '16',
        x: 907,
        y: 279,
        width: 86,
        height: 157,
        fillColor: '#ffccd7',
        image: './assets/zone/q15.png',
        alarmCount: 12,
        areaId: '5',
      },
      {
        key: '17',
        x: 928,
        y: 315,
        width: 14,
        height: 31,
        fillColor: '#ffe7d8',
        image: './assets/zone/q16.png',
        alarmCount: 2,
        areaId: '4',
      },
      // {
      //     key: '18',
      //     x: 990,
      //     y: 288,
      //     width: 70,
      //     height: 107,
      //     fillColor: '#ffe7d8',
      //     image: './assets/zone/q17.png',
      //     alarmCount: 11,
      // },
      // {
      //     key: '19',
      //     x: 965,
      //     y: 410,
      //     width: 136,
      //     height: 142,
      //     fillColor: '#ffe7d8',
      //     image: './assets/zone/q18.png',
      //     alarmCount: 5,
      // },
    ],
    area: [
      {
        id: '1',
        name: '综合服务区',
        color: '#ff69a8',
      },
      // {
      //   id: '2',
      //   name: '标准仓库',
      //   color: '#4158fa',
      // },
      // {
      //   id: '3',
      //   name: '电子类标准厂房',
      //   color: '#ff797c',
      // },
      // {
      //   id: '4',
      //   name: '区外配套设备',
      //   color: '#ffe36f',
      // },
      // {
      //   id: '5',
      //   name: '区内配套设备',
      //   color: '#ffe36f',
      // },
      // {
      //   id: '6',
      //   name: '查验区',
      //   color: '#b94cfa',
      // },
      // {
      //   id: '7',
      //   name: '熏蒸区',
      //   color: '#ff66f2',
      // },
      // {
      //   id: '8',
      //   name: '一日游区',
      //   color: '#b94cfa',
      // },
      // {
      //   id: '9',
      //   name: '公共停车场',
      //   color: '#71e16b',
      // },
      // {
      //   id: '10',
      //   name: '中外保运税仓库',
      //   color: '#4158fa',
      // },
      // {
      //   id: '11',
      //   name: '区外配套设施',
      //   color: '#ffe36f',
      // },
      // {
      //   id: '12',
      //   name: '保税加工预留用地',
      //   color: '#4158fa',
      // },
      {
        id: '13',
        name: '保税物流预留用地',
        color: '#00C6FF',
      },
    ],
  },

  effects: {},

  reducers: {},
};
