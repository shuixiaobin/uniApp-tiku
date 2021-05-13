<template>
  <div class="estimateHistory">
    <navBar :title="'我的估分历史'" />
    <div
      class="noData"
      v-if="historyData.length===0&&!first"
    >
      <p>还没参加过估分？<br>
        快去报名吧！</p>
      <div
        class="apply"
        @click="goHome"
      >去报名</div>
    </div>
    <historyItem :historyData="historyData"></historyItem>
    <div
      class="noMoreData"
      v-if="!loadMore"
    > ~~ 我是有底线的 ~~</div>
  </div>
</template>

<script>
  import navBar from '@/components/navBar'
  import historyItem from './components/historyItem'
  import { getScoreHistoryList, getCoursesList } from '@/utils/api'
  import { mapState } from 'vuex'
  export default {
    components: {
      navBar,
      historyItem
    },
    data() {
      return {
        historyData: [],
        cursor: 0,
        loadMore: true,
        first: true
      }
    },

    mounted() {
      this.getScoreHistory()
    },

    onPullDownRefresh() {
      this.cursor = 0
      this.getScoreHistory()
    },

    onReachBottom() {
      if (this.loadMore) {
        this.getScoreHistory()
      }
    },
    computed: {
      ...mapState(['choosedSubjectData'])
    },

    methods: {
      goHome() {
        uni.reLaunch({
          url: '/pages/home/index?tabType=estimate'
        })
      },
      async getScoreHistory() {
        try {
          const res = await getScoreHistoryList(
            {
              cardType: 13,
              cursor: this.cursor
            },
            {
              headers: {
                subject: this.choosedSubjectData.subjectId
              }
            }
          )
          if (res.data.resutls.length < 20 && this.cursor !== 0) {
            this.loadMore = false
          }
          if (res.data.resutls.length > 0) {
            // 过滤筛选的所选区域下的数据
            const filterArr = res.data.resutls.filter(item => item.paper.area === Number(this.choosedSubjectData.areaId))
            // 暂时解开注释，等证下来再注释
            if (this.first) {
              this.first = false
            }
            if (this.cursor === 0) {
              this.historyData = filterArr
            } else {
              this.historyData = [...this.historyData, ...filterArr]
            }
            // 暂时注释，等证下来再打开
            // this.addCourse(filterArr, this.cursor)
          } else {
            this.first = false
          }
          uni.stopPullDownRefresh()
          this.cursor = res.data.cursor
        } catch (error) {
          console.log(error)
        }
      }
      // 暂时注释，等证下来再打开
      // async addCourse(array, cursor) {
      //   let getCoursesArr = []
      //   for (const item of array) {
      //     getCoursesArr.push(
      //       getCoursesList({
      //         classIds: item.paper.courseId
      //       })
      //     )
      //   }
      //   try {
      //     const resArr = await Promise.all(getCoursesArr)
      //     array.map((item, index) => {
      //       item.courseInfo = resArr[index].data[0]
      //     })
      //     if (this.first) {
      //       this.first = false
      //     }
      //     if (cursor === 0) {
      //       this.historyData = array
      //     } else {
      //       this.historyData = [...this.historyData, ...array]
      //     }
      //   } catch (error) {
      //     console.log(error)
      //   }
      // }
    }
  }
</script>
<style lang='scss' scoped>
  .estimateHistory {
    .noData {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      p {
        font-size: 37rpx;
        font-weight: 500;
        color: rgba(155, 155, 155, 1);
        line-height: 52rpx;
        text-align: center;
      }
      .apply {
        margin-top: 100rpx;
        width: 650rpx;
        height: 100rpx;
        background: linear-gradient(90deg, rgba(255, 228, 164, 1) 0%, rgba(255, 181, 39, 1) 100%);
        border-radius: 50rpx;
        font-size: 36rpx;
        font-weight: 500;
        color: rgba(171, 82, 20, 1);
        line-height: 100rpx;
        text-align: center;
      }
    }
    .noMoreData {
      text-align: center;
      font-size: 28rpx;
      line-height: 4;
      color: #9e9e9e;
    }
  }
</style>