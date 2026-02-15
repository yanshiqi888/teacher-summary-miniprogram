Page({
  data: {
    historyList: []
  },

  onShow() {
    this.loadHistory()
  },

  loadHistory() {
    const historyList = wx.getStorageSync('historyList') || []
    this.setData({ historyList })
  },

  viewDetail(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.historyList[index]
    
    wx.navigateTo({
      url: `/pages/preview/preview?type=${item.type}&content=${encodeURIComponent(item.content)}&fromHistory=true`
    })
  },

  copyContent(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.historyList[index]
    
    wx.setClipboardData({
      data: item.content,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        })
      }
    })
  },

  deleteItem(e) {
    const index = e.currentTarget.dataset.index
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          let historyList = this.data.historyList
          historyList.splice(index, 1)
          wx.setStorageSync('historyList', historyList)
          this.setData({ historyList })
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  },

  clearAll() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('historyList', [])
          this.setData({ historyList: [] })
          
          wx.showToast({
            title: '清空成功',
            icon: 'success'
          })
        }
      }
    })
  },

  formatTime(timestamp) {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
})
