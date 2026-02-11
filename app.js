App({
  onLaunch() {
    // 初始化本地存储
    if (!wx.getStorageSync('historyList')) {
      wx.setStorageSync('historyList', [])
    }
  },
  
  globalData: {
    userInfo: null
  }
})
