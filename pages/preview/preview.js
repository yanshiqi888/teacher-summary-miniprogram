Page({
  data: {
    type: '',
    content: ''
  },

  onLoad(options) {
    const { type, content } = options
    this.setData({
      type,
      content: decodeURIComponent(content || '')
    })
  },

  copyContent() {
    wx.setClipboardData({
      data: this.data.content,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
      }
    })
  },

  exportWord() {
    wx.showToast({
      title: '导出功能开发中',
      icon: 'none'
    })
    // TODO: 实现 Word 导出功能
  }
})
