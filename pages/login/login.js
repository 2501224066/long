// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    code1: null,
    code2: null
  },


  setState(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },

  ma() {

  },

  denglu() {

  },
})
