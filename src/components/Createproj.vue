<template>
  <div>
    <div style="width:100%; font-family: 微软雅黑; font-weight: bold; color: #564f6f; margin-top: 20px; font-size: 20px;">
      <span style="margin-left: 30px; text-shadow: 5px 5px 4px lightgray"><i class="el-icon-circle-plus-outline"></i> 新建项目</span>
      <el-divider></el-divider>
    </div>
      <div class="form-cont">
        <el-form :model="projForm" :rules="rules" ref="projForm" label-width="80px" hide-required-asterisk>
          <el-form-item prop="project_name" label="项目名称">
            <el-input v-model="projForm.project_name"></el-input>
          </el-form-item>
          <el-form-item prop="project_type" label="项目类型">
            <el-radio v-model="projForm.project_type" label="1">图片项目</el-radio>
            <el-radio v-model="projForm.project_type" label="2">视频项目</el-radio>
          </el-form-item>

          <el-form-item prop="tags" label="标签">
            <el-tag v-for="tag in projForm.tags" :key="tag" closable @close="handleTagClose(tag)" size="medium">{{tag}}</el-tag>
            <el-input class="new-tag" v-if="available" v-model="inputTag" ref="saveTagInput" size="small" @keyup.enter.native="handleTagConf"
                      @blur="handleTagConf" ></el-input>
            <el-button v-else-if="buttonvisible" class="button-tag" size="small" @click="showinput" >+ 新标签</el-button>
          </el-form-item>

          <el-form-item prop="project_info" label="项目描述" :rows="3">
            <el-input type="textarea" v-model="projForm.project_info"></el-input>
          </el-form-item>
          <el-form-item prop="filelist" label="项目文件">
            <el-upload action='http://localhost:3000/project/uploadfile' :file-list="filelist" list-type="picture" show-file-list
                       :headers="headers" :on-success="filesuccess" :on-remove="removefile" :before-upload="typecheck" multiple drag>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

              <div slot="tip" class="el-upload__tip" v-show="projForm.project_type ==='1'">支持jpg/png格式文件</div>
              <div slot="tip" class="el-upload__tip" v-show="projForm.project_type ==='2'">支持mp4格式文件</div>
            </el-upload>
          </el-form-item>
          <el-button type="primary" style="width: 380px; border-radius: 15px; background-color: rgba(64,158,255,0.4);
          border-color: rgba(64,158,255,0.2); margin-left:15px; margin-top: 10px"
                     @click="ver()">创建项目</el-button>
          <div style="height: 30px"></div>
        </el-form>
      </div>
  </div>
</template>

<script>
import {addproj, addtags, changefiles, maxprojid} from "@/utils/project";

