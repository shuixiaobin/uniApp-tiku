import { translateHTML } from './util'

// 文字填空
function wordBlank (data, index) {
  return {
    stem: translateHTML(data.stem),
    id: data.id,
    type: data.type,
    material: translateHTML(data.material || ''),
    index,
    teachType: data.teachType,
    answer: data.answer,
    blankNum: data.blankNum,
  }
}

// 表格填空
function tableBlank (data, index) {
  return {
    ...wordBlank(data,index),
    layered: true,
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
    answer: data.answer,
    layered: true,
    groupNum: data.groupNum,
    choiceNum: data.choiceNum,
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
  }
}

function defaultFormater (data, index) {
  return {
    stem: translateHTML(data.stem),
    choices: data.choices ? data.choices.map(translateHTML) : [],
    material: translateHTML(data.material || ''),
    id: data.id,
    type: data.type,
    index,
    disabled: false,
    teachType: data.teachType,
    answer: data.answer,
  }
}

function hasMaterial (data) {
  return !!data.material
}

const formaterMap = {
  '123': wordBlank, // 文字填空
  '127': tableBlank, // 表格填空
  '124': matching, // 连线
  '126': matching, // 匹配
  '125': MxuanN, // M选N
}

export default function questionFormater (data, index) {
  if (data.type in formaterMap) {
    return formaterMap[data.type](...arguments)
  }
  return defaultFormater(...arguments)
}

export const questionTypes = {
  '123': 'FillBlank', // 填空
  '125': 'MxuanN', // M选N
  '124': 'Matching', // 连线
  '126': 'Matching', // 匹配
  '98': 'Shuangxuan',
  '127': 'FillBlank',
}