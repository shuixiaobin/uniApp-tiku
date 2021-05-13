<template>
  <div class="tabWrapper">
    <div class="tabTitle">
      <span
        v-for="(item, index) in tabData"
        :key="item"
        :class="[
          actIndex === index ? 'hov' : '',
          index === 1 ? 'password' : ''
        ]"
        @click="change(index)"
        >{{ item }}</span
      >
    </div>
    <div class="tabContent">
      <register v-if="actIndex === 0"></register>
      <password v-else></password>
    </div>
    <button
      class="loginByWX"
      type="default"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
    >
      用微信绑定的手机号登录
    </button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { authorLogin } from '@/utils/api'
import password from './password'
import register from './register'
export default {
  components: {
    password,
    register
  },
  data() {
    return {
      tabData: ['注册/验证码登录', '密码登录'],
      actIndex: 0
    }
  },
  computed: {
    ...mapState(['choosedSubjectData', 'openid','qudaoInfo'])
  },
  methods: {
    change(i) {
      this.actIndex = i
    },
    getPhoneNumber(e) {
      let _this = this
      if (e.detail.encryptedData && e.detail.iv) {
        try {
          wx.checkSession({
            async success() {
              const res = await authorLogin({
                catgory: _this.choosedSubjectData.categoryId,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                openId: _this.openid,
                terminal: 21,
                promoterInfoId:_this.qudaoInfo,
              })
              console.log(res);
              
              _this.setLoginInfo(res.data)
              _this.setIsLogin()
              uni.navigateBack({
                delta: 1
              })
            },
            fail() {
              // session_key 已经失效，需要重新执行登录流程
              _this.getUserOpenId() //重新登录
            }
          })
        } catch (error) {
          uni.showToast({
            title: error.message,
            icon: 'none',
            duration: 1500
          })
        }
      }
    },
    ...mapMutations(['setLoginInfo', 'setIsLogin']),
    ...mapActions(['getUserOpenId'])
  }
}
</script>
<style lang="scss" scoped>
.tabWrapper {
  margin-top: 154rpx;
  padding: 0 50rpx;
  .tabTitle {
    display: flex;
    justify-content: center;
  }
  span {
    display: inline-block;
    text-align: center;
    height: 50rpx;
    font-size: 36rpx;
    font-weight: 400;
    color: rgba(111, 120, 140, 1);
    line-height: 50rpx;
    position: relative;
    &.password {
      margin-left: 94rpx;
    }
    &.hov {
      font-weight: 800;
      color: rgba(0, 0, 0, 1);
      &::after {
        content: '';
        position: absolute;
        width: 100rpx;
        height: 8rpx;
        background: rgba(254, 47, 65, 1);
        border-radius: 6rpx;
        bottom: -15rpx;
        transform: translateX(-50%);
        left: 50%;
      }
    }
  }
  .tabContent {
    margin-top: 80rpx;
  }
  .loginByWX {
    color: #6f788c;
    background: #fff;
    border: 1rpx solid rgba(111, 120, 140, 1);
    margin-top: 40rpx;
    border-radius: 50rpx;
  }
}
</style>
