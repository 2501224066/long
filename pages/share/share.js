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
        info: {
            show: false,
        }
    },

    onLoad(options) {
        this.setData({
            ivPhone: options.phone || null,
            ivId: options.id || null,
        })
        if (options.id && !wx.getStorageSync('loginStatus')) wx.setStorageSync('ivId', options.id)
        if (options.phone && !wx.getStorageSync('loginStatus')) wx.setStorageSync('ivPhone', options.phone)
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

    getInfo() {
        //app.globalData.leitingweb.track('click_order')
        //if (wx.getStorageSync('userInfo')) {
            wx.navigateTo({
                url: '/pages/login/login',
            })
            return
        //}
        //this.setData({
        //    info: {
        //        show: true
        //    }
        //})
    },

    jieshou() {
        app.globalData.leitingweb.track('click_accept')
        if (wx.getStorageSync('loginStatus')) {
            wx.redirectTo({
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
                        show: true,
                        type: 3,
                        type2: 0,
                    },
                })
                return
            } else if (res.code !== 200) {
                wx.showToast({
                    duration: 2000,
                    mask: true,
                    icon: "none",
                    title: res.msg,
                })
                return
            }
            this.getInfo()
        })
    },
})