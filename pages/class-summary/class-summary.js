Page({
  data: {
    lengthOptions: ['简短版 (800-1200字)', '标准版 (1500-2000字)', '详细版 (2500字以上)'],
    styleOptions: ['传统公文体', '朴实务实', '简洁明快', '生动活泼'],
    lengthIndex: 1,
    styleIndex: 0,
    formData: {
      className: '',
      studentCount: '',
      semester: '',
      length: '标准版',
      style: '传统公文体',
      management: '',
      moralEducation: '',
      studyGuidance: '',
      activities: '',
      parentCommunication: '',
      individualEducation: '',
      classSpirit: '',
      problems: '',
      additional: ''
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

  onManagementChange(e) {
    this.setData({
      'formData.management': e.detail.value
    })
  },

  onMoralEducationChange(e) {
    this.setData({
      'formData.moralEducation': e.detail.value
    })
  },

  onStudyGuidanceChange(e) {
    this.setData({
      'formData.studyGuidance': e.detail.value
    })
  },

  onActivitiesChange(e) {
    this.setData({
      'formData.activities': e.detail.value
    })
  },

  onParentCommunicationChange(e) {
    this.setData({
      'formData.parentCommunication': e.detail.value
    })
  },

  onIndividualEducationChange(e) {
    this.setData({
      'formData.individualEducation': e.detail.value
    })
  },

  onClassSpiritChange(e) {
    this.setData({
      'formData.classSpirit': e.detail.value
    })
  },

  onProblemsChange(e) {
    this.setData({
      'formData.problems': e.detail.value
    })
  },

  onAdditionalChange(e) {
    this.setData({
      'formData.additional': e.detail.value
    })
  },

  async generateSummary() {
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

    try {
      const res = await wx.cloud.callFunction({
        name: 'generateText',
        data: {
          type: 'class-summary',
          formData: this.data.formData
        }
      })

      wx.hideLoading()

      if (res.result.success) {
        wx.navigateTo({
          url: '/pages/preview/preview?type=class-summary&content=' + encodeURIComponent(res.result.content)
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
