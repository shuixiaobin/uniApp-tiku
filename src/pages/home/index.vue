<template>
  <view
    class="home"
    :class="{oh: areaShow}"
  >
    <navBar :showIcon="false" />
    <div class="selectedSubject">
      <div class="leftContent">
        <span
          class="subjectItem mr20"
          v-for="(item, index) in selectSubjectData"
          :class="{selected: currentIndex == index}"
          :key="item.name"
          @click="selectFn(index, item)"
        >
          {{ item.name }}
        </span>
      </div>
      <i
        class="iconfont icongengduo1"
        @click="goChoose"
      ></i>
    </div>
    <div class="tabWrapper">
      <div
        class="tabItem"
        v-for="(item) in tabData"
        :class="{ act: tabType == item.type }"
        :key="item.type"
        @click="handleChange(item.type)"
      >
        {{ item.text }}
        <div
          class="underline"
          :class="[tabType == item.type ? 'l19' : 'l69']"
        ></div>
      </div>
    </div>
    <mockTest
      :loadMoreForS="loadMoreForM"
      :isFirstForM="isFirstForM"
      :mockTestData="mockTestData"
      :utmsource="utmsource"
      @refreshFn="refreshFn"
      ref="mock"
      v-if="tabType == 'mock'"
    ></mockTest>
    <estimate
      :loadMoreForS="loadMoreForS"
      :isFirstForS="isFirstForS"
      :scoreData="scoreData"
       @refreshScore="refreshScore"
      ref="score"
      v-if="tabType === 'estimate'"
    ></estimate>
    <mockArea
      v-if="tabType == 'mock'"
      :utmsource="utmsource"
      @refreshFn="refreshFn"
    ></mockArea>
    <div class="attentionWrapper">
      <official-account class="attention"></official-account>
    </div>
  </view>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import navBar from '@/components/navBar'
  import examItem from './components/examItem'
  import estimate from './components/estimate'
  import mockTest from './components/mockTest'
  import mockArea from './components/mockArea'
  import { getScoreList, getCoursesList, getSubject, getArea, getTabSort, getMockList, getMockListInfo, getMockQrCodeSubjectId } from '@/utils/api'
  const needFilterCategoryIds = [200100114, 200100083, 200100084, 200100085, 200100070, 200100048, 200100053]
  export default {
    components: {
      navBar,
      examItem,
      estimate,
      mockTest,
      mockArea,
    },
    data() {
      return {
        tabData: [],
        // tabIndex: null,
        tabType: '',
        scorePage: 1,
        mockTestPage: 1,
        loadMoreForS: true,
        loadMoreForM: true,
        isFirstForS: true,
        isFirstForM: true,
        pageSize: 20,
        scoreData: [],
        mockTestData: [],
        qrcodeAreaId: 0,
        utmsource: '',
      }
    },
    computed: {
      ...mapState(['selectSubjectData', 'loginInfo', 'choosedSubjectData', 'currentIndex','subjectInfo']),
      ...mapState('home', ['areaShow']),
    },
    async onLoad(options) {
      console.log(options)
      const { categoryId, name, subjectId, areaId, scene, tabIndex, tabType, utm_source } = options
      this.utmsource = utm_source
      if (tabType) {
        // this.tabIndex = Number(tabIndex)
        this.tabType = tabType
      }
      if (categoryId && name && subjectId && areaId && !scene) {
        let decodeName = decodeURIComponent(name)
        // 如果本地已经有当前数据的话，就不保存了
        if (!this.selectSubjectData.some(item => item.name === decodeName)) {
          this.setSelectSubject({
            categoryId,
            subjectId,
            areaId,
            name: decodeName,
          })
        }
        this.setChoosedSubject({
          categoryId,
          subjectId,
          areaId,
          name: decodeName,
        })
      }
      if (scene) {
        // 从二维码识别过来
        try {
          const queryArr = decodeURIComponent(scene).split('_')
          const queryQudao = decodeURIComponent(scene).split('@')
          const query1 = queryArr[0].split('#')
          let categoryId = query1[0]
          let subjectId = query1[1]
          const areaId = query1[2].split(',')[0]
          if (query1[3]) {
            this.tabType = query1[3].split('@')[0]
          }
          if (queryArr[1]) this.qrcodeAreaId = queryArr[1]
          if (queryQudao[1] && queryQudao[1].split('~') && queryQudao[1].split('~')[0]){
            this.setQudao(queryQudao[1].split('~')[0])
          }
          // 如果包含‘～1’字段说明科目类别为假，需要重新请求接口获取真实科目类别
          if (queryQudao[1] && queryQudao[1].split('~') && queryQudao[1].split('~')[1]) {
            const { data } = await getMockQrCodeSubjectId({ categoryId, subjectId })
            this.initQrCodeData({ areaId, categoryId: data.categoryId, subjectId: data.subjectId })
          } else {
            this.initQrCodeData({ areaId, categoryId, subjectId })
          }
        } catch (e) {
          console.log(e)
        }
      }
    },
    onShow() {
      this.getSort().then(res => {
        this.initData()
      })
    },

    onPullDownRefresh() {
      this.initData()
    },
    onReachBottom() {
      switch (this.tabType) {
        case 'mock':
          if (this.loadMoreForM) {
            this.mockTestPage++
            this.getMockListData()
          }
          break
        case 'estimate':
          if (this.loadMoreForS) {
            this.scorePage++
            this.getScoreListData()
          }
          break
        default:
          if (this.loadMoreForM) {
            this.mockTestPage++
            this.getMockListData()
          }
          break
      }
    },
    // 分享
    onShareAppMessage() {
      return {
        title: this.tabType === 'mock' ? '@你：华图在线万人模考报名开始喽！学霸pk地，要你参加！' : '还在忐忑等成绩？闪电估分知入围！',
        path: `/pages/home/index?categoryId=${this.choosedSubjectData.categoryId}&subjectId=${this.choosedSubjectData.subjectId}&areaId=${
          this.choosedSubjectData.areaId
        }&name=${encodeURIComponent(this.choosedSubjectData.name)}&tabIndex=${this.tabIndex}&tabType=${this.tabType}`,
        imageUrl: this.tabType !== 'mock' ? 'http://p.htwx.net/wxTk/share.png' : '',
      }
    },
    methods: {
      async getSort() {
        try {
          const res = await getTabSort()
          this.tabData = res.data.sort(function (a, b) {
            return a.sort - b.sort
          })
          // if (!this.tabIndex) {
          //   this.tabIndex = Number(this.tabData[0].sort)
          // }
          if (!this.tabType) {
            this.tabType = this.tabData[0].type
          }
          return Promise.resolve(1)
        } catch (e) {
          console.log(e)
        }
      },
      async initQrCodeData({ categoryId, subjectId, areaId }) {
        // 获取考试类别和科目对应的名字
        try {
          let name = ''
          const res = await getSubject()
          this.setSubjectInfo(res.data);
          res.data.forEach(item => {
            if (item.id === Number(categoryId)) {
              name = item.name
         /*       item.childrens.forEach(each => {
                if (each.id === Number(subjectId)) {
                  return ( name === each.name ? name : `${name}-${each.name}`)
                }
              })  */
            }
          })

          // 获取地区对应的名字
          const areaData = await getArea({
            catgory: categoryId,
            subject: subjectId,
          })
          areaData.data.areas.forEach(item => {
            if (item.id === Number(areaId)) {
              return (name = `${name}-${item.name}`)
            }
          })

          // 如果本地已经有当前数据的话，就不保存了
          if (!this.selectSubjectData.some(item => item.name === name)) {
            this.setSelectSubject({
              categoryId,
              subjectId,
              areaId,
              name,
            })
          }
          this.setChoosedSubject({
            categoryId,
            subjectId,
            areaId,
            name,
          })
          this.initData()
        } catch (err) {
          console.log(err)
        }
      },
      async initData() {
        switch (this.tabType) {
          case 'mock':
            this.mockTestPage = 1
            this.getMockListData()
            break
          case 'estimate':
            this.scorePage = 1
            this.getScoreListData()
            break
          default:
            this.mockTestPage = 1
            this.getMockListData()
            break
        }
      },
      // 报名成功刷新页面
      refreshFn() {
        this.mockTestPage = 1
        this.qrcodeAreaId = 0
        this.getMockListData(true)
      },
      refreshScore(){
        this.scorePage = 1
        this.getScoreListData(true);
      },
      handleChange(t) {
        // this.tabIndex = i
        this.tabType = t
        this.initData()
      },
      selectFn(i, item) {
        // 暂时注释，等证下来再打开
        // uni.showLoading({
        //   title: '加载中',
        //   mask: true
        // })
        console.log(item)
        this.setChoosedSubject(item);
        switch (this.tabType) {
          case 'mock':
            this.mockTestPage = 1
            this.loadMoreForM = true
            this.isFirstForM = true
            this.getMockListData();
            break
          case 'estimate':
            this.scorePage = 1
            this.loadMoreForS = true
            this.isFirstForS = true
            this.getScoreListData()
            break
          default:
            this.mockTestPage = 1
            this.loadMoreForM = true
            this.isFirstForM = true
            this.getMockListData()
            break
        }
      },
      goChoose() {
        uni.navigateTo({
          url: '/pages/home/selectTest',
        })
      },
      async getMockListData() {
        try {
          const res = await getMockList({
            page: this.mockTestPage,
            size: this.pageSize,
            subjectId: this.choosedSubjectData.subjectId,
          })

     /*      if(!isDefault){//第一次进来才会默认
            this.$refs.mock.updateView();
          } */
       
          if (res.data.list.length < 20 && this.mockTestPage > 1) {
            this.loadMoreForM = false
          }
          if (res.data.length === 0) {
            this.isFirstForM = false
          }
          if (this.isFirstForM) {
            this.isFirstForM = false
          }
          // 过滤需要过滤的考试类别中当前选中的地区以及全国的模考大赛
          const mockList = needFilterCategoryIds.includes(+this.choosedSubjectData.categoryId) && +this.choosedSubjectData.areaId !== -9
          ? res.data.list.filter(item => item.areaList.some(each => each.key === +this.choosedSubjectData.areaId || each.key === -9))
          : res.data.list
      
          // 过滤与主模考时间相同的timeInfo
          const filterAreaGroupList = mockList.map(item => ({
            ...item,
            areaList: this.qrcodeAreaId
              ? item.areaList.find(n => n.key === +this.qrcodeAreaId)
                ? item.areaList.filter(item => item.key === +this.qrcodeAreaId)
                : item.areaList
              : item.areaList,
            areaGroupList: item.areaGroupList.filter(each => each.timeInfo !== item.timeInfo),
          }))
          if (this.loginInfo.token) {
            const res2 = await getMockListInfo({
              subjectId: this.choosedSubjectData.subjectId,
            })
            const mergeData = []
            filterAreaGroupList.forEach((item, i) => {
              res2.data.forEach(each => {
                if (each.matchId === item.matchId) {
                  mergeData.push({
                    ...item,
                    ...each,
                  })
                }
              })
            })
            console.log(mergeData)

            if (this.mockTestPage === 1) {
              uni.stopPullDownRefresh()
              this.mockTestData = mergeData
            } else {
              this.mockTestData = [...this.mockTestData, ...mergeData]
            }
          } else {
            if (this.mockTestPage === 1) {
              uni.stopPullDownRefresh()
              this.mockTestData = filterAreaGroupList
            } else {
              this.mockTestData = [...this.mockTestData, ...filterAreaGroupList]
            }
          }
        } catch (e) {
          console.log(e)
        }
      },
      async getScoreListData(isDefault) {
        try {
          const res = await getScoreList({
            page: this.scorePage,
            size: this.pageSize,
            subjectId: this.choosedSubjectData.subjectId,
            terminale: 21,
            types: 8,
            areaId: this.choosedSubjectData.areaId,
          })
          
   /*        if(!isDefault){//第一次进来才会默认
            this.$refs.score.updateView();
          } */

          if (res.data.length < 20 && this.scorePage > 1) {
            this.loadMoreForS = false
          }
          if (res.data.length === 0) {
            this.isFirstForS = false
          }
          // // 过滤筛选的所选区域下的数据
          // const filterArr = res.data.filter(item => item.area === Number(this.choosedSubjectData.areaId))
          if (this.isFirstForS) {
            this.isFirstForS = false
          }
          if (this.scorePage === 1) {
            uni.stopPullDownRefresh()
            this.scoreData = res.data
          } else {
            this.scoreData = [...this.scoreData, ...res.data]
          }
          // 暂时注释，等证下来再打开
          // this.addCourse(filterArr)
        } catch (e) {
          console.log(e)
        }
      },
      // 暂时注释，等证下来再打开
      // async addCourse(array) {
      //   let getCoursesArr = []
      //   for (const item of array) {
      //     getCoursesArr.push(
      //       getCoursesList({
      //         classIds: item.courseId
      //       })
      //     )
      //   }
      //   try {
      //     const resArr = await Promise.all(getCoursesArr)
      //     array.map((item, index) => {
      //       item.courseInfo = resArr[index].data[0]
      //     })
      //     if (this.firstFlag) {
      //       this.firstFlag = false
      //     }
      //     uni.hideLoading({
      //       title: '加载中',
      //       mask: true
      //     })
      //     if (this.page === 1) {
      //       uni.stopPullDownRefresh()
      //       this.scoreData = array
      //     } else {
      //       this.scoreData = [...this.scoreData, ...array]
      //     }
      //   } catch (error) {
      //     console.log(error)
      //   }
      // },
      ...mapMutations(['setChoosedSubject', 'setSelectSubject', 'setUserInfo', 'setQudao','setSubjectInfo']),
    },
  }
