import {
    config
} from '../../api/index'

Page({
    data: {
        alert: {
            show: false,
            type: 1,
            type2: 0,
            obj: {}
        },
    },

    onLoad() {
        this.getConfig()
    },

    getConfig() {
        config().then(res => {
            this.setData({
                alert: {
                    show: true,
                    type: 7,
                    type2: 0,
                    obj: {
                        qr: res.data.wechat_image,
                        title: '官方公众号'
                    }
                }
            })
        })
    },
})