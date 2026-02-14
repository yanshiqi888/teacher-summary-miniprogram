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

  async exportWord() {
    if (!this.data.content) {
      wx.showToast({
        title: '没有可导出的内容',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '生成中...'
    })

    try {
      // 根据类型生成标题
      let title = ''
      if (this.data.type === 'dept-summary') {
        title = '科室工作总结'
      } else if (this.data.type === 'dept-plan') {
        title = '科室工作计划'
      } else if (this.data.type === 'class-summary') {
        title = '班主任工作总结'
      } else if (this.data.type === 'class-plan') {
        title = '班主任工作计划'
      }

      const res = await wx.cloud.callFunction({
        name: 'exportWord',
        data: {
          content: this.data.content,
          title: title
        }
      })

      wx.hideLoading()

      if (res.result.success) {
        wx.showModal({
          title: '导出成功',
          content: '文件已生成，点击确定下载',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.downloadFile({
                url: res.result.tempFileURL,
                success: (downloadRes) => {
                  wx.openDocument({
                    filePath: downloadRes.tempFilePath,
                    fileType: 'doc',
                    success: () => {
                      wx.showToast({
                        title: '打开成功',
                        icon: 'success'
                      })
                    }
                  })
                }
              })
            }
          }
        })
      } else {
        throw new Error(res.result.error)
      }
    } catch (error) {
      console.error('导出失败:', error)
      wx.hideLoading()
      wx.showModal({
        title: '导出失败',
        content: error.message || '请稍后重试',
        showCancel: false
      })
    }
  }
})
