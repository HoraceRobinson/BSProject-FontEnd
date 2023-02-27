<template>
  <div class="login_bg">
    <div class="logo">
      <div class="blank"></div>
      <el-image :src="require('@/assets/logo.png')" style="margin-bottom: 0"></el-image>
    </div>
    <div class="login">
      <el-form :model="registerForm" :rules="rules" ref="registerForm" class="login-form">
        <el-form-item prop="username" >
          <el-input v-model="registerForm.username" prefix-icon="el-icon-user" placeholder="用户名(8-15个字符)"></el-input>
        </el-form-item>
        <el-form-item prop="sex">
          <el-select v-model="registerForm.sex" prefix-icon="el-icon-male" placeholder="性别" value="男">
            <el-option value="男"></el-option>
            <el-option value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="registerForm.email" prefix-icon="el-icon-message" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="registerForm.phone" prefix-icon="el-icon-mobile-phone" placeholder="手机号(中国大陆+86)"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="registerForm.password" prefix-icon="el-icon-unlock" placeholder="密码" show-password
          @paste.capture.native.prevent="handlePaste"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="registerForm.checkPass" prefix-icon="el-icon-check" autocomplete="off" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item prop="checked" :inline-message = true style="height: 15px">
          <el-checkbox v-model="registerForm.checked">我已阅读并同意<el-link type="primary" href="">《用户协议》</el-link></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 350px; border-radius: 15px; background-color: rgba(64,158,255,0.4); border-color: rgba(64,158,255,0.3)"
          @click="ver()">注册</el-button>
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

import {register} from "@/utils/user";

export default {
  name: "Register",
  mounted() {
    console.log('register')
  },
  data(){
    var checkPassword = (rule, value, callback) => {
      if (value == ''){
        callback(new Error('请再次输入密码'));
      }else if (value != this.registerForm.password){
        callback(new Error('密码不一致，请重新输入'));
      }else{
        callback();
      }
    };
    var ifpwdvalid = (rule, value, callback) => {
      if (value === ''){
        callback(new Error('请输入密码'));
      }else if(value.length < 8){
        callback(new Error('密码过短，请重新输入'));
      }else{
        var int_num = 0;
        var char_num = 0;
        for(var i = 0; i < value.length; i++){
          if(value[i] >= '0' && value[i] <= '9'){
            int_num++;
          }
          else if( (value[i] >= 'a' && value[i] <= 'z') || (value[i] >= 'A' && value[i] <= 'Z')){
            char_num++;
          }
        }
        if (int_num == 0 || char_num == 0){
          callback(new Error('密码应至少包含数字和英文字母'))
        }
        else{
          callback();
        }
      }
    };
    var ifphvalid = (rule, value, callback) => {
      if((value.length != 11 && value.length != 0) || (value.length > 0 && value[0] != 1)){
        callback(new Error('手机号格式有误'));
      }else{
        callback();
      }
    };
    var ifchecked = (rule, value, callback) => {
      if(value === false){
        callback(new Error('请勾选用户协议'));
      }else{
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      let mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (value === '') {
        callback(new Error('请输入邮箱'));
      }
      else{
        if(mailReg.test(value)) {
          callback();
        }else{
          callback(new Error('请输入合法的邮箱'));
        }
      }
    };
    return{
      registerForm:{
        username:'',
        password:'',
        checkPass: '',
        sex: '',
        email: '',
        phone: '',
        checked: false,
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
        phone: [
          {
            validator: ifphvalid, trigger: 'blur'
          }
        ],
        password: [
          {
            validator: ifpwdvalid, trigger: 'blur'
          }
        ],
        email: [
          {
            validator: validateEmail, trigger: 'blur'
          }
        ],
        checkPass: [
          {
            validator: checkPassword, trigger: 'blur'
          }
        ],
        checked: [
          {
            validator: ifchecked, trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ver(){
      this.$refs["registerForm"].validate((valid) => {
        if(valid){
          console.log('valid');
          register(this.$data.registerForm.username, this.$data.registerForm.password,
              this.$data.registerForm.sex, this.$data.registerForm.email, this.$data.registerForm.phone)
              .then(value => {
            if(value.data.state === 0){
              this.$message.success('注册成功')
            }
            else if(value.data.state === 1){
              this.$message.error('用户名已存在')
            }
            else if(value.data.state === 2){
              this.$message.error('邮箱已存在')
            }
          })
        }else{
          console.log('invalid');
          return false;
        }
      })
    },
  }
}
</script>

<style scoped>

.logo{
  height:20vh;
  text-align: center;
  /*display: flex;*/
  /*margin-top: 100px;*/
}
.blank{
  height: 5vh
}
.login{
  width: 400px;
  height: 65vh;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  background-color: rgb(246, 244, 244);
  background-image: url("../assets/background1.jpg");
  /*background-repeat: unset;*/
  background-size: 400px 300px;
  /*-webkit-filter: blur(10px);*/
  font-family: "微软雅黑 Light";
}
.login-form{
  width: 350px;
  height: 200px;
  margin-top: 15px;
  margin-left:25px
  /*margin: auto auto;*/
}
.bottom_nav{
  height: 300px;
  margin-top: 50px;
  background-color: rgba(0, 0, 0, 1);
  /*background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgb(0, 0, 0));*/
  color: #DCDFE6;
  font-family: "楷体","Times New Roman";
  font-size: 15px;
}
.el-input >>> .el-input__inner{
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: #DCDFE6;
}
.el-select >>> .el-input__inner{
  width: 350px;
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}
.el-image >>> .el-image__inner{
  margin-bottom: 0;
}
.el-divider >>> .el-divider--horizontal{
  margin: 0 0;
}
.el-form-item{
  margin-bottom: 18px;
}

</style>