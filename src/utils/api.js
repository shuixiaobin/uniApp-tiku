import http from './http'
import qs from 'qs'

// 创建答题卡
export function createSheet(paperid) {
  return http.post(`/p/v1/practices/papers?id=${paperid}`)
}

// 查询答题卡
export function getSheetData(id) {
  return http.get(`/p/v1/practices/${id}`)
}

// 获取题目
export function getQuestions(paperid, ids) {
  return http.get(`/q/v1/questions/?ids=${ids}`)
}

// 提交答案
export function fetchAnswers(id, answers) {
  return http.put(`/p/v1/practices/${id}/answers`, answers)
}

// 交卷
export function submitPaper(practiceId, data) {
  return http.put(`/p/v1/practices/${practiceId}`, data)
}

//成绩统计报告
export function getReport(param) {
  return http.get(`/p/v1/practices/${param.id}`).then(res => res.data)
}


//模考大赛报告
export function getMockDetail(param) {
  return http.get(`/match/v1/practices/${param.id}`).then(res => res.data)
}

//模考大赛解析
export function getMockQuestions(param) {
  return http.get(`/match/v1/answerCard/${param}/getAllAnalysisInfo`).then(res => res.data)
}

// 获取科目
export function getSubject() {
  return http.get('/k/v2/subjects/tree/static', {terminal: 21})
}

// 获取地区
export function getArea(params) {
  return http.get(`/u/v2/users/areas`, params)
}

// 获取精准估分列表
export function getScoreList(params) {
  return http.get('/p/v2/papers/estimateList', params)
}

// 获取估分历史列表
export function getScoreHistoryList(params, headers) {
  return http.get('/p/v3/practices', params, headers)
}

//登录
export const LoginFn = params =>
  http.post(`/u/v3/users/login`, qs.stringify(params), {
    headers: {
      cv: '7.1.5'
    }
  })

// 忘记密码
export const forgetPassword = params =>
  http.put(`/u/v1/users/resetpwd`, qs.stringify(params), {
    headers: {
      cv: '7.1.5'
    }
  })

// 发送验证码
export const sendCode = params =>
  http.get(`/u/v2/users/captcha/${params}?type=M`)

// 忘记密码发送验证码
export const forgetSendCode = params =>
  http.get(`/u/v2/users/findPasswordCaptcha/${params}?type=M`)

// 获取解析课
export const getCoursesList = params =>
  http.get('/c/v6/courses/baseInfo', params, {
    headers: {
      cv: '7.1.5'
    }
  })

// 获取openid

export const getOpenId = params => http.get('/u/v3/users/code2Session', params)

// 微信手机号授权登录
export const authorLogin = params =>
  http.post('/u/v3/users/loginForWechat', qs.stringify(params))

// 发起分享  标记答题卡
export function share(params) {
  return http.post(
    `/pc/v4/share/estimateForWechat?avatar=${params.avatar}&nick=${params.nick}&practiceId=${params.practiceId}&type=${params.type}`
  )
}

// 获取分享答题卡数据
export function getShareCard(params) {
  return http.get(`/pc/v4/share/estimateForWechat?id=${params.id}`)
}

// 获取模考分享答题卡数据
export function getMockShareCard(params) {
  return http.get(`/match/v1/wechat/share/${params.id}`)
}

//获取小程序审核状态
export function getStatus(params) {
  return http.get(`/u/v1/users/wechat/check`)
}

// 获取首页tab排序
export function getTabSort() { 
  return http.get('/match/v1/miniprogram/getIndexTabSort')
}

// 获取模考大赛
export function getMockList(params) { 
  return http.get('/match/v3/search/list', params)
}

// 获取模考大赛用户信息
export function getMockListInfo(params) { 
  return http.get('/match/v2/search/list/user', params)
}

// 模考大赛报名
export function setApply(params) { 
  return http.post(`/match/v1/enroll/${params.matchId}?positionId=${params.positionId}&promoterInfoId=${params.promoterInfoId}`)
}

// 获取模考历史标签
export function getMockTags(id) { 
  return http.get(`/match/v1/tag/${id}`)
}

// 获取模考报告详情数据
export function getMockReport(tagId) { 
  return http.get(`/match/v1/report/${tagId}`)
}

// 保存消息订阅信息
export function saveSubscribe(params) { 
  return http.post('/match/v1/miniprogram/subscribe/save', params)
}

//领取礼包
export function getGift(params) {
	return http.post('/c/v5/order/bigGiftOrder?classId='+params.classId)
}

// 获取职位库下拉列表数据
export function getJobSelect(params) {
  return http.get('/match/v1/position/next', params)
}

// 模考大赛职位库报名
export function jobApply(params) {
  return http.post(`/match/v1/enroll/school/${params.matchId}?schoolName=${params.schoolName}`, { ...params.body })
}

// // 获取职位库数据
// export function getJobContent(params) {
//   return http.get('/match/v1/position/show', params)
// }

// 估分职位库报名
export function examJobApply(params) {
  return http.post(`/p/v1/paper/position/enroll/${params.paperId}?schoolName=${params.schoolName}`, {...params.body})
}

// 估分职位库选项查询
export function  getExamJobSelect(params) {
  return http.get('/p/v1/paper/position/next', params)
}

// 获取类别科目转换id
export function getMockQrCodeSubjectId(params) {
  return http.get('/match/v1/miniprogram/getMockQrCodeSubjectId', params)
}