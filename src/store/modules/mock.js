import { getQuestions, fetchAnswers, submitPaper } from '@/utils/mockExamApi'

import Vue from 'vue'

const queueCut = 5

function duplicate(arr) {
  const map = Object.create(null)
  return arr.filter(i => {
    if (i in map) {
      return false
    }
    map[i] = true
    return true
  })
}


function translateHTML (html) {
  const imgReg = /<img(.*?)(?:\/>|>)/g
  const styleReg = /style="([^"]*)"/
  return html.replace(imgReg, (str, attrs) => {
    if (styleReg.test(attrs)) {
      return `<img ${attrs.replace(styleReg, `style="max-width: 100%;height: auto;"`)}/>`
    } else {
      return `<img ${attrs} style="max-width: 100%;height:auto;"/>`
    }
  })
}

const supportQuestionType = [99, 100, 101, 109]

let timer
let CardLocalContext
let flag = false
const initState = {
  paperid: null,
  name: null,
  id: null,
  answers: null,
  doubts: null,
  times: null,
  questions: null,
  modules: null,
  lastTime: 0,
  cacheQueue: [],
  errorQueue: [],
  remainingTime: null,
  waitTime: null,
  realRemainingTime: null,
  realWaitTime: null,
  ignores: 0,
  questionIds: [],
  corrects: [],
  currentIndex: 0,
  submitFlag: false
}
export default {
  namespaced: true,
  state: {
    // 这里命名错了, 这是答题卡id
    paperid: null,
    // 试卷名称
    name: null,
    // 试卷id
    id: null,
    // 答案
    answers: null,
    // 标记
    doubts: null,
    // 用时
    times: null,
    // 题目id
    questions: null,
    modules: null,
    // 最后更新时间
    // startTimes: null,
    // 上次答题时间
    lastTime: 0,
    // 上传队列
    cacheQueue: [],
    // 上传失败队列
    errorQueue: [],

    // 计时器上显示的时间
    remainingTime: null,
    waitTime: null,

    // 准确剩余时间
    realRemainingTime: null,
    realWaitTime: null,
    // 忽略回答检测的题目id
    ignores: 0,
    questionIds: [],
    corrects: [],
    currentIndex: 0,
    y: 200,
    submitFlag: false
  },
  mutations: {
    // 重置store
    resetStore(state) {
      clearInterval(timer)
      flag = false
      Object.entries(initState).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          state[key] = []
        } else {
          state[key] = val
        }
      })
    },
    setCurrentIndex: (state, index) => (state.currentIndex = index),
    setQuestionIds: (state, ids) => (state.questionIds = ids),
    setName: (state, name) => (state.name = name),
    setId: (state, id) => (state.id = id),
    setPaperid: (state, id) => (state.paperid = id),
    setAnswers: (state, answers) => (state.answers = answers),
    setAnswer: (state, { index, answer }) => Vue.set(state.answers, index, answer),
    setDoubts: (state, doubts) => (state.doubts = doubts),
    setDoubt: (state, { index, doubt }) => Vue.set(state.doubts, index, doubt),
    setTimes: (state, times) => (state.times = times),
    setTime: (state, { index, time }) => Vue.set(state.times, index, time),
    setQuestions: (state, questions) => (state.questions = questions),
    setModules: (state, modules) => (state.modules = modules),
    setCorrects: (state, corrects) => (state.corrects = corrects),
    setCorrect: (state, { index, correct }) => Vue.set(state.corrects, index, correct),
    setWaitTime: (state, waitTime) => (state.waitTime = waitTime),
    setRemainingTime: (state, remainingTime) => (state.remainingTime = remainingTime),
    setRealWaitTime: (state, realWaitTime) => (state.realWaitTime = realWaitTime),
    setRealRemainingTime: (state, realRemainingTime) =>
      (state.realRemainingTime = realRemainingTime),
    subWaitTime: (state, sub) => {
      if (!state.realWaitTime) return
      const realWaitTime = (state.realWaitTime = state.realWaitTime - sub)
      if (realWaitTime <= 0) {
        state.realWaitTime = state.waitTime = null
        state.remainingTime += realWaitTime
        return
      }
      if (~~(state.waitTime / 1000) - ~~(realWaitTime / 1000) > 0) {
        state.waitTime = realWaitTime
      }
    },
    subRemainingTime: (state, sub) => {
      const realRemainingTime = (state.realRemainingTime = state.realRemainingTime - sub)
      if (~~(state.remainingTime / 1000) - ~~(realRemainingTime / 1000) > 0) {
        state.remainingTime = realRemainingTime
      }
    },
    setLastTime: (state, lastTime) => (state.lastTime = lastTime),
    addQueue: (state, index) => state.cacheQueue.push(index),
    addErrorQueue: (state, queue) => (state.errorQueue = state.errorQueue.concat(queue)),
    resetQueue: state => (state.cacheQueue = []),
    resetErrorQueue: state => (state.errorQueue = []),
    setIgnores: (state, ignores) => ignores.forEach(item => state.ignores++),
    setY: (state, y) => (state.y = y),
    setSubmitFlag: (state, val) => (state.submitFlag = val),
  },
  actions: {
    // 初始化答题卡数据
    handleSheetData ({commit, dispatch, state}, sheetData) {
      commit('setName', sheetData.name)
      commit('setId', sheetData.paperId)
      commit('setPaperid', sheetData.idStr)
      commit('setDoubts', sheetData.doubts)
      commit('setAnswers', sheetData.answers.map(item => (item === null || item === '0') ? '' : item))

      commit('setTimes', sheetData.times.map(n => n * 1000))
      let count = 0
      const modules = sheetData.modules.map(item => {
        const cnt = count
        count += item.qcount
        return {
          ...item,
          firstIndex: cnt
        }
      })

      commit('setModules', modules)

      const currentTime = sheetData.currentTime
      const startTime = sheetData.startTime || currentTime + 10 * 1000
      // const currentTime = Date.now()
      // const startTime = Date.now() + 10 * 60 * 1000
      if (currentTime >= startTime) {
        // 开始答题
        commit('setCurrentIndex', sheetData.lastIndex)
        commit('setRemainingTime', sheetData.remainingTime * 1000)
        commit('setRealRemainingTime', state.remainingTime)
      } else {
        // 等待
        commit('setWaitTime', startTime - currentTime)
        commit('setRemainingTime', sheetData.remainingTime * 1000)
        commit('setRealWaitTime', state.waitTime)
        commit('setRealRemainingTime', state.remainingTime)
      }

      dispatch('startTiming')
    },
    // 获取题目
    getQuestions ({commit, state}) {
      return getQuestions(state.id, 0, state.modules.reduce((sum, item) => sum + item.qcount, 0))
        .then(data => {
          data = data.data.map((item, i) => {
            return {
              id: item.id,
              material: item.materialList ? translateHTML(item.materialList[0]) : '',
              choices: item.choiceList ? item.choiceList.map(translateHTML) : [],
              index: i,
              stem: translateHTML(item.stem),
              type: item.type,
              teachType: item.teachType,
              moduleName: item.moduleName
            }
          })
          commit('setIgnores', data.filter(item => item && item.type === 106))
          commit('setQuestions', data)
        })
    },
    // 计时逻辑
    startTiming ({commit, state, dispatch}) {
      if (flag) return
      flag = true

      let last = Date.now()
      commit('setLastTime', state.realRemainingTime)
      timer = setInterval(() => {
        const now = Date.now()
        const sub = now - last
        if (state.waitTime === null) {
          // 开始考试
          commit('subRemainingTime', sub)
          // 计时结束
          if (state.realRemainingTime <= 0) {
            clearInterval(timer)
            commit('setWaitTime', null)
            commit('setRemainingTime', 0)
            // dispatch('submitPaper')
            commit('setSubmitFlag', true)
          }
        } else {
          commit('subWaitTime', sub)
        }
        last = now
      }, 71)
    },
    // 答题逻辑
    setAnswer({ commit, dispatch, state }, data = {}) {
      const {answer, index, correct} = data
      if (answer == null) return
      if (index == null) return
      commit('setAnswer', {answer, index})
      commit('setCorrect', { correct: correct ? 1 : 2, index })
      commit('setTime', {index, time: state.times[index] + state.lastTime - state.realRemainingTime})
      commit('setLastTime', state.realRemainingTime)
      dispatch('addQueue', index)
    },
    // 标疑逻辑
    setDoubt({ commit, dispatch }, data = {}) {
      const { doubt, index } = data
      if (doubt == null) return
      if (index == null) return
      commit('setDoubt', { doubt, index })
      dispatch('addQueue', index)
    },
    // 添加缓存队列
    addQueue({ commit, state, dispatch }, index) {
      if (!state.cacheQueue.some(i => i === index)) {
        commit('addQueue', index)
      }
      if (state.cacheQueue.length >= queueCut) {
        dispatch('fetchAnswer')
      }
    },
    // 发送答案
    async fetchAnswer ({state, commit}, type) {
      const errorQueue = state.errorQueue
      commit('resetErrorQueue')
      let dataIdxs = state.cacheQueue

      // 拼接缓存数据和失败缓存数据
      if (errorQueue.length) {
        dataIdxs = duplicate(dataIdxs.concat(errorQueue))
      }
      if (!dataIdxs.length) return true
      try {
        const a = state.answers
        const d = state.doubts
        const t = state.times
        const q = state.questions
        commit('resetQueue')
        const res = await fetchAnswers(state.paperid, dataIdxs.map(idx => {
          return {
            answer: a[idx],
            doubt: d[idx],
            expireTime: Math.floor(t[idx] / 1000) + 1,
            questionId: q[idx].id,
          }
        }))
        if (res.code !== 1000000) {
          throw new Error(res)
        } else if (errorQueue.length) {
          commit('resetErrorQueue')
        }

        return true
      } catch (e) {
        commit('addErrorQueue', dataIdxs)
        return e
      }
    },
    // 交卷
    submitPaper ({state, commit}) {
      const a = state.answers
      const d = state.doubts
      const t = state.times
      return submitPaper(state.paperid, state.questions.map((item, i) => {
        return {
          answer: a[i],
          doubt: d[i],
          expireTime: t === 0 ? 0 : Math.floor(t[i] / 1000) + 1,
          questionId: item.id
        }
      })).then(res => {
        commit('resetQueue')
        return res
      })
    },
  }
}
