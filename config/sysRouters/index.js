/* eslint-disable import/prefer-default-export */
import monitoring from './monitoring.conf'
import iop from './iop.conf'
import imc from './imc.conf'
import pageRoutes from '../router.config'

export function getSysConfig (bisName) {
  let result = []
  switch (bisName) {
    case 'monitoring': // 安全监控系统
      result = monitoring
      break
    case 'iop': // 综合运维系统
      result = iop
      break
    case 'imc': // 综合管控系统
      result = imc
      break
    default:
      result = pageRoutes
  }
  return result
}
