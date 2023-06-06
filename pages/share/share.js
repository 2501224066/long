import {
    manNum,
    accept
} from '../../api/index'
var app = getApp();

Page({
    data: {
        ivPhone: null,
        ivId: null,
        manNum: 0,
        alert: {
            show: false,
            type: 1,
            type2: 0,
            obj: {}
        },
        loginStatus: wx.getStorageSync('loginStatus') || null,
        info: {
            show: false,
        },
    },

    onLoad(options) {
        this.setData({
            ivPhone: options.phone || null,
            ivId: options.id || null,
        })
        if (options.id) wx.setStorageSync('ivId', options.id)
        this.getManNum()
    },

    onShow() {
        this.setData({
            loginStatus: wx.getStorageSync('loginStatus') || null
        })
    },

    getManNum() {
        manNum().then(res => {
            this.setData({
                manNum: res.data.reserveCount
            })
        })
    },

    jieshou() {
        app.globalData.leitingweb.track('click_accept')
        if (wx.getStorageSync('loginStatus')) {
            wx.navigateTo({
                url: '/pages/index/index',
            })
            return
        }

        accept({
            invite_user_id: this.data.ivId
        }).then(res => {
            if (res.code === 701) {
                this.setData({
                    alert: {
                        alert: {
                            show: true,
                            type: 3,
                            type2: 0,
                        },
                    }
                })
                return
            }
            this.setData({
                info: {
                    show: true
                }
            })
        })
    },
})