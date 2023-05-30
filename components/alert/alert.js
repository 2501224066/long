Component({
  properties: {
    type: {
      type: Number,
      value: 11,
    },
    type2: {
      type: Number,
      value: 2,
    },
    show: {
      type: Boolean,
      value: true,
    }
  },
  data: {
    name: null,
    phone: null,
    region: ['广东省', '深圳市', '南山区'],
    address: null
  },
  methods: {
    close: function () {
      this.setData({
        show: false
      })
    },

    left: function () {
      console.log(111)
    },

    right: function () {
      console.log(222)
    },

    center: function () {
      console.log(333)
    },

    tabLeft: function () {
      this.setData({
        type2: 0
      })
    },

    tabCenter: function () {
      this.setData({
        type2: 1
      })
    },

    tabRight: function () {
      this.setData({
        type2: 2
      })
    },

    fuzhi: function () {
      this.setData({
        type2: 2
      })
    },

    tijiao: function () {
      console.log(889)
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
