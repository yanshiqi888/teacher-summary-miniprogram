Page({
  data: {
    content: '',
    type: ''
  },

  onLoad(options) {
    const content = decodeURIComponent(options.content || '')
    const type = options.type || ''
    
    this.setData({
      content,
      type
    })
  },

  copyContent() {
    wx.setClipboardData({
      data: this.data.content,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    })
  },

  exportWord() {
    wx.showModal({
      title: '导出功能',
      content: '导出 Word 功能需要后端支持。\n\n当前为 Mock 版本，您可以：\n1. 点击"复制内容"按钮\n2. 粘贴到 Word 文档中\n3. 手动保存\n\n或者联系开发者接入真实导出功能。',
      showCancel: false,
      confirmText: '我知道了'
    })
    
    // TODO: 实际项目中需要调用后端接口生成 Word 文档
    // 可以使用 docxtemplater 或其他库在服务端生成
    // 然后返回下载链接给小程序
  }
})
