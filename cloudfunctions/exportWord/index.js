const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { content, title } = event
  
  try {
    // 生成简单的 RTF 格式（Word 可以打开）
    // RTF 格式支持中文和基本格式
    let rtfContent = '{\\rtf1\\ansi\\ansicpg936\\deff0{\\fonttbl{\\f0\\fnil\\fcharset134 SimSun;}}\n'
    rtfContent += '\\viewkind4\\uc1\\pard\\lang2052\\f0\\fs24\n'
    
    // 添加标题（如果有）
    if (title) {
      rtfContent += '\\b\\fs32 ' + escapeRTF(title) + '\\b0\\fs24\\par\\par\n'
    }
    
    // 添加正文，处理换行
    const lines = content.split('\n')
    lines.forEach(line => {
      if (line.trim()) {
        rtfContent += '\\pard\\fi720 ' + escapeRTF(line) + '\\par\n'
      } else {
        rtfContent += '\\par\n'
      }
    })
    
    rtfContent += '}'
    
    // 上传到云存储
    const fileName = `document-${Date.now()}.rtf`
    const result = await cloud.uploadFile({
      cloudPath: `exports/${fileName}`,
      fileContent: Buffer.from(rtfContent, 'utf8')
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

function escapeRTF(text) {
  // RTF 特殊字符转义
  return text
    .replace(/\\/g, '\\\\')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      // 中文字符用 Unicode 编码
      if (code > 127) {
        return '\\u' + code + '?'
      }
      return char
    })
    .join('')
}
