<template>
  <div class="job-select">
    <div
      class="input-wrapper"
      :class="{'foucs': isOpen}"
      @click="show"
    >
      <input
        class="inp-text"
        type="text"
        disabled
        :value="value"
        :placeholder="placeholderStr"
      />
      <i
        class="icon"
        :class="{'select-icon': isOpen}"
      ></i>
    </div>
    <div
      class="select-list"
      :class="{visibily: isOpen}"
    >
      <div
        class="max-h"
        :class="{'ani-slide': isOpen}"
      >
        <div
          class="select-item"
          v-for="item in selectData"
          :key="item.value"
          @click.stop="handleSelect(item)"
        >{{item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      placeholderStr: {
        type: String,
        default: '请选择',
      },
      value: {
        type: String,
        default: '',
      },
      selectData: {
        type: Array,
        default: () => [],
      },
      isOpen: {
        type: Boolean,
        default: false,
      },
    },

    methods: {
      show() {
        this.isOpen ? this.$emit('close') : this.$emit('open')
      },
      handleSelect({ title, value }) {
        this.$emit('getNextSelect', { title, value })
      },
    },
  }
</script>
<style lang='scss' scoped>
  .job-select {
    position: relative;
    .input-wrapper {
      height: 76rpx;
      background: #ffffff;
      border-radius: 44rpx;
      border: 2rpx solid #e1e1e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 48rpx;
      margin-bottom: 32rpx;
      &.foucs {
        box-shadow: 0px 10rpx 20rpx 0px rgba(225, 182, 182, 0.3);
        border: 2rpx solid #ffeff5;
      }
      .inp-text {
        width: 90%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4a4a4a;
        line-height: 40rpx;
        background: #fff;
      }
      .icon {
        width: 22rpx;
        height: 12rpx;
        background: url('http://p.htwx.net/wxTk/triangle.png') no-repeat center;
        background-size: 100% 100%;
        &.select-icon {
          background: url('http://p.htwx.net/wxTk/triangle-act.png') no-repeat center;
          background-size: 100% 100%;
        }
      }
    }
    .select-list {
      padding: 20rpx 0;
      position: relative;
      z-index: 15;
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 4rpx 12rpx 0px rgba(225, 182, 182, 0.3);
      border-radius: 16rpx;
      border: 2rpx solid #ffd0e2;
      transition: all 0.1s ease-in;
      visibility: hidden;
      padding: 0;
      margin-bottom: 0;
      box-sizing: border-box;
       &.visibily {
        visibility: visible;
        padding: 20rpx 0;
        margin-bottom: 28rpx;
      }
      .max-h {
        overflow-y: auto;
        max-height: 0;
        transition: max-height 0.1s ease-in;
      }
      .ani-slide {
        max-height: 500px;
        transition: max-height 0.2s ease-in;
      }
      &::before {
        content: '';
        position: absolute;
        top: -40rpx;
        right: 100rpx;
        width: 0;
        height: 0;
        border: 28rpx solid transparent;
        border-bottom: 16rpx solid #fff;
        z-index: 2;
      }
      &::after {
        content: '';
        position: absolute;
        top: -44rpx;
        right: 100rpx;
        width: 0;
        height: 0;
        z-index: 1;
        border: 28rpx solid transparent;
        border-bottom: 16rpx solid #ffd0e2;
      }
      .select-item {
        display: flex;
        align-items: center;
        line-height: 40rpx;
        padding: 16rpx 48rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4a4a4a;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
</style>