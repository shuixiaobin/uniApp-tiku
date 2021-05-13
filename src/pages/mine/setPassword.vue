<template>
  <div class="setPassword">
    <navBar
      :title="'设置密码'"
      :hasHome="false"
    ></navBar>
    <div
      class="skip"
      @click="skip"
    >跳过 ></div>
    <div class="inputWrapper">
      <input
        class="uni-input phone"
        type="password"
        v-model="password"
        @blur="handleBlur"
        @focus="handleFocus"
        placeholder="输入6-20位新密码"
      />
      <p
        class="errorMsg"
        v-show="passwordError"
      >请输入正确格式密码</p>
    </div>
    <button
      class="loginBtn"
      type="default"
      @click="submitFn"
    >提交</button>
    <img
      class="logo"
      src="http://p.htwx.net/wxTk/logo.png"
      alt="华图在线"
    />
  </div>
</template>

<script>
  import navBar from '@/components/navBar.vue'
  export default {
    components: { navBar },
    data() {
      return {
        password: '',
        passwordError: false
      }
    },

    methods: {
      skip() {
        uni.navigateTo({
          url: '/pages/home/index'
        })
      },
      handleBlur() {
        const PASSWORD_REGEXP = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
        if (!PASSWORD_REGEXP.test(this.password) && this.password.length > 0) {
          this.passwordError = true
        }
      },
      handleFocus() {
        this.passwordError = false
      },
      submitFn() {
        if (!this.passwordError && this.password.length > 0) {
          // 设置密码
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  .setPassword {
    .skip {
      width: 96rpx;
      margin-top: 40rpx;
      height: 44rpx;
      text-align: right;
      font-size: 32rpx;
      font-weight: 400;
      color: rgba(155, 155, 155, 1);
      line-height: 44rpx;
      margin-left: 614rpx;
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
      padding: 0 50rpx;
      margin-top: 216rpx;
      .errorMsg {
        position: absolute;
        left: 50rpx;
        bottom: -45rpx;
        height: 36rpx;
        font-size: 26rpx;
        font-weight: 400;
        color: rgba(254, 47, 65, 1);
        line-height: 36rpx;
      }
    }
    .loginBtn {
      width: 650rpx;
      background: linear-gradient(90deg, rgba(255, 228, 164, 1) 0%, rgba(255, 181, 39, 1) 100%);
      color: #ab5214;
      margin-top: 120rpx;
      border-radius: 50rpx;
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