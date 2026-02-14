const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { comments } = event
  
  try {
    // 生成简单的 CSV 格式（Excel 可以打开）
    let csvContent = '\uFEFF序号,评语\n' // \uFEFF 是 BOM，让 Excel 正确识别 UTF-8
    
    comments.forEach((comment, index) => {
      // 转义双引号，并用双引号包裹内容
      const escapedComment = comment.replace(/"/g, '""')
      csvContent += `${index + 1},"${escapedComment}"\n`
    })
    
    // 上传到云存储
    const fileName = `student-comments-${Date.now()}.csv`
    const result = await cloud.uploadFile({
      cloudPath: `exports/${fileName}`,
      fileContent: Buffer.from(csvContent, 'utf8')
    })
    
    // 获取临时下载链接
    const tempFileURL = await cloud.getTempFileURL({
      fileList: [result.fileID]
    })
    
    return {
      success: true,
      fileID: result.fileID,
      tempFileURL: tempFileURL.fileList[0].tempFileURL
    }
    
  } catch (error) {
    console.error('导出失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
