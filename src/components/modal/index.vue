<template>
  <div class="modal">
    <div class="container">
      <h3
        class="title"
        v-if="!!title"
      >
        <div v-for="(item, index) in titleVal" :key="index">{{item}}</div>
      </h3>
      <p
        v-if="!!content"
        class="content mt10"
      >{{content}}</p>
      <div class="btnWrapper" :style="{'margin-top': showCancel ? '44rpx' : '75rpx'}">
        <button
          v-if="showCancel"
          class="cancelBtn btn"
          :style="cancelStyle"
          @click="cancelFn"
        >{{cancelText}}</button>
        <button
          class="confirmBtn btn"
          :style="confirmStyle"
          @click="confirmFn"
        >{{confirmText}}</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: [String, Array],
        default: ''
      },
      content: {
        type: String,
        default: ''
      },
      showCancel: {
        type: Boolean,
        default: true
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      cancelStyle: {
        type: String,
        default: ''
      },
      confirmStyle: {
        type: String,
        default: 'background: linear-gradient(90deg, rgba(255, 206, 164, 1) 0%, rgba(255, 25, 25, 1) 100%)'
      }
    },
    computed: {
      titleVal () {
        if (typeof this.title === 'string') {
          return [this.title]
        }
        return this.title
      }
    },
    methods: {
      // 取消
      cancelFn() {
        this.$emit('cancelCB')
      },
      // 确定
      confirmFn() {
        this.$emit('confirmCB')
      }
    }
  }
</script>
<style lang='scss' scoped>
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.25);
    .container {
      width: 670rpx;
      height: auto;
      background: rgba(255, 255, 255, 1);
      border-radius: 30rpx;
      padding: 40rpx 0;
      box-sizing: border-box;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      .title {
        // width: 592rpx;
        font-size: 36rpx;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
        line-height: 50rpx;
        text-align: center;
      }
      .content {
        font-size: 26rpx;
        font-weight: 500;
        color: rgba(169, 169, 169, 1);
        line-height: 36rpx;
        text-align: center;
      }
      .btnWrapper {
        width: 100%;
        margin-top: 44rpx;
        display: flex;
        justify-content: space-between;
        .btn {
          flex: 1;
          box-sizing: content-box;
          margin: 0 55rpx;
          border-radius: 54rpx;
          font-size: 36rpx;
          font-weight: 500;
          &.cancelBtn {
            background: rgba(232, 232, 232, 1);
            color: rgba(169, 169, 169, 1);
          }
          &.confirmBtn {
            background: linear-gradient(90deg, rgba(255, 206, 164, 1) 0%, rgba(255, 25, 25, 1) 100%);
            color: #fff;
          }
        }
      }
    }
  }
</style>