const cloud = require('wx-server-sdk')
const tencentcloud = require('tencentcloud-sdk-nodejs')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const HunyuanClient = tencentcloud.hunyuan.v20230901.Client

exports.main = async (event, context) => {
  const { type, formData } = event
  
  try {
    const prompt = generatePrompt(type, formData)
    
    const client = new HunyuanClient({
      credential: {
        secretId: process.env.TENCENT_SECRET_ID,
        secretKey: process.env.TENCENT_SECRET_KEY,
      },
      region: "ap-guangzhou",
      profile: {
        httpProfile: {
          endpoint: "hunyuan.tencentcloudapi.com",
        },
      },
    })
    
    const params = {
      Model: "hunyuan-lite",
      Messages: [
        {
          Role: "user",
          Content: prompt
        }
      ],
      Stream: false
    }
    
    const response = await client.ChatCompletions(params)
    const content = response.Choices[0].Message.Content
    
    return {
      success: true,
      content: content
    }
    
  } catch (error) {
    console.error('error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

function generatePrompt(type, formData) {
  if (type === 'student-comment') {
    return generateStudentCommentPrompt(formData)
  }
  if (type === 'dept-summary') {
    return generateDeptSummaryPrompt(formData)
  }
  if (type === 'dept-plan') {
    return generateDeptPlanPrompt(formData)
  }
  if (type === 'class-summary') {
    return generateClassSummaryPrompt(formData)
  }
  if (type === 'class-plan') {
    return generateClassPlanPrompt(formData)
  }
  return ''
}

function generateStudentCommentPrompt(formData) {
  const text = `你是一位经验丰富的中学教师，需要为学生写期末评语。

严格要求：
1. 每条评语必须以"该生"两个字开头，不能用"该同学"或其他开头
2. 每条评语约100-120字，必须是完整的一段话，不能有段内换行
3. 每条评语必须完全不同，不能有相似的句式或表达
4. 从多个不同角度描述：
   - 学习态度和方法
   - 课堂表现和参与度
   - 作业完成情况
   - 品德修养和行为习惯
   - 人际交往和团队合作
   - 特长发展和兴趣爱好
   - 进步空间和努力方向
5. 使用多样化的句式结构，避免套路化
6. 语气温和鼓励，像真实老师手写的评语
7. 内容通用，不涉及具体学生姓名或特征

输出格式要求：
- 必须生成恰好${formData.count}条评语
- 每条评语单独一行
- 评语之间用换行符分隔
- 每条评语内部不能有换行
- 不要添加序号、标题或其他额外内容

请严格按照要求生成${formData.count}条完全不同的学生评语。`
  return text
}

function generateDeptSummaryPrompt(formData) {
  const deptName = formData.deptName || ''
  const semester = formData.semester || ''
  const length = formData.length || ''
  const style = formData.style || ''
  const keyEvents = formData.keyEvents || ''
  const achievements = formData.achievements || ''
  const problems = formData.problems || ''
  const suggestions = formData.suggestions || ''
  
  let styleGuide = ''
  if (style === '传统公文体') {
    styleGuide = '使用规范的公文语言 结构严谨 用词正式'
  } else if (style === '朴实务实') {
    styleGuide = '语言朴实 重点突出实际工作 少用修饰词'
  } else if (style === '简洁明快') {
    styleGuide = '语言简练 条理清晰 直接表达要点'
  } else if (style === '生动活泼') {
    styleGuide = '语言生动 适当使用比喻 增强可读性'
  }
  
  let lengthGuide = ''
  if (length === '简短版') {
    lengthGuide = '500-800字'
  } else if (length === '标准版') {
    lengthGuide = '1000-1500字'
  } else {
    lengthGuide = '2000字以上'
  }
  
  let prompt = "你是一位经验丰富的教研组长 需要撰写" + semester + "的" + deptName + "工作总结 基本信息 科室" + deptName + " 学期" + semester + " 长度" + lengthGuide + " 风格" + styleGuide + " "
  
  if (keyEvents) {
    prompt += "关键事件 " + keyEvents + " "
  }
  if (achievements) {
    prompt += "取得成绩 " + achievements + " "
  }
  if (problems) {
    prompt += "存在问题 " + problems + " "
  }
  if (suggestions) {
    prompt += "改进建议 " + suggestions + " "
  }
  
  prompt += "要求 结构完整包含工作回顾主要成绩存在问题改进方向 内容充实将用户提供的简要信息扩展成完整描述 语言自然避免AI痕迹像真实教师撰写 符合风格严格按照" + style + "的要求写作 字数控制" + lengthGuide + " 请直接输出工作总结正文 不要包含标题"
  
  return prompt
}

function generateDeptPlanPrompt(formData) {
  const deptName = formData.deptName || ''
  const semester = formData.semester || ''
  const length = formData.length || ''
  const style = formData.style || ''
  const activities = formData.activities || ''
  const goals = formData.goals || ''
  const measures = formData.measures || ''
  const schedule = formData.schedule || ''
  
  let styleGuide = ''
  if (style === '传统公文体') {
    styleGuide = '使用规范的公文语言 结构严谨 用词正式'
  } else if (style === '朴实务实') {
    styleGuide = '语言朴实 重点突出实际工作 少用修饰词'
  } else if (style === '简洁明快') {
    styleGuide = '语言简练 条理清晰 直接表达要点'
  } else if (style === '生动活泼') {
    styleGuide = '语言生动 适当使用比喻 增强可读性'
  }
  
  let lengthGuide = ''
  if (length === '简短版') {
    lengthGuide = '500-800字'
  } else if (length === '标准版') {
    lengthGuide = '1000-1500字'
  } else {
    lengthGuide = '2000字以上'
  }
  
  let prompt = "你是一位经验丰富的教研组长 需要撰写" + semester + "的" + deptName + "工作计划 基本信息 科室" + deptName + " 学期" + semester + " 长度" + lengthGuide + " 风格" + styleGuide + " "
  
  if (activities) {
    prompt += "计划活动 " + activities + " "
  }
  if (goals) {
    prompt += "工作目标 " + goals + " "
  }
  if (measures) {
    prompt += "具体措施 " + measures + " "
  }
  if (schedule) {
    prompt += "时间安排 " + schedule + " "
  }
  
  prompt += "要求 结构完整包含指导思想工作目标主要措施时间安排 内容充实将用户提供的简要信息扩展成完整描述 语言自然避免AI痕迹像真实教师撰写 符合风格严格按照" + style + "的要求写作 字数控制" + lengthGuide + " 请直接输出工作计划正文 不要包含标题"
  
  return prompt
}

function generateClassSummaryPrompt(formData) {
  const className = formData.className || ''
  const studentCount = formData.studentCount || ''
  const semester = formData.semester || ''
  const length = formData.length || ''
  const style = formData.style || ''
  const management = formData.management || ''
  const moralEducation = formData.moralEducation || ''
  const studyGuidance = formData.studyGuidance || ''
  const activities = formData.activities || ''
  const parentCommunication = formData.parentCommunication || ''
  const individualEducation = formData.individualEducation || ''
  const classSpirit = formData.classSpirit || ''
  const problems = formData.problems || ''
  const additional = formData.additional || ''
  
  let styleGuide = ''
  if (style === '传统公文体') {
    styleGuide = '使用规范的公文语言 结构严谨 用词正式'
  } else if (style === '朴实务实') {
    styleGuide = '语言朴实 重点突出实际工作 少用修饰词'
  } else if (style === '简洁明快') {
    styleGuide = '语言简练 条理清晰 直接表达要点'
  } else if (style === '生动活泼') {
    styleGuide = '语言生动 适当使用比喻 增强可读性'
  }
  
  let lengthGuide = ''
  if (length === '简短版') {
    lengthGuide = '800-1200字'
  } else if (length === '标准版') {
    lengthGuide = '1500-2000字'
  } else {
    lengthGuide = '2500字以上'
  }
  
  let prompt = "你是一位经验丰富的班主任 需要撰写" + semester + "的" + className + "班主任工作总结 基本信息 班级" + className + " 学生人数" + studentCount + "人 学期" + semester + " 长度" + lengthGuide + " 风格" + styleGuide + " 工作内容 "
  
  if (management) {
    prompt += "班级管理" + management + " "
  }
  if (moralEducation) {
    prompt += "德育工作" + moralEducation + " "
  }
  if (studyGuidance) {
    prompt += "学习指导" + studyGuidance + " "
  }
  if (activities) {
    prompt += "活动组织" + activities + " "
  }
  if (parentCommunication) {
    prompt += "家校沟通" + parentCommunication + " "
  }
  if (individualEducation) {
    prompt += "个别教育" + individualEducation + " "
  }
  if (classSpirit) {
    prompt += "班风学风" + classSpirit + " "
  }
  if (problems) {
    prompt += "存在问题" + problems + " "
  }
  if (additional) {
    prompt += "补充说明" + additional + " "
  }
  
  prompt += "要求 结构完整涵盖班级管理德育学习活动等各方面 内容充实将用户提供的简要信息扩展成完整描述 语言自然避免AI痕迹像真实班主任撰写 符合风格严格按照" + style + "的要求写作 字数控制" + lengthGuide + " 请直接输出工作总结正文 不要包含标题"
  
  return prompt
}

function generateClassPlanPrompt(formData) {
  const className = formData.className || ''
  const studentCount = formData.studentCount || ''
  const semester = formData.semester || ''
  const length = formData.length || ''
  const style = formData.style || ''
  const management = formData.management || ''
  const moralEducation = formData.moralEducation || ''
  const studyGuidance = formData.studyGuidance || ''
  const activities = formData.activities || ''
  const parentCommunication = formData.parentCommunication || ''
  const individualEducation = formData.individualEducation || ''
  const classSpirit = formData.classSpirit || ''
  const goals = formData.goals || ''
  const additional = formData.additional || ''
  
  let styleGuide = ''
  if (style === '传统公文体') {
    styleGuide = '使用规范的公文语言 结构严谨 用词正式'
  } else if (style === '朴实务实') {
    styleGuide = '语言朴实 重点突出实际工作 少用修饰词'
  } else if (style === '简洁明快') {
    styleGuide = '语言简练 条理清晰 直接表达要点'
  } else if (style === '生动活泼') {
    styleGuide = '语言生动 适当使用比喻 增强可读性'
  }
  
  let lengthGuide = ''
  if (length === '简短版') {
    lengthGuide = '800-1200字'
  } else if (length === '标准版') {
    lengthGuide = '1500-2000字'
  } else {
    lengthGuide = '2500字以上'
  }
  
  let prompt = "你是一位经验丰富的班主任 需要撰写" + semester + "的" + className + "班主任工作计划 基本信息 班级" + className + " 学生人数" + studentCount + "人 学期" + semester + " 长度" + lengthGuide + " 风格" + styleGuide + " 计划内容 "
  
  if (management) {
    prompt += "班级管理计划" + management + " "
  }
  if (moralEducation) {
    prompt += "德育工作计划" + moralEducation + " "
  }
  if (studyGuidance) {
    prompt += "学习指导计划" + studyGuidance + " "
  }
  if (activities) {
    prompt += "活动计划" + activities + " "
  }
  if (parentCommunication) {
    prompt += "家校沟通计划" + parentCommunication + " "
  }
  if (individualEducation) {
    prompt += "个别教育计划" + individualEducation + " "
  }
  if (classSpirit) {
    prompt += "班风学风建设计划" + classSpirit + " "
  }
  if (goals) {
    prompt += "工作目标" + goals + " "
  }
  if (additional) {
    prompt += "补充说明" + additional + " "
  }
  
  prompt += "要求 结构完整涵盖班级管理德育学习活动等各方面计划 内容充实将用户提供的简要信息扩展成完整描述 语言自然避免AI痕迹像真实班主任撰写 符合风格严格按照" + style + "的要求写作 字数控制" + lengthGuide + " 请直接输出工作计划正文 不要包含标题"
  
  return prompt
}
