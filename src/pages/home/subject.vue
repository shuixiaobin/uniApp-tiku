<template>
  <div class="subject">
    <navBar :title="'选择科目'"></navBar>
    <ul class="subjectWrapper">
      <li
        class="subjectItem mb20"
        :class="[item.id===14?'disabled':'']"
        @click="selectFn(item)"
        v-for="item in subjectChildrens"
        :key="item.id"
      >{{item.id===14?`${item.name}（敬请期待）`:item.name}}</li>
    </ul>
    <div
      class="areaWrapper"
      :class="[show?'slideUp':'slideDown']"
    >
      <div
        class="shandow"
        :class="[show?'fadeIn':'fadeOut']"
      ></div>
      <div
        class="content"
        :class="[show?'slideUp':'slideDown']"
      >
        <div class="title">
          <h3 class="ellipsis">报考区域</h3>
          <i
            class="iconfont iconbianzu"
            @click="close"
          ></i>
        </div>
        <div class="container">
          <span
            class="item ellipsis"
            @click="selectArea(each)"
            v-for="each in areaData"
            :key="each.id"
          >{{each.name}}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { debounce } from '@/utils/util'
  import navBar from '@/components/navBar'
  import { getArea } from '@/utils/api'
  import { mapState, mapMutations } from 'vuex'
  export default {
    components: { navBar },
    data() {
      return {
        show: false,
        categoryId: '',
        categoryName: '',
        areaData: [],
        selectData: {
          categoryId: null,
          subjectId: null,
          areaId: null,
          name: ''
        }
      }
    },
    computed: {
      ...mapState(['subjectChildrens', 'selectSubjectData'])
    },
    onLoad(options) {
      const { id, name } = options
      this.selectData.categoryId = id
      this.selectData.name = name
      this.categoryId = id
      this.categoryName = name
    },
    methods: {
      selectFn: debounce(async function({ id, name }) {
        // 如果为申论直接返回
        if (id === 14) return
        try {
          const res = await getArea({
            catgory: this.categoryId,
            subject: id
          })
          this.areaData = res.data.areas
          this.selectData.subjectId = id
          if (this.selectData.name !== name) {
            this.selectData.name = `${this.selectData.name}-${name}`
          }
          this.show = true
        } catch (error) {
          uni.showToast({
            title: error.message,
            icon: 'none'
          })
        }
      }, 800, true),
      // 关闭
      close() {
        this.show = false
        this.selectData.subjectId = null
        this.selectData.name = this.categoryName
      },

      // 选择地区
      selectArea({ id, name }) {
        this.selectData.areaId = id
        let str = `${this.selectData.name}-${name}`
        // if ((this.selectData.name === '公务员-行测' || this.selectData.name === '公务员-申论') && id === -9) {
        //   str = `${this.selectData.name}-国考`
        // } else {
        //   str = `${this.selectData.name}-${name}`
        // }
        const flag = this.selectSubjectData.some(item => {
          return item.name === str
        })
        if (!flag) {
          uni.showToast({
            title: '添加成功',
            icon: 'none',
            success: () => {
              this.selectData.name = str
              this.show = false
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1
                })
              }, 500)
              this.setSelectSubject(this.selectData)
            }
          })
        } else {
          uni.showToast({
            title: '目标考试已存在',
            icon: 'none'
          })
        }
      },
      ...mapMutations(['setSelectSubject'])
    }
  }
</script>
<style lang='scss' scoped>
  .subject {
    .subjectWrapper {
      width: 686rpx;
      margin: 60rpx auto 0;
      .subjectItem {
        width: 686rpx;
        height: 88rpx;
        background: rgba(255, 255, 255, 1);
        border-radius: 44rpx;
        border: 2rpx solid rgba(212, 217, 227, 1);
        text-align: center;
        font-size: 32rpx;
        font-weight: 400;
        color: rgba(111, 120, 140, 1);
        line-height: 88rpx;
        &.disabled {
          background: rgba(255, 255, 255, 1);
          border: 1rpx solid rgba(224, 224, 224, 1);
          color: #b7bbc5;
        }
      }
    }
    .areaWrapper {
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      &.slideDown {
        transition: transform 0.2s linear 0s;
        transform: translateY(100%);
      }
      &.slideUp {
        transition: transform 0.2s linear 0s;
        transform: translateY(0%);
      }
      .shandow {
        flex: 1;
        background: rgb(0, 0, 0);
        width: 100%;
        &.fadeOut {
          transition: transform 0.3s linear 0s;
          opacity: 0;
        }
        &.fadeIn {
          transition: transform 0.3s linear 0s;
          opacity: 0.5;
        }
      }

      .content {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        border-radius: 16rpx 16rpx 0px 0px;
        box-sizing: border-box;
        padding: 20rpx 20rpx 80rpx 20rpx;
        &.slideDown {
          transition: transform 0.3s ease;
          opacity: 0;
        }
        &.slideUp {
          transition: transform 0.3s ease;
          transform: translateY(0%);
        }
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 110rpx;
          border-bottom: 1px solid #f3f3f3;
          h3 {
            width: 620rpx;
            height: 56rpx;
            font-size: 40rpx;
            font-weight: 500;
            color: rgba(0, 0, 0, 1);
            line-height: 56rpx;
          }
          .iconbianzu {
            color: #c4c4c4;
          }
        }
        .container {
          padding: 0 20rpx;
          max-height: 760rpx;
          overflow-y: scroll;
          .item {
            width: 140rpx;
            height: 64rpx;
            background: rgba(255, 255, 255, 1);
            border-radius: 32rpx;
            border: 1rpx solid rgba(224, 224, 224, 1);
            font-size: 28rpx;
            font-weight: 400;
            color: rgba(74, 74, 74, 1);
            line-height: 64rpx;
            text-align: center;
            display: inline-block;
            margin-left: 26rpx;
            margin-top: 36rpx;
            &:nth-child(4n + 1) {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
</style>