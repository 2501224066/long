import {
    wxLogin
} from '../../api/index'

Page({
    data: {
        alert: {
            show: false,
            type: 1,
            type2: 0
        },
    },
    onLoad() {
    },

    getUserInfo(e) {
        wx.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {
                wx.setStorageSync('userInfo', res.rawData)
                wx.navigateTo({
                  url: '/pages/login/login',
                })
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

    beibao() {
        this.setData({
            alert: {
                show: true,
                type: 11,
                type2: 0
            }
        })
    }
})