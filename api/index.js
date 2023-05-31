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
