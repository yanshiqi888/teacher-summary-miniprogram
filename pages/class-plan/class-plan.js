Page({
  data: {
    lengthOptions: ['简短版 (500-800字)', '标准版 (1000-1500字)', '详细版 (2000字以上)'],
    styleOptions: ['传统公文体', '朴实务实', '简洁明快', '生动活泼'],
    lengthIndex: 1,
    styleIndex: 0,
    formData: {
      className: '',
      studentCount: '',
      semester: '',
      management: '',
      moral: '',
      study: '',
      activities: '',
      homeSchool: '',
      individual: '',
      atmosphere: '',
      goals: '',
      extra: ''
    }
  },

  onClassNameChange(e) {
    this.setData({
      'formData.className': e.detail.value
    })
  },

  onStudentCountChange(e) {
    this.setData({
      'formData.studentCount': e.detail.value
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

  onManagementChange(e) {
    this.setData({
      'formData.management': e.detail.value
    })
  },

  onMoralChange(e) {
    this.setData({
      'formData.moral': e.detail.value
    })
  },

  onStudyChange(e) {
    this.setData({
      'formData.study': e.detail.value
    })
  },

  onActivitiesChange(e) {
    this.setData({
      'formData.activities': e.detail.value
    })
  },

  onHomeSchoolChange(e) {
    this.setData({
      'formData.homeSchool': e.detail.value
    })
  },

  onIndividualChange(e) {
    this.setData({
      'formData.individual': e.detail.value
    })
  },

  onAtmosphereChange(e) {
    this.setData({
      'formData.atmosphere': e.detail.value
    })
  },

  onGoalsChange(e) {
    this.setData({
      'formData.goals': e.detail.value
    })
  },

  onExtraChange(e) {
    this.setData({
      'formData.extra': e.detail.value
    })
  },

  generatePlan() {
    const { className, studentCount, semester } = this.data.formData

    if (!className || !studentCount || !semester) {
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
        url: '/pages/preview/preview?type=class-plan'
      })
    }, 2000)
  }
})
