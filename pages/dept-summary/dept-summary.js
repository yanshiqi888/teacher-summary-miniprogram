Page({
  data: {
    lengthOptions: ['简短版 (500-800字)', '标准版 (1000-1500字)', '详细版 (2000字以上)'],
    styleOptions: ['传统公文体', '朴实务实', '简洁明快', '生动活泼'],
    lengthIndex: 1,
    styleIndex: 0,
    formData: {
      deptName: '',
      semester: '',
      length: '标准版',
      style: '传统公文体',
      keyEvents: '',
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
    const index = e.detail.value
    const length = this.data.lengthOptions[index].split(' ')[0]
    this.setData({
      lengthIndex: index,
      'formData.length': length
    })
  },

  onStyleChange(e) {
    const index = e.detail.value
    this.setData({
      styleIndex: index,
      'formData.style': this.data.styleOptions[index]
    })
  },

  onKeyEventsChange(e) {
    this.setData({
      'formData.keyEvents': e.detail.value
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

  async generateSummary() {
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

    try {
      const res = await wx.cloud.callFunction({
        name: 'generateText',
        data: {
          type: 'dept-summary',
          formData: this.data.formData
        }
      })

      wx.hideLoading()

      if (res.result.success) {
        wx.navigateTo({
          url: '/pages/preview/preview?type=dept-summary&content=' + encodeURIComponent(res.result.content)
        })
      } else {
        throw new Error(res.result.error)
      }
    } catch (error) {
      console.error('生成失败:', error)
      wx.hideLoading()
      wx.showModal({
        title: '生成失败',
        content: error.message || '请稍后重试',
        showCancel: false
      })
    }
  }
})
