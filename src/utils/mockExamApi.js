import http from './http'
import qs from 'qs'
// 创建答题卡
export function createSheet (id = 131231) {
  return http.put('/match/v1/answerCard/' + id)
}

// 获取题目
export function getQuestions (paperid, begin, end) {
  return http.get(`/match/v1/question/${paperid}/simpleInfo`)
}

// 提交答案
export function fetchAnswers (id, answers) {
  return http.post(`/match/v1/answerCard/${id}/save`, answers)
}

// 交卷
export function submitPaper (id, data) {
  return http.post(`/match/v1/answerCard/${id}/submit`, data)
}

export function getDonwloadLink (data) {
  return http.post(`/pand/pdf/paper?${qs.stringify(data)}`)
}