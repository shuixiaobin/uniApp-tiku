import Vue from 'vue'
import Vuex from 'vuex'
import examination from './modules/examination'
import analysis from './modules/analysis'
import home from './modules/home'
import mock from './modules/mock'
import { getOpenId, getStatus ,getSubject} from '@/utils/api'
import sa from '../utils/sendors'

Vue.use(Vuex)

// function morenAreas(){
//   var result= [];
//   if(uni.getStorageSync('hasClearFlag')){
//   }else{
//     uni.setStorageSync('selectSubject','');
//     uni.setStorageSync('hasClearFlag',true);
//   }
//   var localAreas= uni.getStorageSync('selectSubject')? JSON.parse(uni.getStorageSync('selectSubject')):[];
//   var moren=[//默认地区
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 41,
//       name: '公务员-行测-河北'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 656,
//       name: '公务员-行测-黑龙江'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 1709,
//       name: '公务员-行测-湖北'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 1045,
//       name: '公务员-行测-安徽'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 356,
//       name: '公务员-行测-内蒙古'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 225,
//       name: '公务员-行测-山西'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 2106,
//       name: '公务员-行测-广西'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 586,
//       name: '公务员-行测-吉林'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 1263,
//       name: '公务员-行测-江西'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 3125,
//       name: '公务员-行测-新疆'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 471,
//       name: '公务员-行测-辽宁'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 2600,
//       name: '公务员-行测-云南'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 2502,
//       name: '公务员-行测-贵州'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 2945,
//       name: '公务员-行测-甘肃'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 2257,
//       name: '公务员-行测-重庆'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 3098,
//       name: '公务员-行测-宁夏'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 2230,
//       name: '公务员-行测-海南'
//     },
//     {
//       categoryId: 1,
//       subjectId: 1,
//       areaId: 3046,
//       name: '公务员-行测-青海'
//     }
//   ]
  
//   if(localAreas.length == 0) {
//     result = moren;
//   } else {
//     let obj = {}
//     let arr = [...localAreas, ...moren]
//     result = arr.reduce((pre, cur) => {
//       if (!obj.hasOwnProperty(cur.name)) {
//         pre.push(cur)
//       }
//       obj[cur.name] = true
//       return pre
//     }, [])
//   }
//   console.log(result);
//   return result
// }


