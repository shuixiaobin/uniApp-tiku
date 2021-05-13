import { getQuestions, fetchAnswers, submitPaper } from '@/utils/api'
import questionFormater from '@/utils/questionFormater'
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
  selected: [],
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
    selected: [],
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
    setSelecteds: (state, selected) => (state.selected = selected),
    setSelected: (state, {index, selected}) => Vue.set(state.selected, index, selected),
  },
  actions: {
    // 初始化答题卡数据
    handleSheetData({ commit, dispatch, state }, sheetData) {
      commit('resetStore')
      commit('setName', sheetData.name)
      // 试卷id
      commit('setId', sheetData.paperId)
      // 答题卡id
      commit('setPaperid', sheetData.idStr)
      commit('setDoubts', sheetData.doubts)
      const corrects = sheetData.corrects
      commit('setCorrects', corrects)
      commit('setSelecteds', corrects.map(item => item !== 0 && item !== 3))
      if (sheetData.subAnswers) {
        commit('setAnswers', sheetData.subAnswers.map((item, index) => {
          const c = corrects[index]
          if (c === 0 || c === 3) {
            return ''
          }
          return item
        }))
      } else {
        commit('setAnswers', sheetData.answers.map(() => ''))
      }
      commit('setTimes', sheetData.times.map(n => n * 1000))
      commit('setQuestionIds', sheetData.paper.questions)
      // commit('setStartTimes', sheetData.times)
      let count = 0
      const modules = sheetData.paper.modules.map(item => {
        const cnt = count
        count += item.qcount
        return {
          ...item,
          firstIndex: cnt
        }
      })

      commit('setModules', modules)

      commit('setRemainingTime', sheetData.remainingTime * 1000)
      commit('setRealRemainingTime', sheetData.remainingTime * 1000)

      commit('setCurrentIndex', sheetData.lastIndex)
      
      dispatch('startTiming')
    },
    // 获取题目
    getQuestions({ commit, state }) {
      return getQuestions(state.id, state.questionIds.join(',')).then(res => {
        const data = res.data.map(questionFormater)
        commit('setIgnores', data.filter(item => item.disabled))
        commit('setQuestions', data)
        commit('setModules', state.modules)
      })
    },
    // 计时逻辑
    startTiming({ commit, state, dispatch }) {
      if (flag) return
      flag = true

      let last = Date.now()
      commit('setLastTime', state.realRemainingTime)
      timer = setInterval(() => {
        const now = Date.now()
        const sub = now - last
        commit('subRemainingTime', sub)
        // 计时结束
        if (state.realRemainingTime <= 0) {
          clearInterval(timer)
          commit('setWaitTime', true)
          commit('setRemainingTime', 0)
          dispatch('submitPaper')
            .then(() => {
              uni.showModal({
                title: '提示',
                content: '交卷成功',
                success (res) {
                  uni.redirectTo({
                    url: `/pages/grade/index?id=${state.paperid}`
                  })
                },
                showCancel: false
              })
            })
            .catch(e => {
              wx.showToast({
                title: '交卷失败',
                icon: 'none',
                duration: 2000
              })
            })
        }
        last = now
      }, 71)
    },
    // 答题逻辑
    setAnswer({ commit, dispatch, state }, data = {}) {
      const { answer, index, selected } = data
      if (answer == null) return
      if (index == null) return
      commit('setAnswer', { answer, index })
      commit('setSelected', { selected, index })
      commit('setTime', {
        index,
        time: state.times[index] + state.lastTime - state.realRemainingTime
      })
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
      dispatch('saveCardData')
      if (!state.cacheQueue.some(i => i === index)) {
        commit('addQueue', index)
      }
      if (state.cacheQueue.length >= queueCut) {
        dispatch('fetchAnswer')
      }
    },
    // 发送答案
    async fetchAnswer({ state, commit }) {
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
        const c = state.corrects
        const q = state.questions
        commit('resetQueue')
        const res = await fetchAnswers(
          state.paperid,
          dataIdxs.map(idx => {
            let ans = {}
            if (typeof a[idx] === 'object') {
              ans.answers = a[idx]
            } else {
              ans.answer = a[idx]
            }
            return {
              ...ans,
              doubt: d[idx],
              time: Math.floor(t[idx] / 1000) + 1,
              questionId: q[idx].id,
              correct: c[idx],
            }
          })
        )
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
    async submitPaper({ state, commit, dispatch }) {
      const a = state.answers
      const d = state.doubts
      const t = state.times
      const c = state.corrects
      if (!state.questions) {
        // 创建答题卡时 时间太少时会缺少questions
        // 这样做的缺点是 这种情况下会调用两次获取题目接口
        await dispatch('getQuestions')
      }
      
      return submitPaper(
        state.paperid,
        state.questions.map((question, i) => {
          let ans = {}
          if (typeof a[i] === 'object') {
            ans.answers = a[i]
          } else {
            ans.answer = a[i]
          }
          return {
            ...ans,
            doubt: d[i],
            time: t === 0 ? 0 : Math.floor(t[i] / 1000) + 1,
            questionId: question.id,
            correct: c[i]
          }
        })
      ).then(res => {
        clearInterval(timer)
        commit('resetQueue')
        return res
      })
    },
    // localStorage存储答题卡数据
    saveCardData({ state }) {
      if (!CardLocalContext) return
      CardLocalContext.set({
        a: state.answers,
        d: state.doubts,
        t: state.times,
        c: state.corrects
      })
    }
  }
}
