<template>
    <div class="answer_info">
        <div class="baseInfo" v-if="!qi.cantAnswer">
            <div class="info_item">
                答题用时
                <div class="answer_time">{{qi.time}}秒</div>
            </div>
            <div class="info_item">
                全站正确率
                <div class="rate">{{percent}}%</div>
            </div>
            <div class="info_item" v-if="(qi.type == 123 || qi.type==127) && qi.meta.yc > 0">
                易错项
                <div class="info_err" v-if="qi.meta">第{{qi.meta.yc}}空</div>
            </div>
            <div class="d" v-else-if="isLine && qi.meta.yc > 0">
                易错项
                <div class="info_err" v-if="qi.meta">第{{qi.meta.yc}}题</div>
            </div> 
            <div class="info_item" v-else-if="qi.meta.yc > 0">
                易错项
                <div class="info_err" v-if="qi.meta">{{yc[0]}}</div>
            </div>
        </div>
        
        <div class="fgLine" v-else></div>
        <div class="detail_info">
             <!-- 客观题 -->
            <div class="answer" v-if="objectiveType.includes(qi.type)">
                答案
                <span class="answer_text">{{answer}}</span>
            </div>
            <!-- 特殊题 -->
            <div class="answer" v-else-if="specialType.includes(qi.type)">
                <AnswerItem :content="qi"/>
            </div>

            <div class="answer" v-else>
                答案 
                <span class="answer_text" v-html="qi.answer"></span>
            </div>

            <div class="detail_item"  v-if="qi.analysis">
                <div class="item_title">解析</div>
                <div class="item_content" v-html="qi.analysis"></div>
            </div>
            <div class="detail_item" v-if="qi.extend">
                <div class="item_title">拓展</div>
                <div class="item_content" v-html="qi.extend"></div>
            </div>
            <div class="detail_item" v-if="qi.pointsName&&qi.pointsName.length>0">
                <div class="item_title">考点</div>
                <div class="item_content">
                    <span class="point_name" v-for="(item, index) in qi.pointsName" :key="index">{{item}}</span>
                </div>
            </div>
            <div class="source" v-if="qi.from">
                <div class="title"></div>
                <div class="source_content">{{qi.from.replace(/、/g,'; ')}}。</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getABC} from '@/utils/util'
    import AnswerItem from './answerItem'
	export default {
		name: "baseInfo", 
        props: ['qi'],
        data () {
            return {
                objectiveType :[99, 109],
                specialType:[98,100,101,123,124,125,126,127]
            }
        },
        methods: {
			getABC
        },
        computed: {
			percent(){
                if(this.qi.cantAnswer)return 0;
                if(this.qi.meta.metaFlag >0){
                    return this.qi.meta.percent
                }else{
                    let meta = this.qi.meta;
                    if(meta&&meta.answers){
                        let index = meta.answers.indexOf(this.qi.answer);
                        if(index>-1){
                            return meta.percents[index]
                        }
                        return 0
                    }
                }

            },
            isLine(){
                return [124,125,126].includes(this.qi.type)
            },
            yc(){
                const ret = getABC(String(this.qi.meta.yc))
                return ret
            },
            answer(){
				return getABC(String(this.qi.answer)).toString();
            }
        },
        mounted(){
            //console.log(this.qi)
        },
        components: {
            AnswerItem
        }
	}
</script>

<style scoped lang="scss">
    .answer_info{
            word-break: break-all;
        .baseInfo{
            display: flex;
            justify-content: space-between;
            padding: 30rpx 40rpx;
            color: #4a4a4a;
            font-size: 28rpx;
            text-align: center;
            box-shadow:0 0 8rpx 0 rgba(0,0,0,0.1);
            font-weight: 500;
            margin-bottom: 10rpx;
            .answer_time{
                padding-top: 30rpx;
                color: #F5A623;
            }
            .rate{
                padding-top: 30rpx;
                color: #49CF9E;
            }
            .info_err{
                padding-top: 30rpx;
                color: #FF6D73;
            }
        }
        .fgLine{
            width: 100%;
            height: 10rpx;
            margin: 10rpx 0;
            background: #fff;
            border-top: 1rpx solid rgba(0, 0, 0, .1)
        }
        .detail_info{
            padding: 30rpx;
            background: #fff;
            .answer{
                color: #4a4a4a;
                font-size: 28rpx;
                font-weight: 500;
                .answer_text{
                    display: inline-block;
                    padding-left: 30rpx;
                    color: #49CF9E;
                }
            }
            .detail_item{
                .item_title{
                    margin: 30rpx 0 20rpx;
                    font-size: 28rpx;
                    color: #000;
                    font-weight: 400;
                }
                .item_content{
                    font-size: 30rpx;
                    color: #4a4a4a;
                    font-weight: 400;
                    .point_name{
                        display: inline-block;
                        min-width: 140rpx;
                        height: 40rpx;
                        background: #fee;
                        text-align: center;
                        line-height: 40rpx;
                        color: #EC74A0;
                        font-size: 28rpx;
                        font-weight: 500;
                        margin-right: 6rpx;
                    }
                }
            }
            .source{
                margin-top: 60rpx;
                .title{
                    width: 100%;
                    border-top: 2rpx solid #e0e0e0;
                    position: relative;
                    &:before{
                        content: '来源';
                        display: inline-block;
                        padding: 0 20rpx;
                        background: #fff;
                        font-size: 28rpx;
                        color: #4a4a4a;
                        font-weight: 500;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        -webkit-transform: translate(-50%,-50%);
                        -moz-transform: translate(-50%,-50%);
                        -ms-transform: translate(-50%,-50%);
                        -o-transform: translate(-50%,-50%);
                        transform: translate(-50%,-50%);
                    }
                }
                .source_content{
                    margin-top: 30rpx;
                    color: #9b9b9b;
                    font-size: 28rpx;
                    font-weight: 500;
                    line-height: 40rpx;
                }
            }
        }
    }
</style>