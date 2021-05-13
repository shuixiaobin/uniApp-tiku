<template>

  <!-- 用户答案未填的情况 -->
  <div class="home">
    <div v-if="content.type == 123 || content.type == 127 ">
      <div class="daanTitle">
          答案
      </div>
      <div  v-for="(item3,k) in content.answer" :key="k">
          <span>{{k+1}}、</span>
          <span>{{content.answer[k]}}</span>
      </div>
    </div>


    <div v-else-if="content.type == 124 || content.type == 126">  
      <span class="lineSpan first">
        <div class="daanTitle">
          答案
        </div>
        <div v-if="content.answer" v-for="(item1,i) in content.choiceNum" :key="i">
           <span>{{i+1}}、</span>
           <span class="daan" v-if="content.answer[i].length >1">
             {{AbcList[content.answer[i][0]]}};
             {{abcList[content.answer[i][1]]}}
            </span>
           <span class="daan" v-else>{{AbcList[content.answer[i]]}}</span>
        </div>
      </span>
      <span class="lineSpan second">
        <div class="daanTitle">
          你选的答案
        </div>
        <div v-if="content.uAnswer" v-for="(item1,j) in content.choiceNum" :key="j">
            <span class="daan" v-if="userAns[0].length >1">
              <span :class="{unkowned: userAns[j][0] == 0 ,error: userAns[j][0] != content.answer[j][0] }">{{AbcList[userAns[j][0]]}};</span>
              <span :class="{unkowned: userAns[j][1] == 0 ,error: userAns[j][1] != content.answer[j][1] }">{{abcList[userAns[j][1]]}}</span>
            </span>
            <span class="daan" v-else :class="{unkowned: userAns[j] == 0 ,error: userAns[j] != rightAns[j] }">{{AbcList[userAns[j]]}}</span>
        </div>
        
        <div v-if="!content.uAnswer" v-for="aaa in anwerLength" :key="aaa">
            <span class="daan" v-if="content.groupNum >1">
              <span class="unkowned">×;</span>
              <span class="unkowned">×</span>
            </span> 
            <span class="daan unkowned" v-else>×</span>
        </div>
      </span>
    </div>

    <div v-else-if="content.type == 125">
      <span class="lineSpan first">
        <div class="daanTitle">
          答案
        </div>
        <div v-if="content.answer" v-for="(item1,m) in content.answerNum" :key="m">
            <span>{{m+1}}、</span>
            <span class="daan">{{AbcList[content.answer.toString()[m]]}}</span> 
        </div>
      </span>
      <span class="lineSpan second">
        <div class="daanTitle">
          你选的答案~
        </div>

        <div v-if="content.uAnswer" v-for="(item1,n) in content.answerNum" :key="n">
           <span class="daan" :class="{error: String([...content.uAnswer].join(''))[n] != String(content.answer)[n]}">{{AbcList[content.uAnswer[n]]}}</span>
        </div>
        <div v-if="!content.uAnswer" v-for="bbb in answerNum" :key="bbb">
            <span class="daan unkowned">×</span>
        </div>
      </span>
    </div>

    <div v-else-if="content.type == 98 || content.type == 100 || content.type == 101">
      <span class="lineSpan first">
    <!--     <div class="daanTitle">
        </div> -->
        <div v-if="content.answer" >
            <span style="margin-right:20rpx">答案</span>
            <span class="daan" v-for="(item11,m) in sizeAbc" :key="m" >{{item11}}</span> 
        </div>
      </span>
      <span class="lineSpan second">
        <div v-if="content.uAnswer">
          <span style="margin-right:20rpx">你选的答案</span> 
          <span class="daan" v-for="(item22,n) in abdS" :key="n" :class="{error: String([...content.uAnswer].join(''))[n] != String(content.answer)[n]}">{{item22}}</span>
        </div>
        <div v-if="!content.uAnswer" v-for="bbb in shuangxuanNum" :key="bbb">
            <span class="daan unkowned">×</span>
        </div>
      </span>
    </div>

  </div>

</template>

<script>
/**
 * 华图第三区委提醒您
 * 代码千万行, 注释第一行,
 * 编码不规范, 同事两行泪.
 */
import { getABC, wordArr1, wordArr2 } from '@/utils/util'
export default {
  props: [ 'content' ],
  data () {
      return {
          subjectiveType:[98,100,101,123,124,125,126,127],
          AbcList: ['x', ...wordArr1],
          abcList:["×", ...wordArr2],
      }
  },
  watch: {
  },
  mounted(){
            console.log("用户答案:",this.content.uAnswer)
            console.log("正确答案:",this.content.answer) 
  },
  methods: {
    getABC
  },
  computed:{
    userAns(){
      var ary=[];
      if(this.content.uAnswer && (this.content.type == 124 || this.content.type == 126)){
          if(this.content.uAnswer[0].length == 1){
              return [...this.content.uAnswer]
          }else{
              [...this.content.uAnswer].map((item)=>{
              ary.push(item.split(','))
              })
              console.log(ary)
              return ary
          }
      }else{
        return []
      }
    },
    rightAns(){
       return this.content.answer
    }, 
    sizeAbc(){
      return String(this.content.answer).split('').map(ite=>this.AbcList[ite])
    },
    abdS(){
      return String(this.content.uAnswer).split('').map(ite=>this.AbcList[ite])
    },
    anwerLength(){
        return this.content.choiceNum
    },
    answerNum(){
        return this.content.answerNum
    },
    shuangxuanNum(){
        return this.content.answer.length
    },

  }
}
</script>

<style scoped lang="scss">
  .home{
    .lineSpan{
      display: inline-block;
    }
    .first{
      width: 300rpx
    }
    .daan{
      font-size:32rpx;
      color:#00C792;
      line-height:44rpx;
    }
    .unkowned{
      color:#FF6D73;
    }
    .error{
      color:#FF6D73;
    }
    .daanTitle{
      margin-bottom: 10rpx;
    }
  }

</style>