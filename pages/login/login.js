import {
    login,
    smsMobile,
    captcha
} from '../../api/index'

import {
    debounce
} from '../../utils/util'

Page({
    data: {
        phone: null,
        code: null,
        code1: null,
        code2: null,
        agree: false,
        shareCode: 0,
        captcha: null,
        captchaKey: null,
        alert: {
            show: false,
            type: 1,
            type2: 0,
            obj: {}
        },
        sendTime: 0,
    },

    onShow() {
        this.getCaptcha()
        this.setData({
            shareCode: wx.getStorageSync('ivId') || 0
        })
    },

    getCaptcha() {
        captcha().then(res => {
            this.setData({
                captcha: res.data.base64_image,
                captchaKey: res.data.key
            })
        })
    },

    xy1() {
        wx.navigateTo({
            url: '/pages/link/link?src=https://www.leiting.com/terrace/mobile/news/news_detail_ff80808171a5bad00171a64e53870006.html',
        })
    },

    xy2() {
        wx.navigateTo({
            url: '/pages/link/link?src=https://www.leiting.com/terrace/news/news_detail_ff8080816f6510d4016f9e532924003e.html',
        })
    },

    agree() {
        this.setData({
            agree: !this.data.agree
        })
    },

    phoneYZ() {
        if (!(/^1[0-9][0-9]\d{8,8}$/.test(this.data.phone))) {
            wx.showToast({
                duration: 2000,
                mask: true,
                icon: "none",
                title: '请输入正确的手机号码',
            })
            return false
        }
        return true
    },

    setState(e) {
        this.setData({
            [e.currentTarget.dataset.name]: e.detail.value
        })
    },

    handlerVerify: function (ev) {
        if (ev.detail.ret === 0) {
            this.setData({
                code1: ev.detail.ticket
            })
        }
    },

    toHome() {
        wx.redirectTo({
            url: "/pages/index/index",
        })
    },

    ma: debounce(function () {
        if (this.data.sendTime > 0) {
            wx.showToast({
                duration: 2000,
                mask: true,
                icon: "none",
                title: '请稍等片刻',
            })
            return
        }
        if (!this.phoneYZ()) return
        if (!this.data.code1) {
            wx.showToast({
                duration: 2000,
                mask: true,
                icon: "none",
                title: '请输入图形验证码',
            })
            return
        }
        this.setData({
            sendTime: 60
        })
        smsMobile({
            mobile: this.data.phone,
            key: this.data.captchaKey,
            captcha_code: this.data.code1
        }).then(res => {
            if (res.code !== 200) {
                this.setData({
                    code1: null,
                    sendTime: 0
                })
                this.getCaptcha()
            } else {
                wx.showToast({
                    duration: 2000,
                    mask: true,
                    icon: "success",
                    title: '发送成功',
                })
                this.setSendTime()
            }
        })
    }),

    setSendTime() {
        if (this.data.sendTime === 0) return
        setTimeout(() => {
            this.setData({
                sendTime: this.data.sendTime - 1
            })
            this.setSendTime()
        }, 1000)
    },

    denglu() {
        if (!this.data.agree) {
            wx.showToast({
                duration: 2000,
                mask: true,
                icon: 'none',
                title: '请先同意相关条款和协议'
            })
            return
        }
        if (!this.phoneYZ()) return
        if (!this.data.code1) {
            wx.showToast({
                duration: 2000,
                mask: true,
                icon: "none",
                title: '请输入图形验证码',
            })
            return
        }
        wx.showLoading({
            title: '登录中',
            mask: true
        })
        let that = this
        const userInfo = wx.getStorageSync('userInfo') || {
            avatarUrl: 'https://ossstatic.leiting.com/static/lqs/202306/images/head.png',
            nickname: ''
        }
        wx.login({
            success(e) {
                login({
                    mobile_code: that.data.code2,
                    code: e.code,
                    mobile: that.data.phone,
                    share_user_id: that.data.shareCode,
                    wx_nickname: userInfo.nickname,
                    wx_headimgurl: userInfo.avatarUrl
                }).then(res => {
                    wx.hideLoading()
                    if (res.code === 703) {
                        that.setData({
                            alert: {
                                show: true,
                                type: 1,
                                type2: 0
                            }
                        })
                        wx.hideLoading()
                        return
                    }
                    if (res.code !== 200) {
                        wx.showToast({
                            duration: 2000,
                            mask: true,
                            icon: "none",
                            title: res.msg,
                        })
                        wx.hideLoading()
                        return
                    }

                    wx.setStorageSync('phone', that.data.phone.toString())
                    wx.setStorageSync('loginStatus', true)
                    wx.setStorageSync('userId', res.data.id)
                    wx.setStorageSync('token', res.data.token)
                    let ivPhone = wx.getStorageSync('ivPhone')
                    let ivId = wx.getStorageSync('ivId')
                    wx.removeStorageSync('ivPhone')
                    wx.removeStorageSync('ivId')

                    if (res.data.pop_up === 2) {
                        wx.redirectTo({
                            url: `/pages/share/share?phone=${ivPhone}&id=${ivId}`
                        })
                        return
                    }
                    if (res.data.pop_up === 0) {
                        wx.redirectTo({
                            url: "/pages/index/index",
                        })
                        return
                    }
                    that.setData({
                        alert: {
                            show: true,
                            type: 8,
                            type2: 0,
                            obj: {
                                txt: '当前邀请人数已满5人'
                            }
                        }
                    })
                    setTimeout(() => {
                        wx.redirectTo({
                            url: "/pages/index/index",
                        })
                    }, 2000)
                })

            }
        })
    },
})