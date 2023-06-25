Component({
    properties: {
        show: {
            type: Boolean,
            value: true,
        }
    },
    data: {},
    lifetimes: {
        attached: function () {
            setTimeout(() => {
                this.setData({
                    show: false
                })
            }, 1000)
        },
    }
})