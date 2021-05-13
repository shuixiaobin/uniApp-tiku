<template>
  <view class="htPicker">
    <slot></slot>
    <div :class="[visible?'show':'hide']">
      <view
        class="module"
        @click.stop="toggle"
      >
      </view>
      <scroll-view
        :scroll-y="true"
        class="picker_box"
      >
        <i
          class="iconfont iconbianzu"
          @click="toggle"
        ></i>
        <template v-if="list&&list.length>0">
          <view
            class="picker_option"
            :class="{'red': selectName === item.name}"
            @click.stop="check({item, i})"
            v-for="(item, i) in list"
            :key="item[value_key]"
          >{{item[label_key]}}</view>
        </template>
        <view
          v-else
          class="no_data"
        >暂无数据</view>
      </scroll-view>
    </div>
  </view>
</template>

<script>
  export default {
    name: 'htPicker',
    props: {
      selectName: {
        type: String,
        default: '',
      },
      list: {
        type: Array,
        default: [],
      },
      label_key: {
        type: String,
        default: 'label',
      },
      value_key: {
        type: String,
        default: 'value',
      },
    },

    data() {
      return {
        visible: false,
      }
    },

    methods: {
      toggle() {
        //抛出展示事件
        if (!this.visible) {
          this.$emit('show')
        }
        this.visible = !this.visible
      },
      check(val) {
        this.$emit('hangleSelect', val)
        this.toggle()
      },
    },
  }
</script>

<style scoped lang="scss">
  $defaultColor: #9f9fa1;
  $defaultFont: #5b5c67;
  $activeColor: #BB2D21;
  .htPicker {
    .module {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgb(0, 0, 0);
      opacity: 0;
      z-index: 100;
      transition: opacity 0.3s;
    }
    .picker_box {
      width: 750rpx;
      height: 720rpx;
      padding: 40rpx 0;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 -30rpx 30rpx 0 rgba(102, 5, 0, 0.15);
      border-radius: 20rpx 20rpx 0 0;
      position: fixed;
      bottom: -100%;
      left: 0;
      z-index: 101;
      overflow: scroll;
      transition: bottom 0.3s;
      .picker_option {
        padding: 20rpx 120rpx;
        color: #5b5c67;
        font-size: 32rpx;
        font-weight: 500;
        text-align: center;
        &.red {
          color: $activeColor;
        }
      }
      .iconfont {
        position: absolute;
        right: 40rpx;
        top: -25rpx;
        font-size: 22rpx;
      }
      .no_data {
        text-align: center;
        padding-top: 80rpx;
      }
    }
    .show {
      .module {
        opacity: 0.5;
      }
      .picker_box {
        bottom: 0;
      }
    }
    .hide {
      .module {
        top: -100%;
      }
    }
  }
</style>