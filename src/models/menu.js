import memoizeOne from 'memoize-one'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { formatMessage } from 'umi-plugin-react/locale'
import Authorized from '@/utils/Authorized'
import { menu } from '../defaultSettings'
import { getAllZone } from '@/services/area'

const { check } = Authorized


// Conversion router to menu.
function formatter (data, parentAuthority, parentName) {
  if (!data) {
    return undefined
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null
      }

      let locale = 'menu'
      if (parentName && parentName !== '/') {
        locale = `${parentName}.${item.name}`
      } else {
        locale = `menu.${item.name}`
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name })
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority
      }
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale)
        // Reduce memory usage
        result.children = children
      }
      delete result.routes
      return result
    })
    .filter(item => item)
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual)

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (
    item.children &&
    !item.hideChildrenInMenu &&
    item.children.some(child => child.name)
  ) {
    return {
      ...item,
      children: filterMenuData(item.children) // eslint-disable-line
    }
  }
  return item
}

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return []
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item)
}
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {}
  }
  const routerMap = {}

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children)
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem
    })
  }
  flattenMenuData(menuData)
  return routerMap
}

const memoizeOneGetBreadcrumbNameMap = memoizeOne(
  getBreadcrumbNameMap,
  isEqual
)

// 实时--建筑挂载到菜单
const formatZoneToMenuData = (zones, parentPath) => {
  return zones
    .filter(_ => _.type === '002')
    .map(z => {
      return {
        // icon: './assets/menu/quyu_normal.png',
        name: z.name,
        path: `${parentPath}/${z.id}`,
        exact: true
      }
    })
}

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},

    zones: []
  },

  effects: {
    * getMenuData ({ payload }, { put, call }) {
      const { routes, authority, path } = payload
      let zones = []
      const actualRoutes = routes.slice()

      // 找到实时的route(挂载到实时的消防集成/门禁监管/视频监控)
      const realtimeRouteIndex = findIndex(routes, {
        path: '/monitoring/realtime'
      })
      if (realtimeRouteIndex !== -1) {
        const response = yield call(getAllZone, payload)
        const { code, ...data } = response
        if (code === 200) {
          zones = data.data || []
        }
        const realtimeRoute = routes[realtimeRouteIndex]
        if (realtimeRoute.routes) {
          realtimeRoute.routes = realtimeRoute.routes.map(r => {
            if (r.dynamic && zones && zones.length > 0) {
              // const childRoute = r.routes[0]
              const zoneRoutes = formatZoneToMenuData(zones || [], r.path)
              return {
                ...r,
                routes: [...(r.routes || []), ...zoneRoutes]
              }
            }
            return r
          })
          actualRoutes[realtimeRouteIndex] = realtimeRoute
        }
      }
      // const originalMenuData = memoizeOneFormatter(routes, authority, path);
      const originalMenuData = memoizeOneFormatter(
        actualRoutes,
        authority,
        path
      )
      const menuData = filterMenuData(originalMenuData)
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(
        originalMenuData
      )
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, routerData: routes, zones }
      })
    }
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
}
