import {
  missHome
} from '../../api/index'
Page({

  data: {
    list: []
  },

  onLoad(options) {
    this.getData()
  },


  getData() {
    missHome().then(res => [
      this.setData({
        list: res.data
      })
    ])
  },

  go(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },
})
