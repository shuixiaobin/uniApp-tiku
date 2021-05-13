<template>
  <movable-area
    class="drag-sort oh"
    :style="{height: currentListLength + 'px'}"
    id="drag"
  >
    <movable-view
      v-for="(item, index) in currentList"
      :key="index"
      :x="0"
      :y="item.y"
      direction="vertical"
      disabled
      damping="40"
      :animation="active !== index"
      class="drag-sort-item"
      style="height:55px"
      :class="{'active': active === index, 'vh-1px-t': item.index > 0}"
    >
      <view class="touch-tight">
        <view class="ico_drag iconfont iconqiehuanshunxu"></view>
      </view>
      <view class="item">{{item[props.label]}}</view>
      <i
        @click="onDelete(index,item.name)"
        class="iconfont iconshanchu"
      ></i>
    </movable-view>
    <movable-view
      class="touch"
      :x="0"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      catchtouchstart
      catchtouchmove
      catchtouchend
    ></movable-view>
  </movable-area>
</template>

<script>
  export default {
    name: 'drag-sort',
    data() {
      return {
        height: 55, // 高度
        currentList: [],
        active: -1, // 当前激活的item
        itemIndex: 0, // 当前激活的item的原index
        topY: 0, // 距离顶部的距离
        deviationY: 0 // 偏移量
      }
    },
    computed: {
      currentListLength() {
        return this.currentList.length * this.height
      }
    },
    props: {
      list: {
        type: Array,
        default: () => {
          return []
        }
      },
      props: {
        type: Object,
        default: () => {
          return {
            label: 'label',
            value: 'value'
          }
        }
      }
    },
    watch: {
      list(val) {
        this.onUpdateCurrentList()
      }
    },
    created() {
      this.onUpdateCurrentList()
    },
    methods: {
      onDelete(i, name) {
        this.$emit('deleteFn', { i, name })
      },
      onUpdateCurrentList() {
        let arr = []
        for (const key in this.list) {
          arr.push({
            ...this.list[key],
            index: Number(key),
            y: key * this.height,
            animation: true
          })
        }
        this.currentList = arr
      },
      touchstart(e) {
        // 计算y轴点击位置
        var query = wx.createSelectorQuery().in(this)
        query.select('#drag').boundingClientRect()
        query.exec(res => {
          this.topY = res[0].top
          let touchY = e.mp.touches[0].clientY - res[0].top
          this.deviationY = touchY % this.height
          // console.log(touchY)
          for (const key in this.currentList) {
            if (this.currentList[key].index * this.height < touchY && (this.currentList[key].index + 1) * this.height > touchY) {
              this.active = Number(key)
              this.itemIndex = this.currentList[key].index
              break
            }
          }
        })
      },
      touchmove(e) {
        if (this.active < 0) return
        let touchY = e.mp.touches[0].clientY - this.topY - this.deviationY
        // console.log(touchY)
        this.currentList[this.active].y = touchY
        for (const key in this.currentList) {
          // 跳过当前操作的item
          if (this.currentList[key].index !== this.currentList[this.active].index) {
            if (this.currentList[key].index > this.currentList[this.active].index) {
              if (touchY > this.currentList[key].index * this.height - this.height / 2) {
                this.currentList[this.active].index = this.currentList[key].index
                this.currentList[key].index = this.currentList[key].index - 1
                this.currentList[key].y = this.currentList[key].index * this.height
                break
              }
            } else {
              if (touchY < this.currentList[key].index * this.height + this.height / 2) {
                this.currentList[this.active].index = this.currentList[key].index
                this.currentList[key].index = this.currentList[key].index + 1
                this.currentList[key].y = this.currentList[key].index * this.height
                break
              }
            }
          }
        }
      },
      touchend(e) {
        if (this.active < 0) return
        if (this.itemIndex !== this.currentList[this.active].index && this.active > -1) {
          this.$emit('change', {
            // 起始索引
            startIndex: this.active,
            // 结束索引
            endIndex: this.currentList[this.active].index
          })
        }
        this.currentList[this.active].animation = true
        this.currentList[this.active].y = this.currentList[this.active].index * this.height
        this.active = -1
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import './1px.scss';
  .drag-sort {
    width: 100%;
    box-shadow: 0px 5px 5px 0px rgba(171, 171, 171, 0.3);
    border-radius: 20rpx;
  }
  .drag-sort-item {
    position: absolute !important;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0;
    margin: 0;
    background: #fff;
    box-sizing: border-box;
    .item {
      flex: 1;
      color: #3c3e43;
      font-size: 32rpx;
    }
    .touch-tight {
      display: flex;
      justify-content: center;
    }
  }
  .touch {
    height: 100%;
    width: 260px;
  }
  .ico_drag {
    display: inline-block;
    padding: 15px;
    font-size: 30rpx;
    color: #d4d9e3;
  }
  .iconshanchu {
    padding: 15px;
    font-size: 30rpx;
    color: #ffdde0;
  }
  .active {
    box-shadow: 0 0 40rpx #dddddd;
    z-index: 99;
  }
</style>