</script>
<style lang="scss" scoped>
  .home {
    &.oh {
      overflow: hidden;
      height: 100vh;
    }
    .selectedSubject {
      width: 100%;
      background: #fff;
      height: 116rpx;
      padding: 0 20rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .leftContent {
        width: 640rpx;
        height: 116rpx;
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow-x: auto;
        .subjectItem {
          display: inline-block;
          height: 56rpx;
          font-size: 26rpx;
          line-height: 56rpx;
          &.selected {
            background: rgba(255, 238, 220, 1);
            border-radius: 28px;
            padding: 0 20rpx;
            position: relative;
            color: #ae773d;
            &::after {
              content: '';
              width: 0;
              height: 0;
              position: absolute;
              transform: translateX(-50%);
              left: 50%;
              border-top: 10rpx #ffeedc solid;
              border-left: 15rpx transparent solid;
              border-right: 15rpx transparent solid;
              border-bottom: 10rpx #fff solid;
              bottom: -20rpx;
              border-style: solid;
            }
          }
        }
        &::-webkit-scrollbar {
          width: 0 !important;
          height: 0 !important;
        }
      }
      .icongengduo1 {
        padding: 5rpx 0 5rpx 20rpx;
        border-left: 1rpx solid rgba(0, 0, 0, 0.2);
      }
    }
    .tabWrapper {
      width: 100%;
      height: 72rpx;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.07);
      display: flex;
      line-height: 72rpx;
      position: relative;
      .tabItem {
        flex: 1;
        text-align: center;
        &.act {
          color: #ff3f47;
          position: relative;
          &::after {
            content: '';
            width: 88rpx;
            height: 6rpx;
            background: rgba(255, 63, 71, 1);
            border-radius: 4rpx 4rpx 0 0rpx;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
      /* .underline {
            width: 88rpx;
            height: 6rpx;
            background: rgba(255, 63, 71, 1);
            border-radius: 4rpx 4rpx 0 0rpx;
            position: absolute;
            bottom: 0;
            &.l19 {
              transition: left 0.3s;
              background: transparent;
              left: 19%;
            }
            &.l69 {
              transition: left 0.3s;
              background: transparent;
              left: 69%;
            }
          } */
    }
    .attentionWrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }
</style>