Page({
  data: {},

  goToClassSummary() {
    wx.navigateTo({
      url: '/pages/class-summary/class-summary'
    })
  },

  goToDeptSummary() {
    wx.navigateTo({
      url: '/pages/dept-summary/dept-summary'
    })
  },

  goToDeptPlan() {
    wx.navigateTo({
      url: '/pages/dept-plan/dept-plan'
    })
  },

  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    })
  }
})
