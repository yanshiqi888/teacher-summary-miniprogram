Page({
  data: {
    formData: {
      teacherName: '',
      className: '',
      semester: '',
      studentCount: '',
      achievements: '',
      activities: '',
      problems: '',
      improvements: ''
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
    
    // 验证必填项
    if (!formData.teacherName || !formData.className || !formData.semester) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '生成中...' })

    // 模拟生成延迟
    setTimeout(() => {
      const summary = this.generateMockSummary(formData)
      
      // 保存到历史记录
      this.saveToHistory({
        type: 'class-summary',
        typeName: '班主任工作总结',
        formData: formData,
        content: summary,
        createTime: new Date().getTime()
      })

      wx.hideLoading()
      
      // 跳转到预览页面
      wx.navigateTo({
        url: `/pages/preview/preview?type=class-summary&content=${encodeURIComponent(summary)}`
      })
    }, 1000)
  },

  generateMockSummary(data) {
    return `${data.semester}${data.className}班主任工作总结

一、基本情况
本学期我担任${data.className}班主任工作，班级共有学生${data.studentCount || '若干'}名。在学校领导的关心和支持下，在各位任课教师的配合下，我认真履行班主任职责，圆满完成了本学期的各项工作任务。

二、主要工作成绩
${data.achievements || '本学期班级整体表现良好，学生学习积极性较高，班级凝聚力不断增强。'}

三、开展的主要活动
${data.activities || '组织了多次班级活动，包括主题班会、文体活动等，丰富了学生的课余生活，增强了班级凝聚力。'}

四、存在的问题
${data.problems || '部分学生学习主动性有待提高，个别学生行为习惯需要进一步规范。'}

五、改进措施
${data.improvements || '下学期将继续加强班级管理，注重学生个性化教育，提高班级整体素质。'}

六、总结
本学期的班主任工作虽然取得了一定成绩，但也存在不足。在今后的工作中，我将继续努力，不断提高班级管理水平，为学生的全面发展创造更好的条件。

班主任：${data.teacherName}
日期：${new Date().toLocaleDateString('zh-CN')}`
  },

  saveToHistory(record) {
    let historyList = wx.getStorageSync('historyList') || []
    historyList.unshift(record)
    wx.setStorageSync('historyList', historyList)
  }
})
