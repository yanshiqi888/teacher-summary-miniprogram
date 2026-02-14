App({
  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-9grwj3zo5b7357bd',
        traceUser: true
      })
    }
    
    // 初始化本地存储
    if (!wx.getStorageSync('historyList')) {
      wx.setStorageSync('historyList', [])
    }
  },
  
  globalData: {
    userInfo: null
  }
})
