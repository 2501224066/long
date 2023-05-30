var common = require('./request')

// 首页
export function home(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/voice/homePage' + repair,
    data: data
  })
}
