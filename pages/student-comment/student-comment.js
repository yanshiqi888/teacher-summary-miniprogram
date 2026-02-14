Page({
  data: {
    count: 50,
    comments: []
  },

  onCountChange(e) {
    this.setData({
      count: e.detail.value
    })
  },

  async generateComments() {
    const count = parseInt(this.data.count)
    
    if (!count || count < 1) {
      wx.showToast({
        title: '请输入有效数量',
        icon: 'none'
      })
      return
    }

    if (count > 100) {
      wx.showToast({
        title: '单次最多生成100条',
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
          type: 'student-comment',
          formData: { count }
        }
      })
      
      if (res.result.success) {
        // 将生成的文本按换行符分割成数组
        const comments = res.result.content.split('\n').filter(c => c.trim())
        this.setData({ comments })
        
        wx.hideLoading()
        wx.showToast({
          title: '生成成功',
          icon: 'success'
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
  },

  generateMockComment() {
    const templates = [
      '该生学习态度端正，上课能够认真听讲，积极思考问题。作业完成情况良好，书写工整。尊敬师长，团结同学，遵守班级纪律。希望继续保持良好的学习习惯，不断提升自己，争取更大进步。',
      '该生本学期表现良好，能够按时完成各项学习任务。课堂上注意力集中，思维较为活跃。在集体活动中表现积极，有较强的集体荣誉感。建议今后更加主动，多向老师和同学请教，全面发展。',
      '该生尊敬师长，与同学相处融洽。学习较为认真，作业完成及时。课堂表现有所进步，发言次数增多。希望下学期能够更加严格要求自己，注重知识的巩固，相信会取得更好的成绩。',
      '该生性格开朗，乐于助人，在班级中人缘很好。学习上有一定的自觉性，能够独立完成作业。参加班级活动积极主动，为班级建设做出了贡献。希望在学习上更加刻苦，追求卓越。',
      '该生遵守校规校纪，尊重师长。学习态度认真，上课专心听讲。作业完成质量较高，有良好的学习习惯。希望今后能够更加自信，积极参与课堂讨论，展现自己的才华。'
    ]
    
    return templates[Math.floor(Math.random() * templates.length)]
  },

  copyComment(e) {
    const index = e.currentTarget.dataset.index
    const comment = this.data.comments[index]
    
    wx.setClipboardData({
      data: comment,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
      }
    })
  },

  async regenerateComment(e) {
    const index = e.currentTarget.dataset.index
    const comments = this.data.comments
    
    wx.showLoading({
      title: '重新生成中...'
    })

    try {
      const res = await wx.cloud.callFunction({
        name: 'generateText',
        data: {
          type: 'student-comment',
          formData: { count: 1 }
        }
      })
      
      if (res.result.success) {
        const newComment = res.result.content.split('\n').filter(c => c.trim())[0]
        comments[index] = newComment
        this.setData({ comments })
        
        wx.hideLoading()
        wx.showToast({
          title: '已重新生成',
          icon: 'success'
        })
      } else {
        throw new Error(res.result.error)
      }
    } catch (error) {
      console.error('重新生成失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      })
    }
  },

  async exportExcel() {
    if (this.data.comments.length === 0) {
      wx.showToast({
        title: '没有可导出的内容',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '生成中...'
    })

    try {
      const res = await wx.cloud.callFunction({
        name: 'exportExcel',
        data: {
          comments: this.data.comments
        }
      })

      wx.hideLoading()

      if (res.result.success) {
        wx.showModal({
          title: '导出成功',
          content: '文件已生成，点击确定下载',
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.downloadFile({
                url: res.result.tempFileURL,
                success: (downloadRes) => {
                  wx.openDocument({
                    filePath: downloadRes.tempFilePath,
                    fileType: 'xls',
                    success: () => {
                      wx.showToast({
                        title: '打开成功',
                        icon: 'success'
                      })
                    }
                  })
                }
              })
            }
          }
        })
      } else {
        throw new Error(res.result.error)
      }
    } catch (error) {
      console.error('导出失败:', error)
      wx.hideLoading()
      wx.showModal({
        title: '导出失败',
        content: error.message || '请稍后重试',
        showCancel: false
      })
    }
  },

  exportText() {
    const text = this.data.comments.map((comment, index) => {
      return `${index + 1}. ${comment}\n`
    }).join('\n')
    
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制全部评语',
          icon: 'success'
        })
      }
    })
  }
})
