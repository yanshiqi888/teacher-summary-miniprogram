Page({
  data: {
    formData: {
      deptName: '',
      leaderName: '',
      semester: '',
      memberCount: '',
      mainWork: '',
      achievements: '',
      problems: '',
      suggestions: ''
    }
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  generateSummary() {
    const { formData } = this.data
    
    if (!formData.deptName || !formData.leaderName || !formData.semester) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '生成中...' })

    setTimeout(() => {
      const summary = this.generateMockSummary(formData)
      
      this.saveToHistory({
        type: 'dept-summary',
        typeName: '科室工作总结',
        formData: formData,
        content: summary,
        createTime: new Date().getTime()
      })

      wx.hideLoading()
      
      wx.navigateTo({
        url: `/pages/preview/preview?type=dept-summary&content=${encodeURIComponent(summary)}`
      })
    }, 1000)
  },

  generateMockSummary(data) {
    return `${data.semester}${data.deptName}工作总结

一、基本情况
本学期${data.deptName}在学校领导的正确指导下，全体成员团结协作，认真履行职责，圆满完成了各项工作任务。科室现有成员${data.memberCount || '若干'}人。

二、主要工作内容
${data.mainWork || '本学期主要开展了教学研讨、课程建设、教师培训等工作，积极推进教育教学改革。'}

三、取得的成绩
${data.achievements || '在全体成员的共同努力下，科室工作取得了显著成效，得到了学校领导和师生的认可。'}

四、存在的问题
${data.problems || '工作中也存在一些不足，如工作创新力度不够，部分工作推进不够深入等。'}

五、改进建议
${data.suggestions || '下学期将进一步加强团队建设，创新工作方法，提高工作效率和质量。'}

六、总结
本学期的工作虽然取得了一定成绩，但仍有许多需要改进的地方。在今后的工作中，我们将继续努力，为学校的发展做出更大贡献。

科室负责人：${data.leaderName}
日期：${new Date().toLocaleDateString('zh-CN')}`
  },

  saveToHistory(record) {
    let historyList = wx.getStorageSync('historyList') || []
    historyList.unshift(record)
    wx.setStorageSync('historyList', historyList)
  }
})
