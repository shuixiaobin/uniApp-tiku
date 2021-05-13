<template>
  <div class="userInfo">
    <navBar :title="'个人账号'"></navBar>
    <div class="container">
      <img
        class="br50"
        :src="userInfo.avatarUrl"
        :alt="userInfo.nickName"
      >
      <p class="nickName">{{userInfo.nickName}}</p>
      <div class="htInfo">
        <span>用户名</span>
        <span>{{loginInfo.uname}}</span>
      </div>
      <div class="htInfo">
        <span>手机号</span>
        <span>{{loginInfo.mobile}}</span>
      </div>
    </div>
    <button
      type="default"
      class="switchAccount"
      @click="gologin"
    >切换账号</button>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import navBar from '@/components/navBar'
  export default {
    components: { navBar },
    computed: {
      ...mapState(['userInfo', 'loginInfo'])
    },
    methods: {
      gologin() {
        uni.navigateTo({
          url: '/pages/mine/login'
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  .userInfo {
    background: #f0f2f5;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .container {
      width: 710rpx;
      height: 340rpx;
      margin: 90rpx auto 0;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 10rpx 30rpx 0px rgba(171, 171, 171, 0.3);
      border-radius: 20rpx;
      position: relative;
      padding: 40rpx;
      box-sizing: border-box;
      img {
        position: absolute;
        transform: translateX(-50%);
        left: 50%;
        width: 140rpx;
        height: 140rpx;
        border: 2rpx solid rgba(155, 155, 155, 1);
        top: -70rpx;
      }
      .nickName {
        text-align: center;
        height: 50rpx;
        font-size: 36rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 50rpx;
        margin-top: 60rpx;
      }
    }
    .htInfo {
      height: 40rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: rgba(111, 120, 140, 1);
      line-height: 40rpx;
      margin-top: 40rpx;
      display: flex;
      justify-content: space-between;
    }
    .switchAccount {
      margin: 80rpx auto 0;
      width: 650rpx;
      height: 88rpx;
      background: rgba(255, 255, 255, 1);
      border-radius: 50rpx;
      font-size: 36rpx;
      font-weight: 400;
      color: rgba(155, 155, 155, 1);
      border: 1rpx solid rgba(155, 155, 155, 1);

      &::after {
        border: none;
      }
    }
  }
</style>