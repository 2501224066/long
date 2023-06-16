// pages/photo/photo.js
Page({
  data: {
    img: null
  },

  onLoad(options) {
    this.getImg(options.pid)
  },

  async getImg(pid) {
    let res = await img({
      pid
    })
    this.data.img = res.data
  },

  preview: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: [e.currentTarget.dataset.src]
    })
  },
})
