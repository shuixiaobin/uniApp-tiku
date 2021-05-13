<template>
  <view :style="{paddingTop:`${titleBarHeight+statusBarHeight}px`}">
    <view
      class="status_bar"
      :style="{height:`${titleBarHeight}px`,paddingTop:`${statusBarHeight}px`,backgroundColor:colorObj.bgColor}"
    >
      <view
        v-if="showIcon"
        class="leftIcon"
        :style="{background:colorObj.iconBg,color:colorObj.iconColor}"
        :class="[hasHome ? 'border' : '']"
      >
        <view
          class="iconfont iconfanhui"
          v-if="hasBack"
          @click="goback"
        />
        <text
          class="line"
          v-if="hasHome&&hasBack"
        >|</text>
        <view
          class="iconfont iconhome"
          v-if="hasHome"
          @click="goHome"
        />
      </view>
      <view
        v-else
        class="leftIcon"
      >
        <!-- 登录/注册 -->
        <img
          class="avatar br50"
          v-if="userInfo.avatarUrl"
          :src="userInfo.avatarUrl"
          :alt="userInfo.nickName"
          @click="goInfo"
        >
        <button
          v-else-if="canIUseGetUserProfile"
          @click="bindGetUserInfo"
          open-type="getUserProfile"
          class="authorBtn"
        >登录/注册</button>
        <button
          v-else
          @getuserinfo="bindGetUserInfo"
          open-type="getUserInfo"
          class="authorBtn"
        >登录/注册</button>
      </view>
      <view
        class="title ellipsis"
        :style="{height:`${titleBarHeight}px`,lineHeight:`${titleBarHeight}px`,color:colorObj.iconColor}"
      >{{title}}</view>
    </view>
  </view>

</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  export default {
    props: {
      handleBack: {
        type: Function
      },
      hasBack: {
        typeL: Boolean,
        default: true
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: '华图智题库'
      },
      hasHome: {
        type: Boolean,
        default: true
      },
      colorObj: {
        type: Object,
        default: () => ({
          bgColor: '#fff',
          iconBg: '#fff',
          iconColor: '#000'
        })
      }
    },
    data() {
      return {
        statusBarHeight: 0,
        titleBarHeight: 0,
        canIUseGetUserProfile: false
      }
    },
    computed: {
      ...mapState(['userInfo', 'loginInfo'])
    },
    created() {
      if (wx.getUserProfile) {
        this.canIUseGetUserProfile = true
      }
      uni.getSystemInfo({
        success: res => {
          this.statusBarHeight = res.statusBarHeight
          if (res.platform == 'ios') {
            this.titleBarHeight = 44
          } else if (res.platform == 'android') {
            this.titleBarHeight = 48
          } else {
            this.titleBarHeight = 44
          }
        }
      })
    },
    methods: {
      goback() {
        let next
        const stop = (pm = false) => (next = pm)
        this.$emit('goBack', stop)
        var historys= getCurrentPages();
        if(next === undefined && historys.length < 2){
          uni.redirectTo({url: '/pages/home/index'});
        }else if (next instanceof Promise) {
          next.then(() => uni.navigateBack({ delta: 1 }))
        } else {
          if (next !== false) {
            uni.navigateBack({ delta: 1 })
          }
        }
      },
      goHome() {
        let next
        const stop = (pm = false) => (next = pm)
        this.$emit('goHome', stop)
        if (next instanceof Promise) {
          next.then(() => uni.reLaunch({ url: '/pages/home/index' }))
        } else {
          if (next !== false) {
            uni.reLaunch({ url: '/pages/home/index' })
          }
        }
      },
      bindGetUserInfo(e) {
        if (this.canIUseGetUserProfile) {
          uni.getUserProfile({
            desc: '用于完善用户资料',
            success: (res) => {
              this.setUserInfo(res.userInfo)
              uni.setStorageSync('userInfo', JSON.stringify(res.userInfo))
              uni.navigateTo({
                url: '/pages/mine/login'
              })
            }
          })
        } else {
          if (e.detail.userInfo) {
            this.setUserInfo(e.detail.userInfo)
            uni.setStorageSync('userInfo', JSON.stringify(e.detail.userInfo))
            uni.navigateTo({
              url: '/pages/mine/login'
            })
          }
        }
      },
      goInfo() {
        if (this.loginInfo.token) {
          uni.navigateTo({
            url: '/pages/mine/userInfo'
          })
        } else {
          uni.navigateTo({
            url: '/pages/mine/login'
          })
        }
      },
      ...mapMutations(['setUserInfo'])
    }
  }
</script>
<style lang='scss' scoped>
  .status_bar {
    width: 100%;
    display: flex;
    align-items: center;
    background: #fff;
    position: fixed;
    top: 0;
    z-index: 9999;
    .leftIcon {
      margin-left: 8px;
      font-size: 18px;
      width: 86px;
      height: 30px;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 16px;
      color: #000;
      &.border {
        border: 1rpx solid rgba(0, 0, 0, 0.08);
        justify-content: center;
      }
      .iconfont {
        padding: 3px;
      }
      .line {
        color: rgba(0, 0, 0, 0.08);
        padding: 0 9px;
      }
      .authorBtn {
        padding: 0;
        margin: 0;
        background: transparent;
        color: #000;
        font-size: 16px;
        &::after {
          border: none;
        }
      }
      .avatar {
        width: 30px;
        height: 30px;
      }
    }
    .title {
      position: absolute;
      text-align: center;
      max-width: 220px;
      transform: translateX(-50%);
      left: 50%;
      font-size: 19px;
      color: #2c2b2b;
      font-weight: 600;
    }
  }
</style>