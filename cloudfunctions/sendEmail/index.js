const cloud = require('wx-server-sdk')
const nodemailer = require('nodemailer')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { content } = event
  
  try {
    // 创建邮件传输对象
    const transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: '15090900283@163.com',
        pass: process.env.EMAIL_AUTH_CODE // 邮箱授权码，需要在云函数环境变量中配置
      }
    })
    
    // 邮件内容
    const mailOptions = {
      from: '15090900283@163.com',
      to: '15090900283@163.com',
      subject: '【教师工作助手】用户反馈',
      html: `
        <h2>用户反馈</h2>
        <p><strong>反馈内容：</strong></p>
        <p>${content.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #999; font-size: 12px;">提交时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
      `
    }
    
    // 发送邮件
    await transporter.sendMail(mailOptions)
    
    return {
      success: true,
      message: '反馈已发送'
    }
    
  } catch (error) {
    console.error('发送邮件失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
