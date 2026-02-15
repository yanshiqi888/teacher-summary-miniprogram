Page({
  data: {
    content: '',
    submitted: false
  },

  onContentChange(e) {
    this.setData({
      content: e.detail.value
    })
  },

  async submitFeedback() {
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

    try {
      const res = await wx.cloud.callFunction({
        name: 'sendEmail',
        data: {
          content: this.data.content.trim()
        }
      })

      wx.hideLoading()

      if (res.result.success) {
        this.setData({
          submitted: true
        })
      } else {
        throw new Error(res.result.error)
      }
    } catch (error) {
      console.error('提交失败:', error)
      wx.hideLoading()
      wx.showModal({
        title: '提交失败',
        content: '网络异常，请稍后重试',
        showCancel: false
      })
    }
  },

  goBack() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
