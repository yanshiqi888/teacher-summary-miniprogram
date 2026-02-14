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
  switch(type) {
    case 'student-comment':
      return generateStudentCommentPrompt(formData)
    case 'dept-summary':
      return generateDeptSummaryPrompt(formData)
    case 'dept-plan':
      return generateDeptPlanPrompt(formData)
    case 'class-summary':
      return generateClassSummaryPrompt(formData)
    case 'class-plan':
      return generateClassPlanPrompt(formData)
    default:
      return ''
  }
}

function generateStudentCommentPrompt(formData) {
  const text = "你是一位经验丰富的中学教师, 需要为学生写期末评语. 要求: 每条评语约100字, 语气鼓励温和, 内容通用不涉及具体学生特征, 涵盖学习态度课堂表现作业完成品德表现等方面, 避免AI痕迹要像真实老师手写的评语, 每条评语必须完全不同不能有任何重复或相似的表达, 从不同角度描述有的侧重学习态度有的侧重课堂表现有的侧重品德有的侧重进步空间, 使用不同的句式结构和表达方式. 请生成 " + formData.count + " 条完全不同的学生评语, 每条评语用换行符分隔."
  return text
}

function generateDeptSummaryPrompt(formData) {
  const { deptName, semester, length, style, keyEvents, achievements, problems, suggestions } = formData
  
  let styleGuide = ''
  if (style === '传统公文体') {
    styleGuide = '使用规范的公文语言，结构严谨，用词正式'
  } else if (style === '朴实务实') {
    styleGuide = '语言朴实，重点突出实际工作，少用修饰词'
  } else if (style === '简洁明快') {
    styleGuide = '语言简练，条理清晰，直接表达要点'
  } else if (style === '生动活泼') {
    styleGuide = '语言生动，适当使用比喻，增强可读性'
  }
  
  let lengthGuide = ''
  if (length === '简短版') {
    lengthGuide = '500-800字'
  } else if (length === '标准版') {
    lengthGuide = '1000-1500字'
  } else {
    lengthGuide = '2000字以上'
  }
  
  let prompt = "你是一位经验丰富的教研组长，需要撰写" + semester + "的" + deptName + "工作总结. 基本信息: 科室" + deptName + ", 学期" + semester + ", 长度" + lengthGuide + ", 风格" + styleGuide + ". "
  
  if (keyEvents) prompt += "关键事件: " + keyEvents + ". "
  if (achievements) prompt += "取得成绩: " + achievements + ". "
  if (problems) prompt += "存在问题: " + problems + ". "
  if (suggestions) prompt += "改进建议: " + suggestions + ". "
  
  prompt += "要求: 结构完整包含工作回顾主要成绩存在问题改进方向, 内容充实将用户提供的简要信息扩展成完整描述, 语言自然避免AI痕迹像真实教师撰写, 符合风格严格按照" + style + "的要求写作, 字数控制" + lengthGuide + ". 请直接输出工作总结正文, 不要包含标题."
  
  return prompt
}

function generateDeptPlanPrompt(formData) {
  const { deptName, semester, length, style, activities, goals, measures, schedule } = formData
  
  let styleGuide = ''
  if (style === '传统公文体') {
    styleGuide = '使用规范的公文语言，结构严谨，用词正式'
  } else if (style === '朴实务实') {
    styleGuide = '语言朴实，重点突出实际工作，少用修饰词'
  } else if (style === '简洁明快') {
    styleGuide = '语言简练，条理清晰，直接表达要点'
  } else if (style === '生动活泼') {
    styleGuide = '语言生动，适当使用比喻，增强可读性'
  }
  
  let lengthGuide = ''
  if (length === '简短版') {
    lengthGuide = '500-800字'
  } else if (length === '标准版') {
    lengthGuide = '1000-1500字'
  } else {
    lengthGuide = '2000字以上'
  }
  
  let prompt = "你是一位经验丰富的教研组长，需要撰写" + semester + "的" + deptName + "工作计划. 基本信息: 科室" + deptName + ", 学期" + semester + ", 长度" + lengthGuide + ", 风格" + styleGuide + ". "
  
  if (activities) prompt += "计划活动: " + activities + ". "
  if (goals) prompt += "工作目标: " + goals + ". "
  if (measures) prompt += "具体措施: " + measures + ". "
  if (schedule) prompt += "时间安排: " + schedule + ". "
  
  prompt += "要求: 结构完整包含指导思想工作目标主要措施时间安排, 内容充实将用户提供的简要信息扩展成完整描述, 语言自然避免AI痕迹像真实教师撰写, 符合风格严格按照" + style + "的要求写作, 字数控制" + lengthGuide + ". 请直接输出工作计划正文, 不要包含标题."
  
  return prompt
}

