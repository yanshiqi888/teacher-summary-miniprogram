Page({
  data: {
    lengthOptions: ['简短版 (500-800字)', '标准版 (1000-1500字)', '详细版 (2000字以上)'],
    styleOptions: ['传统公文体', '朴实务实', '简洁明快', '生动活泼'],
    lengthIndex: 1,
    styleIndex: 0,
    formData: {
      deptName: '',
      semester: '',
      events: '',
      achievements: '',
      problems: '',
      suggestions: ''
    }
  },

  onDeptNameChange(e) {
    this.setData({
      'formData.deptName': e.detail.value
    })
  },

  onSemesterChange(e) {
    this.setData({
      'formData.semester': e.detail.value
    })
  },

  onLengthChange(e) {
    this.setData({
      lengthIndex: e.detail.value
    })
  },

  onStyleChange(e) {
    this.setData({
      styleIndex: e.detail.value
    })
  },

  onEventsChange(e) {
    this.setData({
      'formData.events': e.detail.value
    })
  },

  onAchievementsChange(e) {
    this.setData({
      'formData.achievements': e.detail.value
    })
  },

  onProblemsChange(e) {
    this.setData({
      'formData.problems': e.detail.value
    })
  },

  onSuggestionsChange(e) {
    this.setData({
      'formData.suggestions': e.detail.value
    })
  },

  generateSummary() {
    const { deptName, semester } = this.data.formData

    if (!deptName || !semester) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '生成中...'
    })

    // TODO: 调用云函数生成总结
    setTimeout(() => {
      wx.hideLoading()
      wx.navigateTo({
        url: '/pages/preview/preview?type=dept-summary'
      })
    }, 2000)
  }
})
