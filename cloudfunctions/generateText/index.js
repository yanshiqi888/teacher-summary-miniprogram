const cloud = require('wx-server-sdk')
const tencentcloud = require('tencentcloud-sdk-nodejs')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 腾讯混元 SDK
const HunyuanClient = tencentcloud.hunyuan.v20230901.Client

exports.main = async (event, context) => {
  const { type, formData } = event
  
  try {
    // 根据类型生成不同的提示词
    const prompt = generatePrompt(type, formData)
    
    // 调用腾讯混元 API
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
    console.error('生成失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 根据类型生成提示词
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

// 学生评语提示词
function generateStudentCommentPrompt(formData) {
  return `你是一位经验丰富的中学教师，需要为学生写期末评语。

要求：
- 每条评语约100字
- 语气鼓励、温和
- 内容通用，不涉及具体学生特征
- 涵盖学习态度、课堂表现、作业完成、品德表现等方面
- 避免AI痕迹，要像真实老师手写的评语
- **重要：每条评语必须完全不同，不能有任何重复或相似的表达**
- 从不同角度描述：有的侧重学习态度，有的侧重课堂表现，有的侧重品德，有的侧重进步空间
- 使用不同的句式结构和表达方式

请生成 ${formData.count} 条完全不同的学生评语，每条评语用换行符分隔。`
}

// 科室工作总结提示词
function generateDeptSummaryPrompt(formData) {
  const { deptName, semester, length, style, keyEvents, achievements, problems, suggestions } = formData
  
  let styleGuide = ''
  switch(style) {
    case '传统公文体':
      styleGuide = '使用规范的公文语言，结构严谨，用词正式'
      break
    case '朴实务实':
      styleGuide = '语言朴实，重点突出实际工作，少用修饰词'
      break
    case '简洁明快':
      styleGuide = '语言简练，条理清晰，直接表达要点'
      break
    case '生动活泼':
      styleGuide = '语言生动，适当使用比喻，增强可读性'
      break
  }
  
  let lengthGuide = ''
  if (length === '简短版') lengthGuide = '500-800字'
  else if (length === '标准版') lengthGuide = '1000-1500字'
  else lengthGuide = '2000字以上'
  
  return `你是一位经验丰富的教研组长，需要撰写${semester}的${deptName}工作总结。

基本信息：
- 科室：${deptName}
- 学期：${semester}
- 长度：${lengthGuide}
- 风格：${styleGuide}

${keyEvents ? `关键事件：\n${keyEvents}\n` : ''}
${achievements ? `取得成绩：\n${achievements}\n` : ''}
${problems ? `存在问题：\n${problems}\n` : ''}
${suggestions ? `改进建议：\n${suggestions}\n` : ''}

要求：
1. 结构完整：包含工作回顾、主要成绩、存在问题、改进方向
2. 内容充实：将用户提供的简要信息扩展成完整描述
3. 语言自然：避免AI痕迹，像真实教师撰写
4. 符合风格：严格按照"${style}"的要求写作
5. 字数控制：${lengthGuide}

请直接输出工作总结正文，不要包含标题。`
}

// 科室工作计划提示词
function generateDeptPlanPrompt(formData) {
  const { deptName, semester, length, style, activities, goals, measures, schedule } = formData
  
  let styleGuide = ''
  switch(style) {
    case '传统公文体':
      styleGuide = '使用规范的公文语言，结构严谨，用词正式'
      break
    case '朴实务实':
      styleGuide = '语言朴实，重点突出实际工作，少用修饰词'
      break
    case '简洁明快':
      styleGuide = '语言简练，条理清晰，直接表达要点'
      break
    case '生动活泼':
      styleGuide = '语言生动，适当使用比喻，增强可读性'
      break
  }
  
  let lengthGuide = ''
  if (length === '简短版') lengthGuide = '500-800字'
  else if (length === '标准版') lengthGuide = '1000-1500字'
  else lengthGuide = '2000字以上'
  
  return `你是一位经验丰富的教研组长，需要撰写${semester}的${deptName}工作计划。

基本信息：
- 科室：${deptName}
- 学期：${semester}
- 长度：${lengthGuide}
- 风格：${styleGuide}

${activities ? `计划活动：\n${activities}\n` : ''}
${goals ? `工作目标：\n${goals}\n` : ''}
${measures ? `具体措施：\n${measures}\n` : ''}
${schedule ? `时间安排：\n${schedule}\n` : ''}

要求：
1. 结构完整：包含指导思想、工作目标、主要措施、时间安排
2. 内容充实：将用户提供的简要信息扩展成完整描述
3. 语言自然：避免AI痕迹，像真实教师撰写
4. 符合风格：严格按照"${style}"的要求写作
5. 字数控制：${lengthGuide}

请直接输出工作计划正文，不要包含标题。`
}

// 班主任工作总结提示词
function generateClassSummaryPrompt(formData) {
  const { className, studentCount, semester, length, style, management, moralEducation, studyGuidance, activities, parentCommunication, individualEducation, classSpirit, problems, additional } = formData
  
  let styleGuide = ''
  switch(style) {
    case '传统公文体':
      styleGuide = '使用规范的公文语言，结构严谨，用词正式'
      break
    case '朴实务实':
      styleGuide = '语言朴实，重点突出实际工作，少用修饰词'
      break
    case '简洁明快':
      styleGuide = '语言简练，条理清晰，直接表达要点'
      break
    case '生动活泼':
      styleGuide = '语言生动，适当使用比喻，增强可读性'
      break
  }
  
  let lengthGuide = ''
  if (length === '简短版') lengthGuide = '800-1200字'
  else if (length === '标准版') lengthGuide = '1500-2000字'
  else lengthGuide = '2500字以上'
  
  return `你是一位经验丰富的班主任，需要撰写${semester}的${className}班主任工作总结。

基本信息：
- 班级：${className}
- 学生人数：${studentCount}人
- 学期：${semester}
- 长度：${lengthGuide}
- 风格：${styleGuide}

工作内容：
${management ? `班级管理：${management}\n` : ''}
${moralEducation ? `德育工作：${moralEducation}\n` : ''}
${studyGuidance ? `学习指导：${studyGuidance}\n` : ''}
${activities ? `活动组织：${activities}\n` : ''}
${parentCommunication ? `家校沟通：${parentCommunication}\n` : ''}
${individualEducation ? `个别教育：${individualEducation}\n` : ''}
${classSpirit ? `班风学风：${classSpirit}\n` : ''}
${problems ? `存在问题：${problems}\n` : ''}
${additional ? `补充说明：${additional}\n` : ''}

要求：
1. 结构完整：涵盖班级管理、德育、学习、活动等各方面
2. 内容充实：将用户提供的简要信息扩展成完整描述
3. 语言自然：避免AI痕迹，像真实班主任撰写
4. 符合风格：严格按照"${style}"的要求写作
5. 字数控制：${lengthGuide}

请直接输出工作总结正文，不要包含标题。`
}

// 班主任工作计划提示词
function generateClassPlanPrompt(formData) {
  const { className, studentCount, semester, length, style, management, moralEducation, studyGuidance, activities, parentCommunication, individualEducation, classSpirit, goals, additional } = formData
  
  let styleGuide = ''
  switch(style) {
    case '传统公文体':
      styleGuide = '使用规范的公文语言，结构严谨，用词正式'
      break
    case '朴实务实':
      styleGuide = '语言朴实，重点突出实际工作，少用修饰词'
      break
    case '简洁明快':
      styleGuide = '语言简练，条理清晰，直接表达要点'
      break
    case '生动活泼':
      styleGuide = '语言生动，适当使用比喻，增强可读性'
      break
  }
  
  let lengthGuide = ''
  if (length === '简短版') lengthGuide = '800-1200字'
  else if (length === '标准版') lengthGuide = '1500-2000字'
  else lengthGuide = '2500字以上'
  
  return `你是一位经验丰富的班主任，需要撰写${semester}的${className}班主任工作计划。

基本信息：
- 班级：${className}
- 学生人数：${studentCount}人
- 学期：${semester}
- 长度：${lengthGuide}
- 风格：${styleGuide}

计划内容：
${management ? `班级管理计划：${management}\n` : ''}
${moralEducation ? `德育工作计划：${moralEducation}\n` : ''}
${studyGuidance ? `学习指导计划：${studyGuidance}\n` : ''}
${activities ? `活动计划：${activities}\n` : ''}
${parentCommunication ? `家校沟通计划：${parentCommunication}\n` : ''}
${individualEducation ? `个别教育计划：${individualEducation}\n` : ''}
${classSpirit ? `班风学风建设计划：${classSpirit}\n` : ''}
${goals ? `工作目标：${goals}\n` : ''}
${additional ? `补充说明：${additional}\n` : ''}

要求：
1. 结构完整：涵盖班级管理、德育、学习、活动等各方面计划
2. 内容充实：将用户提供的简要信息扩展成完整描述
3. 语言自然：避免AI痕迹，像真实班主任撰写
4. 符合风格：严格按照"${style}"的要求写作
5. 字数控制：${lengthGuide}

请直接输出工作计划正文，不要包含标题。`
}
