import {
    getCodeInfo,
    getAddress,
    setAddress
} from "../../api/index"

Component({
    properties: {
        type: {
            type: Number,
            value: 1,
        },
        type2: {
            type: Number,
            value: 0,
        },
        show: {
            type: Boolean,
            value: false,
        },
        obj: {
            type: Object,
            value: {},
        }
    },
    data: {
        name: null,
        phone: null,
        region: ['广东省', '深圳市', '南山区'],
        address: null,
        codeList: [],
        tijiao: true
    },
    methods: {
        close: function () {
            this.setData({
                show: false
            })
        },

        left: function () {
            if (this.data.type === 1 || this.data.type === 2) {
                this.setData({
                    show: false
                })
            }
        },

        right: function () {
            this.setData({
                show: false
            })
            if (this.data.type === 1) {
                this.triggerEvent('denglu')
            }
            if (this.data.type === 2) {
                this.triggerEvent('dingyue')
            }
        },

        center: function () {
            if (this.data.type === 10) {
                this.setData({
                    show: false
                })
            }
            if (this.data.type === 3) {
                wx.navigateTo({
                    url: '/pages/index/index',
                })
            }
            if (this.data.type === 6) {
                this.setData({
                    type: 11,
                    type2: 2
                })
                this.tabRight()
            }
        },

        tabLeft: function () {
            this.setData({
                type2: 0
            })
        },

        tabCenter: function () {
            getCodeInfo().then(res => {
                this.setData({
                    codeList: res.data.list,
                    type2: 1
                })
            })
        },

        tabRight: function () {
            getAddress().then(res => {
                if (res.data.consignee) {
                    this.setData({
                        name: res.data.consignee,
                        phone: res.data.mobile,
                        region: [res.data.province, res.data.city, res.data.area],
                        address: res.data.address,
                        tijiao: false
                    })
                }
                this.setData({
                    type2: 2
                })
            })
        },

        fuzhi: function (e) {
            wx.setClipboardData({
                data: e.target.dataset.txt,
                success() {
                    wx.showToast({
                        icon: 'none',
                        title: '复制成功',
                    })
                }
            })
        },

        tijiao: function () {
            if (this.data.type === 11) {
                setAddress({
                    "consignee": this.data.name, //收货人
                    "mobile": this.data.phone, //收货人
                    "province": this.data.region[0], //收货人
                    "city": this.data.region[1], //收货人
                    "area": this.data.region[2], //收货人
                    "address": this.data.address, //收货人
                }).then(res => {
                    wx.showToast({
                        icon: "success",
                        title: '设置成功',
                    })
                })
            }
        },

        setState: function (e) {
            this.setData({
                [e.currentTarget.dataset.name]: e.detail.value
            })
        },

        bindRegionChange: function (e) {
            this.setData({
                region: e.detail.value
            })
        }
    },
})