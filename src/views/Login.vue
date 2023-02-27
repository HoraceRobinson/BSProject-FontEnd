<template>
  <div class="login_bg">
    <div class="logo">
      <div class="blank"></div>
      <el-image :src="require('@/assets/logo.png')" style="margin-bottom: 0"></el-image>
    </div>
    <div class="login">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
        <el-form-item  prop="username" >
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-unlock" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-link type="primary" style="margin-bottom: 22px;margin-left: 0">忘记密码？</el-link>
        <el-link type="primary" style="margin-bottom: 22px;margin-left: 200px" href="/register">新用户注册</el-link>
        <el-form-item>
          <el-button type="primary" style="width: 350px; border-radius: 15px; background-color: rgba(64,158,255,0.4); border-color: rgba(64,158,255,0.3)" @click="ver()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom_nav">
      <div style="line-height: 10vh; text-align: center">
        在线标注<el-divider direction="vertical" style="margin: 0 0"/>文件传输<el-divider direction="vertical" style="margin: 0 0"/>
        图片/视频<el-divider direction="vertical" style="margin: 0 0"/>任务社区<el-divider direction="vertical" style="margin: 0 0"/>
        云端服务<el-divider direction="vertical" style="margin: 0 0"/>
        海量资源
      </div>
<!--      <el-divider />-->
      <div style=" display: flex">
        <div style="text-align: left; margin-left: 20px; flex: 8">
          <el-row><img src="../assets/logo.png" style="width: 200px; margin-top: 20px" /> </el-row>
          <el-row style="margin-left: 15px">基于机器学习开发的在线标注网站</el-row>

        </div>
        <div style="flex: 8">
          <div style="margin-top: 30px">技术支持</div>
          <div style="font-family:'Times New Roman', 微软雅黑; margin-top: 10px">
            <el-link href="https://element.eleme.cn" style="font-size: 12px">ElementUI</el-link><br>
            <el-link href="https://cn.vuejs.org" style="font-size: 12px">Vue —— 渐进式JavaScript框架</el-link><br>
            <el-link href="https://expressjs.com.cn" style="font-size: 12px">Express —— 基于Node.js的轻量级Web开发框架</el-link>
          </div>
        </div>
        <div style="text-align: right; margin-right: 20px; position: relative; margin-top: 20px; flex: 8">
          联系我们
          <el-divider direction="vertical" style="margin: 0 0"/>
          <img src="../assets/logo/QQ.png" style="position: absolute; height: 25px; width: 25px; margin-left:15px; top: 5px">
          <img src="../assets/logo/微信.png" style="position: relative; height: 25px; width: 25px; margin-left:55px; top: 5px">
          <img src="../assets/logo/微博.png" style="position: relative; height: 25px; width: 25px; margin-left:15px; top: 5px">
          <img src="../assets/logo/知乎.png" style="position: relative; height: 25px; width: 25px; margin-left:15px; top: 5px">
        </div>
      </div>
      <el-row style="text-align: center; margin-top: 50px">© 2021 Copyright IA - 版权所有，侵权必究</el-row>
    </div>
  </div>
</template>

<script>
import {login} from "@/utils/user";

export default {
  name: "Login",

  data(){
    return{
      loginForm:{
        username:'',
        password:''
      },
      rules:{
        username: [
          {
            required: true, message:"请输入用户名", trigger: 'blur'
          },
          {
            min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur'
          }
        ],
        password: [
          {
            required: true, message:"请输入密码", trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ver(){
      this.$refs["loginForm"].validate((valid)=>{
        if(valid){
          console.log('valid');
          login(this.$data.loginForm.username,this.$data.loginForm.password).then(value => {
            if(value.data.length === 0){
              this.$message({
                showClose: true,
                message: "用户名或密码有误，请重新输入",
                type: 'error'
              })
            }
            else{
              this.$message({
                showClose: true,
                message: "登录成功",
                type: 'success'
              });
              console.log(value.data[0]["username"]);
              this.$store.commit('changestate', value.data[0]);
              console.log('change state success');
              this.$router.push({name: 'Listproj', params: {id: value.data[0]['id']}});
            }
          })
        }else{
          console.log('error info');
          return false;
        }
      })
    }
  },
  computed: {
    showState(){
      return this.$store.state.id;
    }
  }
}
</script>

<style scoped>

.logo{
  height:30vh;
  text-align: center;
  /*display: flex;*/
  /*margin-top: 100px;*/
}
.blank{
  height: 15vh
}
.login{
  width: 400px;
  height: 40vh;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  background-color: rgb(246, 244, 244);
  background-image: url("../assets/background1.jpg");
  background-size: 400px 300px;
  /*-webkit-filter: blur(10px);*/
  font-family: "微软雅黑 Light";
}
.login-form{
  width: 350px;
  height: 200px;
  margin: auto auto;
}
.bottom_nav{
  height: 300px;
  margin-top: 100px;
  background-color: rgba(0, 0, 0, 1);
  /*background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgb(0, 0, 0));*/
  color: #DCDFE6;
  font-family: "Times New Roman", 楷体;
  font-size: 15px;
}
.el-input >>> .el-input__inner{
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: #DCDFE6;
}
.el-image >>> .el-image__inner{
  margin-bottom: 0;
}
.el-divider >>> .el-divider--horizontal{
  margin: 0 0;
}
.el-divider--horizontal{
  margin: 0 0;
  background-color: #9ea3ab;
}
</style>