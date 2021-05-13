<template>
    <view>
        <navBar title="解析" ref="navBar"></navBar>
        <div class="analysis" :style="{height: analysisHeight + 'px',lineHeight: analysisHeight + 'px'}" v-if="qtList">
            <div class="title" :class="style">
                {{paper&&paper.name}}
                <span class="num"><span class="index"></span>{{Number(currentIndex)+1}}/{{qtList.length}}</span>
            </div>
        </div>
        <div class="content" :style="{top: top + 'px'}">
            <swiper skip-hidden-item-layout class="scroll-view_H" :current="currentIndex" @change="handleSwiperChange" scroll-x @scroll="scroll" style="width: 100%; height: 100%;">
                <swiper-item v-for="(item, index) in qtList" :key="item.id" >
                    <QuestionDetail  v-if="examType && Math.abs(currentIndex - index) < 2" :questionInfo="item" /><!-- 模考大赛 -->
                    <NewQuestionDetail  v-if="!examType && Math.abs(currentIndex - index) < 2" :questionInfo="item" /><!-- 精准估分 -->
                </swiper-item>
            </swiper>
        </div>
       
    </view>

</template>

<script>
    import navBar from '@/components/navBar.vue'
    import { mapState, mapActions, mapMutations} from 'vuex'
    import QuestionDetail from './components/questionDetail'//模考解析
    import NewQuestionDetail from './components/new-questionDetail'//估分解析

	export default {
		name: "analysis",
        components: {
			navBar,
            QuestionDetail,
            NewQuestionDetail
        },
        computed: {
            ...mapState('analysis', ['qtList','paper','currentIndex']),
            style(){
                if(!this.qtList)return ''
            	let qt = this.qtList[this.currentIndex];
            	if(qt.correct===0){
            		return 'disabled'
                }else if(qt.correct===2 || qt.correct===4){
            		return  'error'
                }
                return ''
            }
        },
        data(){
			return {
                cardId: '',
                isAll: true,
                top: 0,
                examType:false,
                analysisHeight: 0
            }
        },
        methods: {
            ...mapActions('analysis',['getReport','getMockReport']),
            ...mapMutations('analysis',['setCurrentIndex']),
			handleSwiperChange (e) {
				if (e.detail.source === 'touch') {
					this.setCurrentIndex(e.detail.current)
				}
			},
        },
        onLoad(val){
            this.cardId = val.cardId;
            this.examType = val.type;
			this.setCurrentIndex(val.index);
            this.isAll = val.isAll==='true';
            if(val.type)
                this.getMockReport({cardId: this.cardId, isAll: this.isAll})
            else
                this.getReport({cardId: this.cardId, isAll: this.isAll})
        },
        created() {
            this.analysisHeight = 44
        },
		mounted () { 
			const navBar = this.$refs.navBar
            this.top =
            navBar.titleBarHeight +
            navBar.statusBarHeight +
            this.analysisHeight
		},
	}
</script>

<style lang="scss">
    .analysis{
        .title{
            padding: 0 140rpx 0 30rpx;
            position: relative;
            background: #E3FFED;
            color: #49CF9E;
            font-size: 28rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .num{
                position: absolute;
                right: 30rpx;
            }
        }
        .disabled{
            background: #fff;
            color: #4a4a4a;
            .num{
                color: #9B9B9B;
                .index{
                    color: #FF6D73;
                }
            }
        }
        .error{
            background: #FFD9DB;
            color: #FE2F41;
        }
    }
    .content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #FAFAFA;
        //z-index: -1;
        .module-name {
            font-size: 32rpx;
            font-weight:600;
            color:rgba(74,74,74,1);
            padding: 0 30rpx;
            margin-bottom: 40rpx;
        }
        .question-num {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding-top: 10rpx;
            .num-item {
                width: 80rpx;
                height: 80rpx;
                min-width: 80rpx;
                line-height: 80rpx;
                text-align: center;
                border: 1rpx solid rgba(74,74,74,1);
                border-radius: 50%;
                margin: 0 20rpx 60rpx;
                position: relative;
                &.selected {
                    border-color: #FF85B2;
                    background-color:#FF85B2;
                    color: #fff;
                }
                .not-support {
                    display: none;
                }
                &.disabled {
                    border-color: #F0F0F0;
                    background-color:#F0F0F0;
                    color: #9B9B9B;
                    .not-support {
                        display: block;
                        position: absolute;
                        top: 90rpx;
                        width: 100rpx;
                        height: 36rpx;
                        border-radius: 18rpx;
                        border-color: #F0F0F0;
                        background-color:#F0F0F0;
                        color: #9B9B9B;
                        font-size: 20rpx;
                        text-align: center;
                        left: 50%;
                        margin-left: -50rpx;
                        line-height: 36rpx;
                        &:after {
                            content: '';
                            display: block;
                            width: 0;
                            height: 0;
                            border-left: 12rpx solid transparent;
                            border-top: 6rpx solid transparent;
                            border-right: 12rpx solid transparent;
                            border-bottom: 6rpx solid #F0F0F0;
                            position: absolute;
                            top: -10rpx;
                            left: 50%;
                            margin-left: -12rpx;
                        }
                    }
                }
            }
        }
    }
</style>