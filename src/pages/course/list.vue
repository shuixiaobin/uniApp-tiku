<template>
  <view>
    <navBar title="估分解析课" />

    <view class="list">
      <view v-for="item in list" :key="item.id" 
        hover-class="navigator-hover">
        <view class="item">
          <view class="header">
            <p class="ellipsis">{{item.title}}</p>
          </view>
          <view class="content">
            <p>{{item.videoType | typeFilter}} - {{time(item.liveStartTime,item.liveEndTime)}}</p>
            <p>主讲人：{{item.teacher}}</p>
          </view>
          <view class="footer">
            <view class="status">
              <p>
                <i :class="item.liveStatus ==1?'':'ing'"></i>
                <span>{{item.liveStatus| statusFilter}} </span>
              </p>
            </view>
            <view>
              <!-- <view class="enterPlay" :class="item.liveStatus == 1?'enterPlay':'enterPlay playing'">
                <navigator  v-if="item.liveStatus == 1" :url= urlPlay(item.bjyRoomId,item.classId,item.coursewareId)>进入直播间</navigator>
                <p v-else>直播{{item.liveStatus |statusFilter}}</p>
              </view> -->
              <!-- <view class="enterPlay" :class="item.liveStatus == 1?'enterPlay':'enterPlay playing'">
                <navigator  :url= urlPlay(item.bjyRoomId,item.classId,item.coursewareId)>进入直播间</navigator>
              </view> -->
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="toAPP">
      <view class="first">
        <view class="leftImg"></view>
        <view class="rightContent">
          <p>
            <span>华图在线APP</span>
            <span>去APP感受更好的听课体验</span>
          </p>
          <p>
            流程：下载/前往APP，在"学习"中听课
          </p>
        </view>
      </view>
      <button class="two download_btn" :session-from="zhichi" open-type="contact">
        <p>联系客服</p>
      </button>
      <!-- <view class="two">
        <p>回复1，下载APP</p>
      </view> -->
    </view>

  </view>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  import {formatDate1} from '@/utils/util'
  import navBar from '@/components/navBar.vue'
  import { zero_order, getAfterOutline,getLiveUrl } from './courseApi.js'
  export default {
    components: {
      navBar
    },
    data() {
      return {
        list:[],
        id:'97891'
      }
    },
    onLoad: function(options) {
      console.log(options)
      this.id =options.classId;
    },
    mounted(){

        zero_order({
          classId: this.id, //97854
          pageSource: '',
          source: 3,
          userName:this.userName
        }).then(res=>{
          if(res.code ==10000){
            return getAfterOutline({
              netClassId: this.id,
              userName:this.userName,
              page:1,
              pageSize:10,
              parentNodeId:0,
              terminal:21
            })
          }
        }).then(response =>{
            this.list =response.data.list
        }).catch(err=>{
          console.log(err)
        })
    },
    computed:{
      // urlPlay () { return (id,classId,wareId)=> `/pages/course/play?room=${id}&classId=${classId}&wareId=${wareId}`},
      time(){ 
        return (t,r)=>{ 
          return formatDate1(new Date(t*1000),'MM月dd日 hh:mm') +"—"+ formatDate1(new Date(r*1000),'hh:mm');
        }
      },
      zhichi(){
          return `sobot|${this.userInfo.nickName}|${this.userInfo.avatarUrl}|${this.zhichiParams}|transferAction=${this.transferAction}`
      },
      ...mapState({
        userName: state => state.loginInfo.uname
      }),
      ...mapState(['userInfo','zhichiParams','transferAction'])
    },
    methods: {
      // showToast(){
      //   uni.showToast({title: '直播未开始，请耐心等待',icon: 'none'})
      // },
      ...mapMutations(['customer'])
    },
    filters:{
      typeFilter(type){
        switch (Number(type)){
          case 2:
          return "直播"
          break;
          case 3:
          return "直播回放"
          break;
        }
      },
      statusFilter(type){
        switch (Number(type)){
          case 0:
          return "未开始"
          break;
          case 1:
          return "进行中"
          break;
          case 2:
          return "已结束"
          break;
        }
      }
    }
  }
</script>
<style lang='scss' scoped>

  .list {
    padding: 20rpx;
    padding-bottom: 300rpx;
    overflow: auto ;
    .item {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 12rpx 20rpx 0px rgba(54, 19, 17, 0.1);
      border-radius: 20rpx;
      padding: 30rpx;
      margin-top: 20rpx;
      .header {
        font-size: 30rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 42rpx;
      }
      .content {
        p {
          margin-top: 20rpx;
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(158, 158, 158, 1);
          line-height: 36rpx;
        }
      }
      .footer {
        margin-top: 12rpx;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .status {
          float: left;
          font-size: 24rpx;
          font-family: PingFangSC-Heavy, PingFang SC;
          font-weight: 800;
          color: #6f788c;
          line-height: 34rpx;
          i {
            display: inline-block;
            width: 8rpx;
            height: 8rpx;
            background-color: #83dd9b;
            border-radius: 4rpx;
            margin-right: 10rpx;
            vertical-align: middle;
          }
          .ing {
            /* 待直播 */
            background-color: #ffc579;
          }
        }
        .enterPlay {
          float: right;
          width: 200rpx;
          height: 80rpx;
          background: linear-gradient(#ffb771ff, #ffecbbff);
          border-radius: 40rpx;
          display: flex;
          display: -webkit-flex;
          align-items: center;
          justify-content: center;
          
            color: #90561c;
            font-size: 30rpx;
            font-family: PingFangSC-Heavy, PingFang SC;
            font-weight: 800;
            color: rgba(144, 86, 28, 1);
            line-height: 42rpx;
          
        }
        .playing {
          /* 待直播 */
          background: #f3f3f3;
          color: #3c3e43;
        }
      }
    }
  }

  .toAPP {
    position:fixed;
    bottom: 0rpx;
    //height: calc(100%- 1000rpx);//200rpx;
    width: calc(100% - 60rpx);
    box-shadow: 0rpx -20rpx 40rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 20rpx 20rpx 0px 0px;
    opacity: 0.9;
    padding: 18rpx 30rpx 26rpx 30rpx;
    background-color: #FFFFFF;
    .first {
      overflow: hidden;
      height: 85rpx;
      .leftImg {
        margin-left:20rpx;
        width: 80rpx;
        height: 80rpx;
        float: left;
        background: url('http://p.htwx.net/images/logo1.png') no-repeat center;
        background-size: 100%;
        margin-right: 10rpx;
      }
      .rightContent {
        float: left;
        line-height: 38rpx;
        p:first-child {
          span:first-child {
            font-size: 28rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 550;
            color: #4a4a4a;
            line-height: 40rpx;
            margin-right: 5rpx;
          }

          span:last-child {
            font-size: 32rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 550;
            color: #4a4a4a;
            line-height: 44rpx;
            height: 44rpx;
            border-left: 2rpx solid rgba(111, 120, 140, 0.6);
            padding-left:5rpx; 
          }
        }
        p:last-child {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(111, 120, 140, 1);
          line-height: 36rpx;
        }
      }
    }
    .two {
      margin-top: 16rpx;
      border-radius: 44rpx;
      background-color: #fe2f41;
      height: 80rpx;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      justify-content: center;
      p {
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 44rpx;
      }
    }
  }
</style>