<template>
  <div class="estimate">

    <div class="mockTop">
      <div class="changeSubject" v-if="selectSubjectVal.name">
        <span class="label">切换科目</span>
         <HtPicker
          ref="picker"
          :list="subjectList"
          :select-name="selectSubjectVal.name"
          label_key="name"
          value_key="value"
          @hangleSelect="bindPickerChange"
        >
          <div
            class="picker"
            @click="handleToggle"
          >
            <span class="name">{{selectSubjectVal.name}}</span>
            <img
              src="http://p.htwx.net/wxtk/downToSet.png"
              alt=""
            />
          </div>
        </HtPicker>
      </div>

      <button
        class="history"
        @getuserinfo="bindGetUserInfo"
        open-type="getUserInfo"
      >
        <div class="wrapper">
          <div class="title">
            我的估分历史
          </div>
          <img src="http://p.htwx.net/wxtk/rightToSet.png" alt="">
        </div>
      </button>
    </div>


    <examItem v-if="scoreData.length > 0" :scoreList="scoreData"></examItem>
    <noData v-if="!isFirstForS && scoreData.length === 0">
      暂时没有估分
    </noData>
    <div class="noMoreData" v-if="!loadMoreForS">~~ 我是有底线的 ~~</div>
  </div>
</template>

<script>
import noData from './noData'
import examItem from './examItem'
import HtPicker from '@/components/HtPicker'
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    loadMoreForS: {
      type: Boolean,
      default: true
    },
    isFirstForS: {
      type: Boolean,
      default: true
    },
    scoreData: {
      type: Array,
      default: []
    }
  },
  data() {
      return {
        subIndex:0,
        selectSubjectVal:{},
      }
  },
  components: {
    noData,
    examItem,
    HtPicker
  },
  computed: {
    ...mapState(['loginInfo','choosedSubjectData','subjectInfo','selectSubjectData','currentIndex']),
    subjectList(){ //获取科目列表,设置默认科目
           var Obj= [...this.subjectInfo[this.choosedSubjectData.categoryId]];
            Obj.map(itm=>{
              if(itm.value == this.choosedSubjectData.subjectId){
                this.selectSubjectVal = {...itm};
              }
            });
            return this.subjectInfo[this.choosedSubjectData.categoryId]
    }
  },
  methods: {
    handleToggle() {
      this.$refs.picker.toggle()
    },
    bindGetUserInfo(e) {
      if (e.detail.userInfo) {
        if (uni.getStorageSync('userInfo') === '') {
          this.setUserInfo(e.detail.userInfo)
          uni.navigateTo({
            url: '/pages/mine/login'
          })
        } else {
          if (this.loginInfo.token) {
            uni.navigateTo({
              url: '/pages/home/estimateHistory'
            })
          } else {
            uni.navigateTo({
              url: '/pages/mine/login'
            })
          }
        }
      }
    },
    bindPickerChange({item, i}) {
      this.selectSubjectVal = { ...this.subjectList[i] }
      var obj = { ...this.selectSubjectData[this.currentIndex] }
      obj.subjectId = item.value
      this.setSelectSubject(obj)
      this.setChoosedSubject({ ...this.choosedSubjectData, subjectId: item.value })
      this.$emit('refreshScore')
    },
    updateView(){
        this.selectSubjectVal = this.subjectInfo[this.choosedSubjectData.categoryId][0];
    },
    ...mapMutations(['setUserInfo','setSelectSubject','setChoosedSubject'])
  }
}
</script>
<style lang="scss" scoped>
.estimate {

  box-sizing: border-box;
  padding: 30rpx;
  background: #fafafa;

  .mockTop{
        display: flex;
        position: relative;
        .changeSubject{
          line-height: 74rpx;
          display: flex;
          align-items: center;
          font-size: 0;
          .label{
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 40rpx;
            margin-right: 8rpx;
          }
          .picker{
            display: inline-block;
            .name{
              display: inline-block;
              font-size: 28rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #994425;
              line-height: 40rpx;
              max-width: 240rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: middle;
            }
            img{
              margin-left: 16rpx;
              width: 20rpx;
              height: 20rpx;
              vertical-align: middle;
            }
          }
        }
        .history {
          position: absolute;
          right: -30rpx;
            font-size: 28rpx;
            font-family: PingFangSC-Heavy, PingFang SC;
            font-weight: 800;
            color: #6F788C;
            line-height: 72rpx;
            width: 262rpx;
            height: 72rpx;
            background: #F3F4F7;
            border-radius: 36rpx 0px 0px 36rpx;

          .wrapper {
            display: flex;
            align-items: center;
            justify-content: center; 
            margin-left: 16rpx;;
            img{
              width: 36rpx;
              height: 36rpx;
              vertical-align: middle;
              margin-left:8rpx;
            }
          }
  
          .title {
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
      }
  }

/*   .history {
    font-size: 32rpx;
    font-weight: 800;
    color: rgba(111, 120, 140, 1);
    line-height: 74rpx;
    background: transparent;
    img {
      display: inline-block;
      width: 56rpx;
      height: 56rpx;
    }
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .title {
      display: flex;
      align-items: center;
    }
  } */
}
.noMoreData {
  text-align: center;
  font-size: 28rpx;
  line-height: 4;
  color: #9e9e9e;
}
</style>