export default {
  name: "Createproj",
  data(){
    return{
      available: false,
      inputTag: '',
      buttonvisible: true,
      tmpid: '',
      projForm:{
        project_name: '',
        project_type: '1',
        user_id: this.$store.state.currentid,
        createdtime: this.getdate(),
        project_info: '',
        tags:[]
      },
      filelist:[],
      files: [],
      headers: {
        Authorization: localStorage.getItem("token")
      },
      rules:{
        project_name:[
          {
            required: true, message:"请输入项目名称", trigger: 'blur'
          },
          {
            min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ver(){
      this.$refs["projForm"].validate((valid) => {
        if(valid){
          this.$data.projForm.createdtime = this.getdate();
          addproj(this.$data.projForm.project_name, this.$data.projForm.project_type, this.$data.projForm.project_info,
          this.$data.projForm.createdtime, this.$data.projForm.user_id).then(value =>{
            if(value.data.length === 0){
              console.log(this.projForm.tags);
              maxprojid(this.$data.projForm.user_id).then(value => {
                this.tmpid = value.data[0].max_id;
                console.log(this.tmpid);
                addtags(this.tmpid, this.$data.projForm.tags);
                changefiles(this.files, this.tmpid, this.projForm.project_type);
              });

              this.$message({
                showClose: true,
                message: '项目创建成功',
                type: 'success'
              });
              this.$router.push({name: 'Listproj', params: {id: this.$store.state.currentid}})
            }
            else{
              this.$message({
                showClose: true,
                message: '项目已存在',
                type: 'warning'
              });
            }
          })
          console.log('valid')
        }
        else{
          return false
        }
      })
    },
    getdate(){
      var tmp = new Date();
      var year = tmp.getFullYear();
      var month = tmp.getMonth() < 9 ? "0" + (tmp.getMonth() + 1) : (tmp.getMonth() + 1);
      var day = tmp.getDate() < 10 ? "0" + tmp.getDate() : tmp.getDate();
      var hour = tmp.getHours() < 10 ? "0" + tmp.getHours() : tmp.getHours();
      var minute = tmp.getMinutes() < 10 ? "0" + tmp.getMinutes() : tmp.getMinutes();
      var sec = tmp.getSeconds() < 10 ? "0" + tmp.getSeconds() : tmp.getSeconds();
      var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + sec;
      console.log(time);
      var s = tmp.toLocaleString();
      console.log(s);
      return time;
    },
    handleTagClose(tag){
      this.projForm.tags.splice(this.projForm.tags.indexOf(tag), 1);
      if(this.projForm.tags.length < 5){
        this.buttonvisible = true;
      }
    },
    handleTagConf(){
      let input = this.inputTag;
      let s = true;
      for (var i = 0; i < this.projForm.tags.length; i++){
        if (input === this.projForm.tags[i]){
          s = false;
          break;
        }
      }
      if(s){
        this.projForm.tags.push(input);
      }
      this.available = false;
      if(this.projForm.tags.length === 5){
        this.buttonvisible = false;
      }
      this.inputTag = '';
    },
    showinput(){
      this.available = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    filesuccess(file){
      this.files.push(file.originalname);
      console.log(this.files)
    },
    removefile(file){
      this.files.splice(this.files.indexOf(file.name), 1);
    },
    typecheck(file){
      const filetype = file.name.substring(file.name.lastIndexOf(".") + 1);
      if(this.projForm.project_type === '1'){
        const typelist = ['jpg', 'png', 'jpeg'];
        if(typelist.indexOf(filetype) === -1){
          this.$message({
            showClose: true,
            message: '不符合的文件类型',
            type: 'error'
          });
          return false;
        }
      }
      else if(this.projForm.project_type === '2'){
        const typelist = ['mp4'];
        if(typelist.indexOf(filetype) === -1){
          this.$message({
            showClose: true,
            message: '不符合的文件类型',
            type: 'error'
          });
          return false;
        }
      }
    }
  }
}
</script>

<style scoped>
.form-cont{
  width: 600px;
  margin-left: 30%;
  border-radius: 10px;
  border-color: #999999;
  background-color: rgba(246, 243, 243, 0.99);
  box-shadow: 0 2px 12px 0 rgba(222, 218, 229, 0.3);
}
.el-form{
  padding: 40px 0 0 120px;
  font-family: 微软雅黑;
  width: 400px;
}
.el-input{
  width:300px
}

.el-input >>> .el-input__inner{
  background-color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
}
.el-form--inline >>> .el-form-item__label{
  float: left;
}
.el-textarea >>> .el-textarea__inner{
  font-family: 楷体;
  background-color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
  width: 300px;
}
.el-tag{
  margin-left:5px;
  font-family: 楷体;
}
.new-tag{
  margin-left: 5px;
  vertical-align: bottom;
}
.new-tag >>> .el-input__inner{
  width: 60px;
  height: 28px;
}
.button-tag{
  margin-left: 5px;
  height: 28px;
  line-height: 26px;
  padding-top: 0;
  padding-bottom: 0;
}
.el-upload__tip{
  margin-top:0;
}
>>> .el-upload-dragger{
  width: 300px;
  background-color: rgba(255, 255, 255, 0.5);
}
>>> .el-upload-list__item{
  width: 100%
}
</style>