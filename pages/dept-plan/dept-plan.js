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
      activities: '',
      goals: '',
      measures: '',
      schedule: ''
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

  onActivitiesChange(e) {
    this.setData({
      'formData.activities': e.detail.value
    })
  },

  onGoalsChange(e) {
    this.setData({
      'formData.goals': e.detail.value
    })
  },

  onMeasuresChange(e) {
    this.setData({
      'formData.measures': e.detail.value
    })
  },

  onScheduleChange(e) {
    this.setData({
      'formData.schedule': e.detail.value
    })
  },

  generatePlan() {
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

    // TODO: 调用云函数生成计划
    setTimeout(() => {
      wx.hideLoading()
      wx.navigateTo({
        url: '/pages/preview/preview?type=dept-plan&data=' + JSON.stringify(this.data.formData)
      })
    }, 1500)
  }
})
