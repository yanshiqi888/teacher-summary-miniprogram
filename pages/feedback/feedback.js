Page({
  data: {
    content: '',
    contact: '',
    submitted: false
  },

  onContentChange(e) {
    this.setData({
      content: e.detail.value
    })
  },

  onContactChange(e) {
    this.setData({
      contact: e.detail.value
    })
  },

  submitFeedback() {
    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '提交中...'
    })

    // TODO: 调用云函数发送邮件
    // 目前使用 Mock
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        submitted: true
      })
    }, 1000)
  },

  goBack() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
