import {
  BASE_URL
} from './constant.js'

const go = function (obj) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + obj.url,
      method: obj.method,
      data: obj.data,
      header: {
        'token': wx.getStorageSync('token') || '',
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(obj.url, res)
        if (res.data.code === 200) {
          resolve(res.data)
        } else if (res.data.code === 403) {
          wx.showToast({
            icon: 'none',
            title: '登录已过期'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: "/pages/login/login",
            })
          }, 1000)
        } else if (res.data.code === -1) {
          wx.showToast({
            icon: 'none',
            title: res.data.msg
          })
          resolve(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: function () {
        reject()
        wx.showToast({
          icon: 'none',
          title: '网络请求超时，请退出重试',
          duration: 4000,
        })
      }
    })
  })
}

module.exports = {
  go
}
