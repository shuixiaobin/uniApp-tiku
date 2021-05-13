<template>
  <div
    class="areaGroup"
    :class="[areaGroupFlag?'show':'hide']"
  >
    <div
      class="mask"
      @click="toggleShowFn"
    ></div>
    <div class="areaWrapper">
      <div class="titleWrapper">
        <h3 class="title">具体时间</h3>
        <i
          class="iconfont iconbianzu"
          @click="toggleShowFn"
        ></i>
      </div>
      <div class="container">
        <div
          class="everyTime"
          v-for="(item, index) in areaGroupData"
          :key="index"
        >
          <div class="content">
            {{item.areaList | formateAreaStr}}：{{item.timeInfo.slice(5)}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  export default {
    props: {
      areaGroupData: {
        type: Array,
        default: () => []
      },
      areaGroupFlag: {
        type: Boolean,
        default: false
      }
    },
    filters: {
      formateAreaStr(arr) {
        let str = arr.reduce((prev, item) => (prev += `${item.value}/`), '')
        return str.substr(0, str.length - 1)
      }
    },
    methods: {
      toggleShowFn() {
        this.$emit('update:closeMore', false)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .areaGroup {
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
    z-index: 98;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background: rgb(0, 0, 0);
    }
    .areaWrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 30rpx 0 40rpx 0;
      background: rgba(255, 255, 255, 1);
      border-radius: 22rpx 22rpx 0px 0px;
      .titleWrapper {
        position: relative;
        .title {
          text-align: center;
          height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Heavy, PingFang SC;
          font-weight: 800;
          color: rgba(0, 0, 0, 1);
          line-height: 40rpx;
        }
        .iconbianzu {
          position: absolute;
          font-size: 16rpx;
          right: 30rpx;
          top: 0;
          color: #e2e0e3;
          padding: 10rpx;
        }
      }
      .container {
        padding: 30rpx 40rpx 80rpx 40rpx;
        max-height: 600rpx;
        overflow-y: scroll;
        .everyTime {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          font-size: 24rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(105, 105, 105, 1);
          line-height: 34rpx;
          .content {
            margin-bottom: 20rpx;
            display: flex;
            align-items: center;
          }
        }
      }
    }
    &.show {
      transition: transform 0.05s ease;
      transform: translateY(0%);
      .mask {
        transition: opacity 0.1s ease 0.1s;
        opacity: 0.2;
      }
      .areaWrapper {
        transition: transform 0.2s ease 0.1s;
        transform: translateY(0%);
      }
    }
    &.hide {
      transition: transform 0.1s ease 0.2s;
      transform: translateY(100%);
      .mask {
        transition: opacity 0s ease;
        opacity: 0;
      }
      .areaWrapper {
        transition: transform 0.2s ease;
        transform: translateY(100%);
      }
    }
  }
</style>
