import {
    loginOut,
    inviteList,
    todoList,
    luckList,
    luck,
    getData,
    getLuckInfo,
    manNum,
    invite
} from '../../api/index'

let i = 0
let quan = 5
let lock = false

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
                num: res.data.point
            })
        })
    },

    gongzhonghao() {
        this.setData({
            alert: {
                show: true,
                type: 7,
                type2: 0
            }
        })
    },

    weixin() {
        this.setData({
            alert: {
                show: true,
                type: 8,
                type2: 0
            }
        })
    },

    quwancheng(e) {
        if (e.target.dataset.status !== 1) {
            wx.showToast({
                icon: "none",
                title: '任务已完成或已结束'
            })
        }
    },

    kaishi() {
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

    onShareAppMessage() {
        invite().then(res => {
            return {
                title: '速来，真·金币免费送',
                path: `/page/index/index?id=${wx.getStorageSync('id')}&phone=${this.data.phone}`,
                imageUrl: ""
            }
        })
    }
})