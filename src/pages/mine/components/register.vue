<template>
  <div class="register">
    <div class="inputWrapper">
      <input
        class="uni-input phone"
        type="number"
        v-model="phoneNum"
        @blur="handleBlur('phone')"
        @focus="handleFocus('phone')"
        placeholder="请输入手机号"
      />
      <p
        class="errorMsg"
        v-show="phoneError"
      >请输入正确手机号</p>
    </div>
    <div class="codeWrapper inputWrapper mt42">
      <input
        class="uni-input"
        type="number"
        v-model="codeNum"
        @blur="handleBlur('code')"
        @focus="handleFocus('code')"
        placeholder="请输入验证码"
      />
      <p
        class="errorMsg"
        v-show="codeError"
      >验证码有误，请重新输入</p>
      <span
        class="getCode"
        :class="[timer?'disableStyle':'']"
        @click="getCode"
      >{{codeStr}}</span>
    </div>
    <p class="desc">登录即自动注册，已阅读并同意<span
        class="link"
        @click="goAgreement"
      >《华图在线用户服务协议》</span></p>
    <button
      class="loginBtn"
      type="default"
      @click="loginFn"
    >登录</button>
    <img
      class="logo"
      src="http://p.htwx.net/wxTk/logo.png"
      alt="华图在线"
    />
  </div>
</template>

<script>
  import { sendCode, LoginFn } from '@/utils/api'
  import { mapMutations } from 'vuex'
  export default {
    data() {
      return {
        phoneNum: '',
        codeNum: '',
        phoneError: false,
        codeError: false,
        codeStr: '获取验证码',
        timer: null
      }
    },
    methods: {
      handleBlur(val) {
        switch (val) {
          case 'phone':
            const TEL_REGEXP = /^[1]([3-9])[0-9]{9}$/
            if (this.phoneNum.length > 0 && !TEL_REGEXP.test(this.phoneNum)) {
              this.phoneError = true
            }
            break
          case 'code':
            const CODE_REGEXP = /^\d{6}$/
            if (!CODE_REGEXP.test(this.codeNum) && this.codeNum.length > 0) {
              this.codeError = true
            }
            break
          default:
            throw new Error()
            break
        }
      },
      handleFocus(val) {
        switch (val) {
          case 'phone':
            this.phoneError = false
            break
          case 'code':
            this.codeError = false
            break
          default:
            this.phoneError = false
            this.codeError = false
            break
        }
      },
      // 获取验证码
      async getCode() {
        if (!this.phoneNum) {
          uni.showToast({
            title: '请输入手机号',
            icon: 'none',
            mask: true,
            duration: 1500
          })
          return
        }
        if (!this.timer) {
          try {
            const res = await sendCode(this.phoneNum)
            uni.showToast({
              title: '验证码已发送，请及时查收',
              icon: 'none'
            })
            let num = 60
            this.timer = setInterval(() => {
              num--
              this.codeStr = `重新获取(${num}s)`
              if (num === 0) {
                clearInterval(this.timer)
                this.timer = null
                this.codeStr = '重新发送'
              }
            }, 1000)
          } catch (error) {
            uni.showToast({
              title: error.message,
              icon: 'none'
            })
          }
        }
      },
      // 登录
      async loginFn() {
        if (!this.phoneError && !!this.phoneNum && !this.codeError && !!this.codeNum) {
          try {
            const res = await LoginFn({
              deviceToken: 'mobile',
              account: this.phoneNum,
              captcha: this.codeNum
            })
            this.setLoginInfo(res.data)
            this.setIsLogin()
            uni.navigateBack({
              delta: 1
            })
          } catch (error) {
            uni.showToast({
              title: error.message,
              icon: 'none'
            })
          }
        }
      },
      goAgreement() {
        uni.navigateTo({
          url: '/pages/mine/agreement'
        })
      },
      ...mapMutations(['setLoginInfo', 'setIsLogin'])
    },
    destroyed() {
      this.timer && clearInterval(this.timer)
    }
  }
</script>
<style lang='scss' scoped>
  .register {
    .mt42 {
      margin-top: 42rpx;
    }
    .uni-input {
      height: 100rpx;
      font-size: 32rpx;
      padding-left: 10rpx;
      &.phone {
        border-bottom: 1rpx solid #d8d8d8;
      }
    }
    .inputWrapper {
      position: relative;
      .errorMsg {
        position: absolute;
        left: 10rpx;
        bottom: -45rpx;
        height: 36rpx;
        font-size: 26rpx;
        font-weight: 400;
        color: rgba(254, 47, 65, 1);
        line-height: 36rpx;
      }
    }
    .codeWrapper {
      border-bottom: 1rpx solid #d8d8d8;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .getCode {
        width: 200rpx;
        background: #fff;
        border-left: 1px solid #d3d8e6;
        height: 44rpx;
        line-height: 44rpx;
        font-size: 26rpx;
        color: #000;
        font-weight: 800;
        padding: 0;
        text-indent: 30rpx;
      }
      .disableStyle {
        color: #d3d8e6;
      }
    }
    .desc {
      margin-top: 60rpx;
      height: 34rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: rgba(111, 120, 140, 1);
      line-height: 34rpx;
      .link {
        color: #5d9aff;
      }
    }
    button {
      margin-top: 40rpx;
      border-radius: 50rpx;
      font-size: 36rpx;
      width: 650rpx;
      height: 88rpx;
      padding: 0;
    }
    .loginBtn {
      background: linear-gradient(90deg, rgba(255, 228, 164, 1) 0%, rgba(255, 181, 39, 1) 100%);
      color: #ab5214;
      &::after {
        border: none;
      }
    }

    .logo {
      width: 212rpx;
      height: 48rpx;
      position: fixed;
      bottom: 40rpx;
      transform: translateX(-50%);
      left: 50%;
    }
  }
</style>