const store = new Vuex.Store({
  state: {
    openid: null,
    subjectInfo:[],
    isLogin: uni.getStorageSync('isLogin') || false,
    loginInfo:
      (!!uni.getStorageSync('loginInfo') &&
        JSON.parse(uni.getStorageSync('loginInfo'))) ||
      {}, //华图用户信息,

    userInfo:
      (!!uni.getStorageSync('userInfo') &&
        JSON.parse(uni.getStorageSync('userInfo'))) ||
      {}, //微信用户信息

    subjectChildrens: [], //当前选择科目子集
    currentIndex: 0,
    selectSubjectData: uni.getStorageSync('selectSubject')
    ? JSON.parse(uni.getStorageSync('selectSubject'))
    :[
      {
        categoryId: 1,
        subjectId: 1,
        areaId: -9,
        name: '公务员-全国'
      }
    ], //添加科目集合

    // 当前选中科目
    choosedSubjectData: (!!uni.getStorageSync('selectSubject') &&
      JSON.parse(uni.getStorageSync('selectSubject'))[0]) || {
      categoryId: 1,
      subjectId: 1,
      areaId: -9,
      name: '公务员-全国'
      // categoryId: 1,
      // subjectId: 1,
      // areaId: 41,
      // name: '公务员-行测-河北'
    }, //选中科目
    zhichiParams: '{"name":"sobot","age":18}',
    transferAction:
      '[{"actionType":"to_group","deciId":"f6b7f57257134b39ab5b8c3b00236c15","optionId":"4","spillId":"4"}]',
    checkStatus: true, //审核状态
    platform: 'android',
    qudaoInfo:''
  },
  mutations: {
    setOpenid(state, openid) {
      state.openid = openid
    },
    setIsLogin(state) {
      state.isLogin = true
      uni.setStorageSync('isLogin', true)
    },
    setUserInfo(state, obj) {
      state.userInfo = obj
      uni.setStorageSync('userInfo', JSON.stringify(obj))
    },
    setQudao(state, val) {
      state.qudaoInfo = val
    },
    setSubjectInfo(state, val) {
      //需要过滤下数据.
      var results={}; 
      function mapChildrens(datas,flag){
          [].concat(datas).map(item=>{
            if(flag){
              //console.log(flag)
              if(!results[flag]){
                results[flag]=[];
              }

              if(item.id != 14 && item.id != 100100173){ //申论和招警行测，禁止
                results[flag].push({name:item.name,value:item.id});
              }
            }
            if(item.childrens && item.childrens.length > 0){
              mapChildrens(item.childrens,item.id);
            }
          })
      }
      mapChildrens(val);
      console.log(results)
      state.subjectInfo = results
    },


    setSubjectChildrens(state, arr) {
      state.subjectChildrens = arr
    },
    setSelectSubject(state, obj) {
      var sameIndex = 'a';
      state.selectSubjectData.forEach((item,i) => {
        if (
          item.areaId === -9 &&
          item.categoryId === 1 &&
          item.subjectId === 1 &&
          item.name.includes('国考')
        ) {
          item.name = item.name.replace('国考', '全国')
        }

        if(item.categoryId === obj.categoryId && item.areaId === obj.areaId){
          sameIndex = i;
        }
      })


      if (sameIndex == 'a') {
        state.selectSubjectData.push(obj)
      }else{
        state.selectSubjectData[sameIndex] = obj;
      }

      uni.setStorageSync(
        'selectSubject',
        JSON.stringify(state.selectSubjectData)
      )
    },
    deleteSelectSubject(state, obj) {
      state.selectSubjectData.splice(obj.i, 1)
      uni.setStorageSync(
        'selectSubject',
        JSON.stringify(state.selectSubjectData)
      )
    },
    // 拖拽改变科目顺序
    changeSuject(state, { startIndex, endIndex }) {
      state.selectSubjectData[startIndex] = state.selectSubjectData.splice(
        endIndex,
        1,
        state.selectSubjectData[startIndex]
      )[0]
      state.selectSubjectData.forEach((item, i) => {
        if (state.choosedSubjectData.name === item.name) {
          state.currentIndex = i
        }
      })
      
      uni.setStorageSync(
        'selectSubject',
        JSON.stringify(state.selectSubjectData)
      )
    },
    setChoosedSubject(state, obj) {
      state.choosedSubjectData = obj
      state.currentIndex = state.selectSubjectData.findIndex(
        item => item.name === state.choosedSubjectData.name
      )

      console.log(state.currentIndex);
    },
    setLoginInfo(state, obj) {
      state.loginInfo = obj
      sa.login(obj.mobile)
      uni.setStorageSync('loginInfo', JSON.stringify(obj))
    },
    // 设置审核状态
    setCheckStatus(state, flag) {
      state.checkStatus = flag
    },
    setPlatform: (state, platform) => (state.platform = platform)
  },
  actions: {
    // get openid
    getUserOpenId: async function({ commit }) {
      return await new Promise((resolve, reject) => {
        uni.login({
          success: data => {
            getOpenId({ code: data.code })
              .then(res => {
                commit('setOpenid', res.data.openid)
                sa.setOpenid(res.data.openid)
                sa.init(res.data.openid)
                resolve(res.data.openid)
              })
              .catch(err => {
                reject(err)
              })
          },
          fail: err => {
            console.log(
              'uni.login 接口调用失败，将无法正常使用开放接口等服务',
              err
            )
            reject(err)
          }
        })
      })
    },
    async getStatus({ commit }) {
      const res = await getStatus()
      if (res.message === '1') {
        commit('setCheckStatus', false)
      } else {
        commit('setCheckStatus', true)
      }
    },
    async getAllSubjects({ commit }) {
      const res = await getSubject()
      commit('setSubjectInfo', res.data)
    }

  },
  modules: {
    examination,
    analysis,
    home,
    mock
  }
})

export default store