function generateClassSummaryPrompt(formData) {
  const { className, studentCount, semester, length, style, management, moralEducation, studyGuidance, activities, parentCommunication, individualEducation, classSpirit, problems, additional } = formData
  
  let styleGuide = ''
  if (style === '传统公文体') {
    styleGuide = '使用规范的公文语言，结构严谨，用词正式'
  } else if (style === '朴实务实') {
    styleGuide = '语言朴实，重点突出实际工作，少用修饰词'
  } else if (style === '简洁明快') {
    styleGuide = '语言简练，条理清晰，直接表达要点'
  } else if (style === '生动活泼') {
    styleGuide = '语言生动，适当使用比喻，增强可读性'
  }
  
  let lengthGuide = ''
  if (length === '简短版') {
    lengthGuide = '800-1200字'
  } else if (length === '标准版') {
    lengthGuide = '1500-2000字'
  } else {
    lengthGuide = '2500字以上'
  }
  
  let prompt = "你是一位经验丰富的班主任，需要撰写" + semester + "的" + className + "班主任工作总结. 基本信息: 班级" + className + ", 学生人数" + studentCount + "人, 学期" + semester + ", 长度" + lengthGuide + ", 风格" + styleGuide + ". 工作内容: "
  
  if (management) prompt += "班级管理" + management + ", "
  if (moralEducation) prompt += "德育工作" + moralEducation + ", "
  if (studyGuidance) prompt += "学习指导" + studyGuidance + ", "
  if (activities) prompt += "活动组织" + activities + ", "
  if (parentCommunication) prompt += "家校沟通" + parentCommunication + ", "
  if (individualEducation) prompt += "个别教育" + individualEducation + ", "
  if (classSpirit) prompt += "班风学风" + classSpirit + ", "
  if (problems) prompt += "存在问题" + problems + ", "
  if (additional) prompt += "补充说明" + additional + ", "
  
  prompt += "要求: 结构完整涵盖班级管理德育学习活动等各方面, 内容充实将用户提供的简要信息扩展成完整描述, 语言自然避免AI痕迹像真实班主任撰写, 符合风格严格按照" + style + "的要求写作, 字数控制" + lengthGuide + ". 请直接输出工作总结正文, 不要包含标题."
  
  return prompt
}

function generateClassPlanPrompt(formData) {
  const { className, studentCount, semester, length, style, management, moralEducation, studyGuidance, activities, parentCommunication, individualEducation, classSpirit, goals, additional } = formData
  
  let styleGuide = ''
  if (style === '传统公文体') {
    styleGuide = '使用规范的公文语言，结构严谨，用词正式'
  } else if (style === '朴实务实') {
    styleGuide = '语言朴实，重点突出实际工作，少用修饰词'
  } else if (style === '简洁明快') {
    styleGuide = '语言简练，条理清晰，直接表达要点'
  } else if (style === '生动活泼') {
    styleGuide = '语言生动，适当使用比喻，增强可读性'
  }
  
  let lengthGuide = ''
  if (length === '简短版') {
    lengthGuide = '800-1200字'
  } else if (length === '标准版') {
    lengthGuide = '1500-2000字'
  } else {
    lengthGuide = '2500字以上'
  }
  
  let prompt = "你是一位经验丰富的班主任，需要撰写" + semester + "的" + className + "班主任工作计划. 基本信息: 班级" + className + ", 学生人数" + studentCount + "人, 学期" + semester + ", 长度" + lengthGuide + ", 风格" + styleGuide + ". 计划内容: "
  
  if (management) prompt += "班级管理计划" + management + ", "
  if (moralEducation) prompt += "德育工作计划" + moralEducation + ", "
  if (studyGuidance) prompt += "学习指导计划" + studyGuidance + ", "
  if (activities) prompt += "活动计划" + activities + ", "
  if (parentCommunication) prompt += "家校沟通计划" + parentCommunication + ", "
  if (individualEducation) prompt += "个别教育计划" + individualEducation + ", "
  if (classSpirit) prompt += "班风学风建设计划" + classSpirit + ", "
  if (goals) prompt += "工作目标" + goals + ", "
  if (additional) prompt += "补充说明" + additional + ", "
  
  prompt += "要求: 结构完整涵盖班级管理德育学习活动等各方面计划, 内容充实将用户提供的简要信息扩展成完整描述, 语言自然避免AI痕迹像真实班主任撰写, 符合风格严格按照" + style + "的要求写作, 字数控制" + lengthGuide + ". 请直接输出工作计划正文, 不要包含标题."
  
  return prompt
}
