import {
  image
} from "../../api/index"

Page({
  data: {
    img: null
  },

  onLoad(options) {
    this.getImg(options.pid || 1)
  },

  async getImg(pid) {
    let res = await image({
      pid
    })
    this.setData({
      img: res.data.path
    })
  },

  preview: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: [e.currentTarget.dataset.src]
    })
  },
})
