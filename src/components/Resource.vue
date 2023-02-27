<template>
  <div>
    <div style="width:100%; font-family: 微软雅黑; font-weight: bold; color: #564f6f; margin-top: 20px; font-size: 20px;">
      <span style="margin-left: 30px; text-shadow: 5px 5px 4px lightgray">在线资源库</span>
    </div>
    <el-divider></el-divider>
    <el-image v-for="(v, i) in imglist" :key="i" :src="v" lazy :preview-src-list="imglist">
    </el-image>
  </div>
</template>

<script>
import {getallfiles} from "@/utils/project";

export default {
  mounted() {
    getallfiles().then(value => {
      for(let i in value.data){
        if(value.data[i].substring(value.data[i].length - 3) !== 'mp4'){
          let tmp = require('../../../projects/files/' + value.data[i])
          this.imglist.push(tmp)
          this.pic_name.push(value.data[i])
        }
      }
    })
  },
  name: "Resource",
  data(){
    return{
      imglist: [],
      pic_name: []
    }
  },
  method: {

  }
}
</script>

<style scoped>
.el-image{
  width: 280px;
  height: 200px;
  border-radius: 10px;
  margin: 20px 20px;
  transition: all 0.4s;
}
.el-image:hover{
  transform: scale(1.05);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}
</style>