<template>
  <view class="container">
    <view class="box">
      <view class="top">
        <view class="title">
          <view>{{titleText}}</view>
        </view>
        <view class="step">步骤演示</view> 
      </view>
      <view class="step-reveal" :style="{'background-color': ispad ? 'transparent': '#EDEDED'}">
        <!-- <image mode="aspectFit" class="pic" src="{{imgUrl}}"></image> -->
        <view v-if="switchBck" class="pic" :style="{'background-image': 'url(' + imgUrl + ')'}"></view>
        <image v-else mode="aspectFit" class="pic" :src="imgUrl" @load="handleLoad" @error="handleError" /> 
      </view>
      <view class="bottom">
        <button :send-message-path="messagePath" class="nav-service" style="width:438rpx;height:88rpx;" open-type="contact">{{buttonText}}</button>
        <view v-if="type == '8'" class="tip">添加客服微信，回复所考项目加“面试”即可领取。如“国考面试”等。</view>
      </view>
      <image class="sign" src="http://tiku.huatu.com/cdn/pandora/img/c53711f3-ee9f-4795-9dbb-09c81775e274..png"></image>
    </view>
  </view>
</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import navBar from '@/components/navBar'
const defaultImgUrl = 'http://p.htwx.net/mp-ztk/8.gif'
export default {
  data () {
    return {
      imgUrl: 'http://tiku.huatu.com/cdn/pandora/img/e6d98eed-acf2-4aa5-be5c-c3b5dd90009e..gif',
      titleText: '领取电子资料',
      buttonText: '去添加老师',
      messagePath: '',
      ispad: false,
      type: 8,
      switchBck: false
    }
  },
  onLoad (e) {
    let queries = []
    Object.keys(e).forEach(key => {
      queries.push(`${key}=${e[key]}`)
    })
    const model = wx.getSystemInfoSync().model.toLowerCase()
    const ispad = model.search('ipad') > -1

    const messagePath = '/pages/index/index?' + queries.join('&')
    this.messagePath = messagePath
    this.ispad = ispad
    this.buttonText = `回复${e.type} 领取`
    this.imgUrl = `http://p.htwx.net/mp-ztk/${e.type}.gif`
    this.type = e.type
  },
  methods: {
    handleLoad () {
      this.switchBck = true
    },
    handleError () {
      if (this.imgUrl !== defaultImgUrl) {
        this.imgUrl = defaultImgUrl
        this.switchBck = true
      }
    },
  },
  components: {
    navBar,
  }
}
</script>

<style>
page {
  width: 100%;
  height: 100%;
}

.container {
  background: url('http://tiku.huatu.com/cdn/pandora/img/18d70fe1-5de8-4cc1-9af7-c7ea5bbdbe9e..png') no-repeat;
  width: 100%;
  height: 100%;
  position: relative;
  padding-top: 80rpx;
  box-sizing: border-box;
  background-size: cover;
}

.box {
  padding: 184rpx 80rpx 278rpx;
  /* width: 640rpx;
  height: 1280rpx; */
  background: #fff;
  border-radius: 16rpx;
  text-align: center;
  margin: 0 auto;
  position: fixed;
  top: 80rpx;
  left: 80rpx;
  right: 56rpx;
  bottom: 132rpx;
}

.top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.title {
  width: 240rpx;
  height: 66rpx;
  border-radius: 0 0 34rpx 34rpx;
  background: linear-gradient(0, #FFCE70 0, #FF7B4C 100%);
  color: #fff;
  font-size: 32rpx;
  line-height: 66rpx;
  display: inline-block;
  font-weight: bold;
}

.step {
  font-size: 32rpx;
  line-height: 44rpx;
  margin: 40rpx 0 20rpx 0;
  font-weight: bold;
}

.step-reveal {
  width:100%;
  height:100%;
  background: #f3f3f3;
  margin: 0 auto;
}

.step-reveal .pic {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: contain;
}

.bottom {
  position: absolute;
  bottom: 60rpx;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
}

.nav-service {
  width:438rpx;
  height:88rpx;
  background:rgba(255,202,14,1);
  box-shadow:0px 20px 20px 0px rgba(201,108,0,0.19);
  border-radius:44rpx;
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
  padding: 0;
  line-height: 88rpx;
  margin: 0 auto;
}

.tip {
  font-size: 28rpx;
  margin-top: 30rpx;
  line-height: 40rpx;
  padding: 0 30rpx;
}

.sign {
  width: 236rpx;
  height: 248rpx;
  position: absolute;
  right: -54rpx;
  bottom: -132rpx;
}
</style>