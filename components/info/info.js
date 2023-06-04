import {
  uploadImage
} from '../../api/index'

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    avatarUrl: defaultAvatarUrl,
    nickname: null
  },
  methods: {
    close: function () {
      this.setData({
        show: false
      })
    },

    setState: function (e) {
      this.setData({
        [e.currentTarget.dataset.name]: e.detail.value
      })
    },

    onChooseAvatar: function (e) {
      const {
        avatarUrl
      } = e.detail
      this.setData({
        avatarUrl,
      })
    },

    queding: function () {
      if (!this.data.nickname) {
        wx.showToast({
          icon: "none",
          title: '请输入昵称',
        })
        return
      }
      if (this.data.avatarUrl === defaultAvatarUrl) {
        wx.showToast({
          icon: "none",
          title: '请上传头像',
        })
        return
      }
      wx.getFileSystemManager().readFile({
        filePath: this.data.avatarUrl,
        encoding: 'base64',
        success: e => {
          uploadImage({
            avatar: 'data:image/png;base64,' + e.data
          }).then(res => {
            wx.setStorageSync('userInfo', {
              avatarUrl: res.data.path,
              nickname: this.data.nickname
            })
            wx.navigateTo({
              url: '/pages/login/login',
            })
          })
        }
      })
    }
  }
})
