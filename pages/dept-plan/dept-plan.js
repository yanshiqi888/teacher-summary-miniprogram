Page({
  data: {
    formData: {
      deptName: '',
      leaderName: '',
      semester: '',
      goals: '',
      keyWork: '',
      measures: '',
      schedule: '',
      expectedResults: ''
    }
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  generatePlan() {
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
      const plan = this.generateMockPlan(formData)
      
      this.saveToHistory({
        type: 'dept-plan',
        typeName: '科室工作计划',
        formData: formData,
        content: plan,
        createTime: new Date().getTime()
      })

      wx.hideLoading()
      
      wx.navigateTo({
        url: `/pages/preview/preview?type=dept-plan&content=${encodeURIComponent(plan)}`
      })
    }, 1000)
  },

  generateMockPlan(data) {
    return `${data.semester}${data.deptName}工作计划

一、指导思想
在学校整体工作部署的指导下，${data.deptName}将继续坚持以教学为中心，以提高教育教学质量为目标，扎实推进各项工作。

二、工作目标
${data.goals || '提高教学质量，加强团队建设，推进教育教学改革，促进教师专业发展。'}

三、重点工作
${data.keyWork || '1. 加强教学研讨，提升教学水平\n2. 开展课题研究，推进教学改革\n3. 组织教师培训，促进专业成长\n4. 完善管理制度，提高工作效率'}

四、具体措施
${data.measures || '1. 定期组织教研活动，开展集体备课\n2. 鼓励教师参与课题研究和教学竞赛\n3. 邀请专家进行专题讲座和培训\n4. 建立健全各项规章制度，规范工作流程'}

五、时间安排
${data.schedule || '第一阶段（1-4周）：制定详细工作方案，启动各项工作\n第二阶段（5-12周）：全面推进各项工作，定期检查落实情况\n第三阶段（13-16周）：总结经验，完善工作，准备期末考核'}

六、预期成果
${data.expectedResults || '通过本学期的工作，预期在教学质量、教师发展、科研成果等方面取得明显进步，为学校的整体发展做出贡献。'}

七、保障措施
加强组织领导，明确责任分工，确保各项工作落到实处。建立监督机制，定期检查工作进展，及时解决存在的问题。

科室负责人：${data.leaderName}
日期：${new Date().toLocaleDateString('zh-CN')}`
  },

  saveToHistory(record) {
    let historyList = wx.getStorageSync('historyList') || []
    historyList.unshift(record)
    wx.setStorageSync('historyList', historyList)
  }
})
