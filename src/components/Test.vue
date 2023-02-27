<template>
  <div>
    <div style="width: 100%; height: 50px; margin-top: 10px">
      <el-breadcrumb class="nav" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{name:'Listproj', params: {id: getid}}" v-if="taskorproj">项目列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{name:'Mytask', params: {id: getid}}" v-if="!taskorproj">我的任务</el-breadcrumb-item>
        <el-breadcrumb-item>{{getprojname}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-divider></el-divider>
    <el-row :gutter="10">
      <el-col :span="17">
        <video :src="this.videourl" controls style="width:100%; margin-left: 20px"></video>
      </el-col>
      <el-col :span="6">
        <el-row>
          <el-button type="primary" @click="cutPicture" style="width: 100%; margin-left: 20px">
            截图
          </el-button>
        </el-row>
        <el-row>
          <el-button type="primary" @click="reset" style="width: 100%; margin-left: 20px; margin-top: 10px">
            重置
          </el-button>
        </el-row>
        <el-row>
          <el-button type="primary" @click="savepicture" style="width: 100%; margin-left: 20px; margin-top: 10px">
            保存
          </el-button>
        </el-row>
        <el-row>
          <el-button type="primary" @click="editproj" style="width: 100%; margin-left: 20px; margin-top: 10px">
            编辑
          </el-button>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <div style="margin-top: 20px"><span style="margin-left: 20px; font-weight: bold;font-family: 微软雅黑;">视频帧预览</span></div>
      <div><img v-for="(v, i) in imgSrc" :key="i" :src="v"
                style="margin-left: 20px; width: 300px; height: 200px; margin-top: 10px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);" /></div>
    </el-row>
    <canvas id="myCanvas" width="343" height="200" hidden></canvas>
  </div>
</template>
<script>
import {getvideoname, savevideopictures} from "@/utils/project";

export default {
  name:"Test",
  mounted() {
    getvideoname(this.$store.state.currentprojid).then(value=> {
      this.videourl = require("../../../projects/files/" + value.data[0].img_name);
      console.log(this.videourl)
      this.videoname = value.data[0].img_name;
    })
  },
  data() {
    return {
      videourl: '',
      imgSrc:[],
      videoname: ''
    };
  },
  methods: {
    reset(){
      this.imgSrc = []
    },
    //截取当前帧的图片
    cutPicture(){
      var v = document.querySelector("video");
      let canvas = document.getElementById('myCanvas')
      var ctx = canvas.getContext('2d');
      ctx.drawImage(v, 0, 0, 343, 200);
      var oGrayImg = canvas.toDataURL('image/jpeg');
      console.log(oGrayImg)
      this.imgSrc.push(oGrayImg);
    },
    savepicture(){
      savevideopictures(this.imgSrc, this.videoname, this.$store.state.currentprojid).then(value => {
        if(value.data.state === true){
          this.$message.success('保存成功')
        }
      })
    },
    editproj(){
      this.$store.commit('setvideo', {name: this.videoname})
      this.$router.push({name: 'Editvideoproj', params:{id: this.$store.state.currentid}})
    }
  },
  computed: {
    getid: function (){
      return this.$store.state.currentid
    },
    getprojname: function (){
      return this.$store.state.currentprojname;
    },
    taskorproj: function (){
      return this.$store.state.currenttype === 'project';
    }
  }
}
</script>

<style scoped>
.pics {
  width: 100%;
  overflow: hidden;
  margin-bottom: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>