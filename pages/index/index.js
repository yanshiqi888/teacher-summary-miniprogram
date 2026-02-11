Page({
  data: {},

  goToStudentComment() {
    wx.navigateTo({
      url: '/pages/student-comment/student-comment'
    })
  },

  goToClassSummary() {
    wx.navigateTo({
      url: '/pages/class-summary/class-summary'
    })
  },

  goToClassPlan() {
    wx.navigateTo({
      url: '/pages/class-plan/class-plan'
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
  },

  goToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  }
})
