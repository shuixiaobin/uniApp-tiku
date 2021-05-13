import { translateHTML } from './util'
const supportQuestionType = [99, 100, 101,109,123,124,125,126,127]

// 文字填空
function wordBlank (data, index) {
  console.log(data)
  return {
    stem: translateHTML(data.stem),
    id: data.id,
    type: data.type,
    material: translateHTML(data.material || ''),
    index,
    teachType: data.teachType,
    answer: data.answers,
    blankNum: data.blankNum,
    uAnswer:data.uAnswer ,//答题卡
    time: data.time,//答题卡
    correct:data.correct,
    meta: data.meta,//解析
    analysis: translateHTML(data.referAnalysis), //解析
    extend:translateHTML(data.extend), //解析
    pointsName:data.pointsName, //解析
    from:data.from ,//解析
    cantAnswer: !supportQuestionType.includes(data.type)
  }
}

// 表格填空
function tableBlank (data, index) {
  return {
    ...wordBlank(data,index),
    layered: true,
  }
}


function subjective (data, index) {
  return {
    correct:data.correct,
    uAnswer:data.uAnswer,
    time:data.time,
    stem: translateHTML(data.stem),
    choices: [],
    material:translateHTML(data.material || ''),
    id: data.id,
    type: data.type,
    answer: data.referAnalysis,
    index,
    disabled: !supportQuestionType.includes(data.type),
    teachType: data.teachType,
    analysis: translateHTML(data.answerRequire),
    extend: translateHTML(data.extend),
    pointsName: data.pointsName,
    from: data.from,	//来源
    meta: {},  //正确率
    cantAnswer: !supportQuestionType.includes(data.type)
  }
}

// 连线
const reg = /^(\w+\.)/
function matching (data, index) {
  const list = data.choiceList || []
  const choices = list.map(arr => {
    return arr.map(item => {
      return translateHTML(item.replace(reg, '<span style="float: left; margin-right: 10px;">$1</span>'))
    })
  })
  return {
    stem: translateHTML(data.stem),
    choices,
    material: translateHTML(data.material || ''),
    id: data.id,
    type: data.type,
    index,
    teachType: data.teachType,
    answer: data.answers,
    layered: true,
    groupNum: data.groupNum,
    choiceNum: data.choiceNum,
    uAnswer:data.uAnswer ,//答题卡
    time: data.time,//答题卡
    correct:data.correct,
    meta: data.meta,//解析
    analysis: translateHTML(data.analysis), //解析
    extend:translateHTML(data.extend), //解析
    pointsName:data.pointsName, //解析
    from:data.from ,//解析
    cantAnswer: !supportQuestionType.includes(data.type)
  }
}

// M选N
function MxuanN (data, index) {
  return {
    stem: translateHTML(data.stem),
    choices: data.choices ? data.choices.map(translateHTML) : [],
    material: translateHTML(data.material || ''),
    id: data.id,
    type: data.type,
    index,
    teachType: data.teachType,
    answer: data.answer,
    layered: true,
    answerNum: data.answerNum,
    choiceNum: data.choiceNum,
    uAnswer:data.uAnswer ,//答题卡
    time: data.time,//答题卡
    correct:data.correct,
    meta: data.meta,//解析
    analysis: translateHTML(data.analysis), //解析
    extend:translateHTML(data.extend), //解析
    pointsName:data.pointsName, //解析
    from:data.from, //解析
    cantAnswer: !supportQuestionType.includes(data.type)
  }
}

function hasMaterial (data) {
  return !!data.material
}

export default {
  '123': wordBlank, // 文字填空
  '127': tableBlank, // 表格填空
  '124': matching, // 连线
  '126': matching, // 匹配
  '125': MxuanN, // M选N
  '106': subjective,
}

export const questionTypes = {
  '123': 'FillBlank', // 填空
  '125': 'MxuanN', // M选N
  '124': 'Matching', // 连线
  '126': 'Matching', // 匹配
  '127': 'FillBlank',
  '106': 'subjective',
}