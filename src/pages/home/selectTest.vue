<template>
  <div class="selectTest">
    <navBar :title="'已选题库'"></navBar>
    <div class="drapWrpper">
      <div class="tips">（可拖动调整顺序）</div>
      <div class="container">
        <dragSort
          :list="selectSubjectData"
          :props="props"
          @change="onDragSortChange"
          @deleteFn="onDelete"
          v-if="selectSubjectData.length>0"
        ></dragSort>
        <div
          class="noData"
          v-else
        >
          点击下方添加题库类型
        </div>
        <h3 class="addTest">添加题库</h3>
        <ul class="subjectContainer">
          <li
            class="item mb20"
            @click="goSubject(item)"
            v-for="item in subjectData"
            :key="item.id"
          >
            {{item.name}}
            <i class="iconfont icongengduo"></i>
          </li>
        </ul>
      </div>
    </div>

    <div class="areaWrapper" :class="[show?'slideUp':'slideDown']">
          <div class="shandow"></div>
          <div class="content">
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
  import dragSort from '@/components/drag-sort/index'
  import navBar from '@/components/navBar'
  import { mapState, mapMutations } from 'vuex'
  import { getSubject,getArea } from '@/utils/api'
  import { debounce } from '@/utils/util'
  export default {
    components: {
      navBar,
      dragSort
    },
    data() {
      return {
        props: {
          label: 'name'
        },
        subjectData:[],
        show: false,//地区的显示
        categoryId: '',
        categoryName: '',
        areaData: [],
        selectData: {
          categoryId: null,
          subjectId: null,
          subjectName:'',
          areaId: null,
          name: ''
        }
      }
    },
    computed: {
      ...mapState(['selectSubjectData', 'choosedSubjectData'])
    },
    async mounted() {
      try {
        const res = await getSubject()
        this.subjectData = res.data
        //console.log(this.subjectData)
      } catch (e) {}
    },
    methods: {
      onDragSortChange(e) {
        /**
         * @param {Number} e.startIndex 起始索引
         * @param {Number} e.endIndex 结束索引
         */
        this.changeSuject(e)
      },
      onDelete({ i, name }) {
        if (this.selectSubjectData.length === 1) {
          uni.showToast({
            title: '不能再删啦',
            icon: 'none'
          })
          return false
        }
        this.deleteSelectSubject({ i, name })
        if (name === this.choosedSubjectData.name) {
          const data = this.selectSubjectData[0]
          this.setChoosedSubject(data)
        }
      },
      /*
        goSubject({ id, name, childrens }) {
          if (childrens.length > 0) {
            this.setSubjectChildrens(childrens)
          }
          uni.navigateTo({
            url: `/pages/home/subject?id=${id}&name=${name}`
          }) 
        },
      */
      goSubject: debounce(async function({ id, name ,childrens}) {//选择考试类型
        try {
          this.categoryName = name;
          this.categoryId =id;
          const res = await getArea({
            catgory: this.categoryId,
            subject: name =="公务员"?1:0
          })
          this.areaData = res.data.areas;
          this.selectData.categoryId = id;
          this.selectData.name = name;
          if(id== 200100047){//招警默认选第二个
            this.selectData.subjectId = childrens &&childrens[1].id;//默认到第一个科目
            this.selectData.subjectName = childrens &&childrens[1].name;
          }else{
            this.selectData.subjectId = childrens &&childrens[0].id;//默认到第一个科目
            this.selectData.subjectName = childrens &&childrens[0].name;
          }

          this.show = true
        } catch (error) {
          uni.showToast({
            title: error.message,
            icon: 'none'
          })
        }
      }, 800, true),
      close() {
        this.show = false
        this.selectData.subjectId = null;
        this.selectData.subjectName = ''
        this.selectData.name = this.categoryName;
      },
      // 选择地区
      selectArea({ id, name }) {
        this.selectData.areaId = id
        let str = `${this.selectData.name}-${name}`;
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
              this.setSelectSubject(this.selectData);
              this.setChoosedSubject(this.selectData);
            }
          })
        } else {
          uni.showToast({
            title: '目标考试已存在',
            icon: 'none'
          })
        }
      },
      ...mapMutations(['setSubjectChildrens', 'deleteSelectSubject', 'changeSuject', 'setChoosedSubject','setSelectSubject'])
    }
  }
</script>
<style lang='scss' scoped>
  .selectTest {
    .tips {
      text-align: center;
      height: 74rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 74rpx;
    }
    .drapWrpper {
      width: 100%;
      height: 200rpx;
      background: rgba(255, 133, 178, 1);
      font-size: 24px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 34px;
      position: relative;
      .container {
        position: absolute;
        overflow: hidden;
        left: 50%;
        transform: translateX(-50%);
        width: 686rpx;
        top: 74rpx;
      }
    }
    .noData {
      width: 686rpx;
      height: 108rpx;
      background: rgba(255, 255, 255, 1);
      border-radius: 20rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: rgba(60, 62, 67, 1);
      line-height: 108rpx;
      text-align: center;
    }
    .addTest {
      height: 56rpx;
      text-align: center;
      font-size: 40rpx;
      font-weight: 800;
      color: rgba(60, 62, 67, 1);
      line-height: 56rpx;
      margin: 50rpx auto 30rpx auto;
    }
    .subjectContainer {
      .item {
        width: 683rpx;
        height: 88rpx;
        background: rgba(255, 255, 255, 1);
        border-radius: 44rpx;
        border: 2rpx solid rgba(212, 217, 227, 1);
        font-size: 32rpx;
        font-weight: 400;
        text-align: center;
        color: rgba(111, 120, 140, 1);
        line-height: 88rpx;
        position: relative;
        .icongengduo {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 40rpx;
          color: #d4d9e3;
        }
      }
    }

    .areaWrapper {
      .shandow {
        position: fixed;
        left: 0;
        bottom: 0;
        background: rgb(0, 0, 0);
        width: 100%;
        height: 100%;
        transition: opacity 0.2s;
        opacity: 0;
      }

      .content {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        border-radius: 16rpx 16rpx 0px 0px;
        box-sizing: border-box;
        padding: 20rpx 20rpx 80rpx 20rpx;
        position: fixed;
        left: 0;
        bottom: -100%;
        transition: all 0.2s;
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
      &.slideDown {
        .shandow {
          bottom: -100%;
        }
      
      }
      &.slideUp {
        .content {
          bottom: 0;
        }
        .shandow {
          opacity: 0.5;
        }
      }
    }
  }
</style>