<template>
  <view>
    <navBar title="直播间" />
    <view>
      <web-view :src="playUrl" v-if="isShow"/>
    </view>
  </view>
</template>

<script>
  import navBar from '@/components/navBar.vue'
  import {getLiveUrl} from './courseApi.js'
  import { mapState } from 'vuex'

  export default {
    components: {
      navBar
    },
    data() {
      return {
        netClassId:'',
        wareId:'',
        bjyRoomId:'',
        playUrl:'',
        isShow:true
      }
    },
    onLoad: function(options) {
      this.netClassId =options.classId;
      this.bjyRoomId =options.room;
      this.wareId =options.wareId;
    },
    onShow:function(options){  
      this.isShow=true;
    },
    onHide:function(options){
      //console.log(options)
      this.isShow=false;
      // uni.navigateBack({
      //   delta: 1
      // });
    },
    mounted() {
         getLiveUrl({
          netClassId: this.netClassId , //97854
          wareId:this.wareId,
          bjyRoomId: this.bjyRoomId,
          userAvatar: this.loginInfo.avatar,
          userName:this.loginInfo.uname,
          userNick:this.loginInfo.nick,
          userNumber:this.loginInfo.id,
          userRole: 0,
          videoType: 2
        }).then(res=>{
          console.log(res)
          //https://vhuatu.at.baijiayun.com
          if(res.code == 10000){
            let url=res.data.token;
            url= url.replace("www.baijiayun","vhuatu.at.baijiayun")
            this.playUrl =url+"&enterH5=true&dsp=1"
          }
         
           console.log(this.playUrl)
        }).catch(err=>{
          console.log(err);
        })
    },
    computed: mapState({
      loginInfo: state => state.loginInfo
    }),

    methods: {}
  }
</script>
<style scoped>
  .home {
  }
</style>