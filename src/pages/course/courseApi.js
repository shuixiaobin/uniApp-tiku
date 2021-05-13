
import http from '@/utils/phpHttp'

//0元下单
export function zero_order(params) {
  return http.post(`/lumenapi/v5/c/order/zero_order`, {...params })
}


// 获取售后大纲数据
export function getAfterOutline(params) {
  return http.get('/lumenapi/v4/common/class/buy_after_syllabus', {
    ...params
  })
}


// 获取直播链接
export function getLiveUrl(params) {
  return http.get('/lumenapi/v4/common/class/class_token', {
      coursewareId:params.wareId,
      netClassId: params.netClassId,
      roomID: params.bjyRoomId,
      userAvatar: params.userAvatar,
      userName: params.userName,
      userNick: params.userNick,
      userNumber: params.userNumber,
      userRole: 0,
      videoType: 2,
      terminal:21
  })
}


