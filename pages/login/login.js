import {
    bindOther,
    login,
    smsMobile,
    captcha
} from '../../api/index'

Page({
    data: {
        phone: 18827335317,
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
    },

    onLoad() {
        this.getCode()
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

    getCode() {
        let that = this
        // 获取code
        wx.login({
            success(e) {
                that.setData({
                    code: e.code
                })
            }
        })
    },

    agree() {
        this.setData({
            agree: !this.data.agree
        })
    },

    phoneYZ() {
        if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.data.phone))) {
            wx.showToast({
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

    ma() {
        if (!this.phoneYZ()) return
        if (!this.data.code1) {
            wx.showToast({
                icon: "none",
                title: '图形验证失败',
            })
            return
        }
        smsMobile({
            mobile: this.data.phone,
            key: this.data.captchaKey,
            captcha_code: this.data.code1
        }).then(res => {
            if (res.code === -1) {
                wx.showToast({
                    icon: "error",
                    title: '发送失败',
                })
            } else {
                wx.showToast({
                    icon: "success",
                    title: '发送成功',
                })
            }
        })
    },

    denglu() {
        if (!this.data.agree) {
            wx.showToast({
                icon: 'none',
                title: '请先同意相关条款和协议'
            })
            return
        }
        if (!this.phoneYZ()) return
        if (!this.data.code1) {
            wx.showToast({
                icon: "none",
                title: '图形验证失败',
            })
            return
        }
        let that = this
        bindOther({
            mobile: this.data.phone,
            mobile_code: this.data.code2
        }).then(res => {
            if (res.code === 703) {
                this.setData({
                    alert: {
                        show: true,
                        type: 1,
                        type2: 0
                    }
                })
            } else {
                that.denglu2()
            }
        })
    },

    denglu2() {
        const userInfo = wx.getStorageSync('userInfo')
        login({
            "mobile": this.data.phone,
            "share_user_id": this.data.shareCode,
            "code": this.data.code,
            "wx_nickname": userInfo.nickname,
            "wx_headimgurl": userInfo.avatarUrl
        }).then(res => {
            wx.setStorageSync('phone', this.data.phone.toString())
            wx.setStorageSync('loginStatus', true)
            wx.setStorageSync('userId', res.data.id)
            wx.setStorageSync('token', res.data.token)
            wx.removeStorageSync('ivId')
            wx.showToast({
                icon: 'success',
                title: '登录成功'
            })
            setTimeout(() => {
                wx.redirectTo({
                    url: "/pages/index/index?dycg=1",
                })
            }, 1000)
        })
    }
})