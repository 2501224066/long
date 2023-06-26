var common = require('./request')

// 微信登录
export function login(data, repair = '') {
  return common.go({
    method: 'post',
    url: '/user/mobile-login' + repair,
    data: data
  })
}

// 是否绑定别人
export function bindOther(data, repair = '') {
  return common.go({
    method: 'post',
    url: '/user/bind-other' + repair,
    data: data
  })
}

export function smsMobile(data, repair = '') {
  return common.go({
    method: 'post',
    url: '/user/smsMobile' + repair,
    data: data
  })
}

export function uploadImage(data, repair = '') {
  return common.go({
    method: 'post',
    url: '/upload/image' + repair,
    data: data
  })
}


export function loginOut(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/user/loginOut' + repair,
    data: data
  })
}

export function inviteList(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/user/my-invite' + repair,
    data: data
  })
}

export function todoList(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/miss/lists' + repair,
    data: data
  })
}

export function luckList(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/luck/get-config-list' + repair,
    data: data
  })
}

export function luck(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/luck/get' + repair,
    data: data
  })
}

export function getData(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/user/init-login' + repair,
    data: data
  })
}

export function getLuckInfo(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/luck/info' + repair,
    data: data
  })
}

export function getCodeInfo(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/luck/code-info' + repair,
    data: data
  })
}

export function getAddress(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/address/get' + repair,
    data: data
  })
}

export function setAddress(data, repair = '') {
  return common.go({
    method: 'post',
    url: '/address/set' + repair,
    data: data
  })
}


export function manNum(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/user/basicInfo' + repair,
    data: data
  })
}

export function accept(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/user/accept-invite' + repair,
    data: data
  })
}

export function captcha(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/image/captcha' + repair,
    data: data
  })
}

export function only(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/miss/addPoint' + repair,
    data: data
  })
}

export function config(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/home/config' + repair,
    data: data
  })
}

export function codeLogin(data, repair = '') {
  return common.go({
    method: 'post',
    url: '/user/code-login' + repair,
    data: data
  })
}

export function subscribe(data, repair = '') {
  return common.go({
    method: 'post',
    url: '/user/sub' + repair,
    data: data
  })
}

export function receive(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/luck/receive' + repair,
    data: data
  })
}

export function image(data, repair = '') {
  return common.go({
    method: 'get',
    url: '/link/image' + repair,
    data: data
  })
}
