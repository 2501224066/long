import {
    loginOut,
    inviteList,
    todoList,
    luckList,
    luck,
    getData,
    getLuckInfo,
    manNum,
    invite,
    only,
    config
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
        firstLuck: 0
    },

    onLoad(option) {
        if (option.dycg === '1') {
            this.setData({
                alert: {
                    show: true,
                    type: 2,
                    type2: 0,
                }
            })
        }
        const phone = wx.getStorageSync('phone')
        this.setData({
            loginStatus: wx.getStorageSync('loginStatus') || false,
            phone: phone ? (phone.substr(0, 3) + '****' + phone.substr(3, 4)) : null
        })
        this.init()
        this.getInviteList()
        this.getTodoList()
        this.getLuckList()
        this.getManNum()
        this.getConfig()
    },

    getConfig() {
        config().then(res => {
            this.setData({
                config: res.data
            })
        })
    },

    getManNum() {
        manNum().then(res => {
            this.setData({
                manNum: res.data.reserveCount
            })
        })
    },

    init() {
        if (!this.data.loginStatus) return
        getData().then(res => {
            this.setData({
                num: res.data.point,
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
                    title: e.target.dataset.type === '1' ? '官方公众号' : '官方企业微信号'
                }
            }
        })
    },

    quwancheng(e) {
       app.globalData.leitingweb.track('click_goFinish')
        if (e.target.dataset.status !== 1) {
            wx.showToast({
                icon: "none",
                title: '任务已完成或已结束'
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
        if (quan === 0 && this.data.luckList[list[i]].id === this.data.luck.luck_key) {
            this.setData({
                alert: {
                    show: true,
                    type: this.data.luck.luck_key === 9 ? 10 : 9,
                    type2: 0,
                    obj: this.data.luck
                }
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
                type2: 0
            }
        })
    },

    dingyue() {
        app.globalData.leitingweb.track('click_subscribe')
        wx.requestSubscribeMessage({
            tmplIds: ['chIgRVBmZrBHvmDDr8oJ-WLLresqqDPK3SDRh5OrFQ0'],
            success(res) {}
        })
    },

    beibao() {
        getLuckInfo().then(res => {
            this.setData({
                alert: {
                    show: true,
                    type: 11,
                    type2: 0,
                    obj: res.data
                }
            })
        })
    },

    jiebang() {
        loginOut().then(res => {
            wx.showToast({
                icon: 'success',
                title: '解绑成功',
            })
            wx.removeStorageSync('loginStatus')
            wx.removeStorageSync('id')
            wx.removeStorageSync('token')
            wx.removeStorageSync('userInfo')
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

    onShareAppMessage() {
        app.globalData.leitingweb.track('click_invite')
        return invite().then(res => {
            return {
                title: this.data.config.wechat_share_title,
                path: `/page/index/index?id=${wx.getStorageSync('id')}&phone=${this.data.phone}`,
                imageUrl: this.data.config.wechat_share_image
            }
        })
    }
})