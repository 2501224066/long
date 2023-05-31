import {
    bindOther,
    login,
    smsMobile
} from '../../api/index'

Page({
    data: {
        phone: 18827335317,
        code: null,
        code1: null,
        code2: null,
        agree: false,
        shareCode: 0,
    },

    onLoad() {
        this.getCode()
    },

    getCode() {
        let that = this
        // 获取code
        wx.login({
            success(res) {
                that.setData({
                    code: res.code
                })
            }
        })
    },

    agree() {
        this.setData({
            agree: !this.data.agree
        })
    },

    yanzheng() {
        if (!this.phoneYZ()) return
        this.selectComponent('#captcha').show()
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
            "mobile": this.data.phone,
            "ticket": this.data.code1,
            "randstr": Math.random().toString(36).substr(5, 4)
        }).then(res => {
            if (res.data.code === -1) {
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
        bindOther({
            "mobile": this.data.phone,
            "mobile_code": this.data.code2
        }).then(res => {
            if (res.data.code === -1) {
                wx.showToast({
                    icon: "none",
                    title: '短信验证码错误',
                })
                this.setData({
                    code2: null
                })
                return
            }
            if (res.data.code === 703) {
                wx.showModal({
                    title: '提示',
                    content: '当前登录手机号已绑定其他微信,继续登录将解绑原有微信，并绑定当前微信',
                    success(res) {
                        if (res.confirm) {
                            this.denglu2()
                        } else if (res.cancel) {
                            return
                        }
                    }
                })
            } else {
                this.denglu2()
            }
        })
    },

    denglu2() {
        const userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        login({
            "mobile": this.data.phone,
            "share_user_id": this.data.shareCode,
            "code": this.data.code,
            "wx_nickname": userInfo.nickName,
            "wx_headimgurl": userInfo.avatarUrl
        }).then(res => {
            wx.setStorageSync('loginStatus', true)
            wx.setStorageSync('userId', res.data.id)
            wx.setStorageSync('token', res.data.token)
            wx.showToast({
                icon: 'success',
                title: '登录成功'
            })
            setTimeout(() => {
                wx.redirectTo({
                    url: "/pages/index/index",
                })
            }, 1000)
        })
    }
})