export default {
  namespaced: true,
  state: {
    areaShow: false,
    examInfo: {}, //当前估分数据
    applyInfo: {}, //当前报名模考大赛信息 
    choosedArea: {}, //当前选择地区
    schoolInfo: null, // 当前选择职位信息
  },
  mutations: {
    toggleShow(state, flag) {
      state.areaShow = flag
    },
    setApplyInfo(state, obj) {
      state.applyInfo = obj
    },
    setChooseArea(state, obj) {
      state.choosedArea = obj
    },
    setSchoolInfo(state, obj) {
      state.schoolInfo = obj
    },
    setExamInfo(state, obj) {
      state.examInfo = obj
    }
  }
}
