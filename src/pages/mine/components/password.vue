<template>
  <div class="passwordWrapper">
    <div class="inputWrapper">
      <input
        class="uni-input phone"
        v-model="username"
        @focus="handleFocus('username')"
        placeholder="请输入手机号/邮箱/用户名"
      />
      <p
        class="errorMsg"
        v-show="usernameError"
      >账号格式有误，请重新输入</p>
    </div>
    <div class="inputWrapper mt42">
      <input
        class="uni-input"
        type="password"
        v-model="password"
        @blur="handleBlur('password')"
        @focus="handleFocus('password')"
        placeholder="请输入密码"
      />
      <p
        class="errorMsg"
        v-show="passwordError"
      >密码格式有误，请重新输入</p>
    </div>
    <p
      class="desc"
      @click="goForget"
    >忘记密码？</p>
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
  import { LoginFn } from '@/utils/api'
  import { mapMutations } from 'vuex'
  export default {
    data() {
      return {
        username: '',
        password: '',
        usernameError: false,
        passwordError: false
      }
    },
    methods: {
      goForget() {
        uni.navigateTo({
          url: '/pages/mine/forgetPassword'
        })
      },
      handleBlur(val) {
        switch (val) {
          case 'password':
            if (this.password.length > 0 && this.password.length < 6) {
              this.passwordError = true
            }
            break
          default:
            throw new Error()
            break
        }
      },
      handleFocus(val) {
        switch (val) {
          case 'username':
            this.usernameError = false
            break
          case 'password':
            this.passwordError = false
            break
          default:
            this.usernameError = false
            this.passwordError = false
            break
        }
      },
      async loginFn() {
        if (!this.usernameError && !this.passwordError && this.password.length > 0 && this.username.length > 0) {
          // 登录
          try {
            const res = await LoginFn({
              deviceToken: 'mobile',
              account: this.username,
              password: this.password
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
      ...mapMutations(['setLoginInfo', 'setIsLogin'])
    }
  }
</script>
<style lang='scss' scoped>
  .passwordWrapper {
    .mt42 {
      margin-top: 42rpx;
    }
    .uni-input {
      height: 100rpx;
      font-size: 32rpx;
      padding-left: 10rpx;
      border-bottom: 1rpx solid #d8d8d8;
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
        width: 190rpx;
        background: #fff;
        border: none;
        border-left: 1rpx solid #d3d8e6;
        height: 44rpx;
        line-height: 44rpx;
        font-size: 32rpx;
        color: #000;
        font-weight: 800;
        padding: 0;
        text-indent: 30rpx;
      }
    }
    .desc {
      margin-top: 60rpx;
      height: 34rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: rgba(111, 120, 140, 1);
      line-height: 34rpx;
      text-indent: 10rpx;
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
    .loginByWX {
      color: #6f788c;
      background: #fff;
      border: 1rpx solid rgba(111, 120, 140, 1);
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