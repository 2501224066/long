import {
    loginOut,
    inviteList,
    todoList,
    luckList,
    luck,
    getData,
    getLuckInfo,
    manNum,
    only,
    config,
    subscribe
} from '../../api/index'
var app = getApp();

let i = 0
let quan = 5
let lock = false
let firstLuck = 0

Page({
    data: {
        alert: {
            show: false,
            type: 1,
            type2: 0,
            obj: {}
        },
        info: {
            show: false,
        },
        loginStatus: wx.getStorageSync('loginStatus') || false,
        phone: null,
        inviteList: [],
        todoList: [],
        luckList: [],
        zhongjiang: null,
        luck: {},
        num: 0,
        manNum: 0,
        config: {},
        firstLuck: 0,
        dingyue: 0,
    },

    onShow() {
        const phone = wx.getStorageSync('phone')
        this.setData({
            loginStatus: wx.getStorageSync('loginStatus') || false,
            phone: phone ? (phone.substr(0, 3) + '****' + phone.substr(7, 4)) : null
        })
        this.getInviteList()
        this.getTodoList()
        this.getLuckList()
        this.getManNum()
        this.getConfig()
        this.init()
        if (wx.getStorageSync('loginStatus') && !wx.getStorageSync('yycg') && !this.data.alert.show) {
            this.setData({
                alert: {
                    show: true,
                    type: 2,
                    type2: 0,
                }
            })
            wx.setStorageSync('yycg', true)
        }
    },

    getConfig() {
        config().then(res => {
            this.setData({
                config: res.data
            })
            wx.setStorageSync('luckRule', res.data.luck_rule)
        })
    },

    getManNum() {
        manNum().then(res => {
            this.setData({
                manNum: res.data.reserveCount
            })
        })
    },

    unyaoqing() {
        this.setData({
            alert: {
                show: true,
                type: 8,
                type2: 0,
                obj: {
                    txt: this.data.config.miss_status === -1 ? '活动未开始' : '活动已结束'
                }
            }
        })
    },

    init() {
        if (!this.data.loginStatus) return
        getData().then(res => {
            this.setData({
                num: res.data.point,
                dingyue: res.data.is_sub
            })
            firstLuck = JSON.stringify(res.data.luck_info) !== '[]' ? firstLuck === 0 ? 1 : 2 : 0
            if (firstLuck === 1) {
                this.setData({
                    alert: {
                        show: true,
                        type: 6,
                        type2: 0,
                        obj: {
                            code: res.data.luck_info.luck_code,
                            title: res.data.luck_info.luck_title
                        }
                    }
                })
            }
        })
    },

    guanzhu(e) {
        app.globalData.leitingweb.track('click_media')
        this.setData({
            alert: {
                show: true,
                type: 7,
                type2: 0,
                obj: {
                    qr: e.target.dataset.type === '1' ? this.data.config.wechat_image : this.data.config.workchat_image,
                    title: e.target.dataset.type === '1' ? this.data.config.wechat_image_text : this.data.config.workchat_image_text
                }
            }
        })
    },

    quwancheng(e) {
        app.globalData.leitingweb.track('click_goFinish')
        if (e.target.dataset.type !== '3' || (e.target.dataset.type === '3' && !e.target.dataset.qr)) {
            wx.showToast({
                mask: true,
                icon: "none",
                title: e.target.dataset.status === 2 ? '任务已完成' : '任务已结束'
            })
            return
        }
        if (e.target.dataset.type === '3') {
            only({
                miss_id: e.target.dataset.id
            }).then(res => {
                this.getTodoList()
                this.init()
                if (e.target.dataset.qr.length) {
                    this.setData({
                        alert: {
                            show: true,
                            type: 7,
                            type2: 0,
                            obj: {
                                qr: e.target.dataset.qr,
                                title: e.target.dataset.title
                            }
                        }
                    })
                }
            })
        }
    },

    kaishi() {
        app.globalData.leitingweb.track('click_draw')
        if (lock) {
            wx.showToast({
                mask: true,
                icon: "none",
                title: '抽奖中,请勿重复操作',
            })
            return
        }
        luck().then(res => {
            this.setData({
                luck: res.data,
                num: res.data.point
            })
            quan = 5
            lock = true
            this.gundong()
        })
    },

    gundong() {
        const list = [0, 1, 2, 5, 8, 7, 6, 3];
        this.setData({
            zhongjiang: list[i]
        })
        if (quan === 0 && (this.data.luck.luck_type === 6 || this.data.luckList[list[i]].id === this.data.luck.luck_key)) {
            this.setData({
                alert: {
                    show: true,
                    type: this.data.luck.luck_type === 6 ? 10 : 9,
                    type2: 0,
                    obj: this.data.luck
                },
                zhongjiang: this.data.luck.luck_type === 6 ? null : this.data.zhongjiang
            })
            lock = false
            return
        }
        i++
        if (i > 7) {
            if (quan === 0) {
                lock = false
                this.setData({
                    zhongjiang: null
                })
                return
            }
            i = 0;
            quan--
        }
        setTimeout(() => {
            this.gundong()
        }, 100)
    },

    getInviteList() {
        inviteList().then(res => {
            this.setData({
                inviteList: JSON.stringify(res.data) === '{}' ? [] : res.data
            })
        })
    },

    getTodoList() {
        todoList().then(res => {
            this.setData({
                todoList: res.data
            })
        })
    },

    getLuckList() {
        luckList().then(res => {
            res.data.splice(4, 0, {})
            this.setData({
                luckList: res.data
            })
        })

    },

    getInfo() {
        app.globalData.leitingweb.track('click_order')
        if (wx.getStorageSync('userInfo')) {
            wx.navigateTo({
                url: '/pages/login/login',
            })
            return
        }
        this.setData({
            info: {
                show: true
            }
        })
    },

    guize() {
        this.setData({
            alert: {
                show: true,
                type: 4,
                type2: 0,
                obj: {
                    txt: this.data.config.rule
                }
            }
        })
    },

    dingyue() {
        if (!this.data.loginStatus) {
            this.getInfo()
            return
        }
        if (this.data.dingyue === 1) {
            wx.showToast({
                mask: true,
                icon: "none",
                title: '您已完成订阅',
            })
            return
        }
        app.globalData.leitingweb.track('click_subscribe')
        let that = this
        wx.requestSubscribeMessage({
            tmplIds: ['chIgRVBmZrBHvmDDr8oJ-dcOg5VKwnk1wFvevjirQkA', 'chIgRVBmZrBHvmDDr8oJ-WLLresqqDPK3SDRh5OrFQ0', 'DqFoX0vAPXAF5_aZz8zmbFgk-7tDyQMm0WZvcvcnswk'],
            success(res) {
                if (res['chIgRVBmZrBHvmDDr8oJ-dcOg5VKwnk1wFvevjirQkA'] === "accept") {
                    subscribe()
                    that.setData({
                        dingyue: 1
                    })
                }
            },
            fail(e) {
                console.log(e)
            }
        })
    },

    beibao() {
        getLuckInfo().then(res => {
            if (res.data.list.length) {
                this.setData({
                    alert: {
                        show: true,
                        type: 11,
                        type2: 0,
                        obj: res.data
                    }
                })
            } else {
                this.setData({
                    alert: {
                        show: true,
                        type: 8,
                        type2: 0,
                        obj: {
                            txt: '暂无奖励'
                        }
                    }
                })
            }
        })
    },

    jiebang() {
        loginOut().then(res => {
            wx.showToast({
                mask: true,
                icon: 'success',
                title: '解绑成功',
            })
            wx.removeStorageSync('loginStatus')
            wx.removeStorageSync('id')
            wx.removeStorageSync('token')
            wx.removeStorageSync('phone')
            setTimeout(() => {
                wx.redirectTo({
                    url: "/pages/index/index",
                })
            }, 1000)
        })
    },

    yaoqingman() {
        app.globalData.leitingweb.track('click_complete')
    },

    onShareAppMessage(e) {
        let obj = {
            title: this.data.config.wechat_share_title,
            path: `/pages/share/share?id=${wx.getStorageSync('userId')}&phone=${this.data.phone}`,
            imageUrl: this.data.config.wechat_share_image,
        }
        if (!this.data.loginStatus && e.from === "menu") return obj

        if (!this.data.loginStatus) {
            this.getInfo()
            obj.promise = new Promise((resolve, rejects) => {
                rejects()
            })
        }

        if (this.data.config.miss_status !== 1) {
            this.unyaoqing()
            obj.promise = new Promise((resolve, rejects) => {
                rejects()
            })
        }

        app.globalData.leitingweb.track('click_invite')
        return obj
    }
})