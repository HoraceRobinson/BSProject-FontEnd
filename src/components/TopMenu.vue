<template>
  <div class="head-container">
    <div class="logo"><el-image :src="require('@/assets/logo-home.png')" /></div>
    <div class="blank">
<!--      <el-menu :default-active="1" mode="horizontal" background-color=#4c495d text-color="#fff" active-text-color="#802bb1"-->
<!--      style="font-family: 微软雅黑;">-->
<!--        <el-menu-item index="1">处理中心</el-menu-item>-->
<!--        <el-submenu index="2">-->
<!--          <template slot="title">我的工作台</template>-->
<!--          <el-menu-item index="2-1">选项1</el-menu-item>-->
<!--          <el-menu-item index="2-2">选项2</el-menu-item>-->
<!--          <el-menu-item index="2-3">选项3</el-menu-item>-->
<!--          <el-submenu index="2-4">-->
<!--            <template slot="title">选项4</template>-->
<!--            <el-menu-item index="2-4-1">选项1</el-menu-item>-->
<!--            <el-menu-item index="2-4-2">选项2</el-menu-item>-->
<!--            <el-menu-item index="2-4-3">选项3</el-menu-item>-->
<!--          </el-submenu>-->
<!--        </el-submenu>-->
<!--        <el-menu-item index="3">消息中心</el-menu-item>-->
<!--        <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
<!--      </el-menu>-->
    </div>
    <div class="userinfo">
      <el-avatar :src="changesrc"></el-avatar>
      <el-dropdown>
        <span class="el-dropdown-link" style="color: #d1d7e0; font-family: 微软雅黑" >{{getUser}}<br>
          <span style="font-size: 10px; font-family: 'Times New Roman'; color: #9ea3ab">ID: {{getID}}<i class="el-icon--right el-icon-info" /></span></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="userdrawer = true">个人信息</el-dropdown-item>
          <el-dropdown-item @click.native="logout()">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-drawer title="用户信息" :visible.sync="userdrawer" @closed="changestate = true" :show-close=false >
      <el-form :model="editForm" :rules="rules" ref="editForm" class="edit-form" inline label-width="60px" hide-required-asterisk>
        <el-form-item prop="username" label="用户名">
          <el-input v-model="editForm.username" prefix-icon="el-icon-user" placeholder="editForm.username" :disabled=changestate></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio v-model="editForm.sex" label="男" :disabled=changestate>男</el-radio>
          <el-radio v-model="editForm.sex" label="女" :disabled=changestate>女</el-radio>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editForm.email" prefix-icon="el-icon-message" placeholder="editForm.email" :disabled=changestate></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="editForm.phone" prefix-icon="el-icon-mobile-phone" placeholder="editForm.phone" :disabled=changestate></el-input>
        </el-form-item>
      </el-form>
      <el-button @click.native="changestate = false" class="edit-btn" v-show=changestate>修改</el-button>
      <el-button @click.native="changeinfo()" class="edit-btn" v-show=!changestate>保存</el-button>
      <el-button @click.native="reset()" class="edit-btn">取消</el-button>
    </el-drawer>
  </div>
</template>

<script>
import {edituser} from "@/utils/user";

export default {
  name: "TopMenu",
  data(){
    var ifphvalid = (rule, value, callback) => {
      if((value.length != 11 && value.length != 0) || (value.length > 0 && value[0] != 1)){
        callback(new Error('手机号格式有误'));
      }else{
        callback();
      }
    };
    return{
      changestate: true,
      changesrc: require('@/assets/logo/女1.png'),
      userdrawer: false,
      editForm: {
        id: this.$store.state.currentid,
        username: this.$store.state.currentuser,
        sex: this.$store.state.currentsex,
        email: this.$store.state.currentemail,
        phone: this.$store.state.currentphone
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
      }
    }
  },
  methods:{
    reset(){
      this.$data.userdrawer = false;
      this.$data.editForm.username = this.$store.state.currentuser;
      this.$data.editForm.sex = this.$store.state.currentsex;
      this.$data.editForm.email = this.$store.state.currentemail;
      this.$data.editForm.phone = this.$store.state.currentphone;
    },
    changeinfo(){
      console.log('changeinfo');
      edituser(this.$store.state.currentid, this.$data.editForm.username, this.$data.editForm.sex, this.$data.editForm.email, this.$data.editForm.phone)
          .then(value => {
            console.log(this.$data.editForm);
            console.log(value.data);
            if(value.data.length === 0){
              this.$message({
                showClose: true,
                message: '修改个人信息成功',
                type: 'success'
              });
              this.$data.userdrawer = false;
              this.$store.commit("changestate", this.$data.editForm);
            }
            else{
              this.$message({
                showClose: true,
                message: '用户名已存在',
                type: 'error'
              });
              console.log(value.data);
            }
          })
    },
    logout(){
      if(this.$store.state.islogin === false){
        this.$message({
          showClose: true,
          message: '尚未登录！',
          type: 'error'
        });
      }
      else{
        this.$store.commit("exit");
        this.$router.push("/login");
        sessionStorage.clear();
        history.pushState(null, null, document.URL);
        window.addEventListener("popstate",function() {
          history.pushState(null, null, document.URL);
        }, false);
      }
    }
  },
  computed:{
    getUser: function (){
      // this.editForm.username=this.$store.state.currentuser;
      return this.$store.state.currentuser;
    },
    getava: function (){
      return this.$store.state.currentava;
    },
    getID: function (){
      return this.$store.state.currentid;
    }
  }
}
</script>

<style scoped>
.logo{
  width: 300px;
}
.blank{
  flex:1
}
.userinfo{
  width:150px;
  /*margin-right: 0;*/
}
.el-avatar{
  margin-top: 10px;
}
.el-dropdown{
  margin-top: 15px;
  margin-left: 5px;
  position: absolute;
}
.el-dropdown-link{
  /*margin: auto auto;*/
  margin-top: 5px;
}
.el-menu.el-menu--horizontal{
  border-bottom: 0;
}
.el-dropdown-menu.el-popper{
  background-color: #2d283e;
  border-color: #2d283e;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  font-family: 微软雅黑;
}
.el-popper[x-placement^=bottom] >>> .popper__arrow {
  color: #2d283e;
  left: 50% !important;
}
.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
  background-color: #4c495d;
  color: #802bb1;
}
>>> .el-drawer{
  background-color: rgba(240, 255, 240, 0.8);
  box-shadow: 0 2px 12px 0 rgba(240, 255, 240, 0.3);
  font-family: 微软雅黑;
  float: left;
}
.el-form--inline >>> .el-form-item__label{
  float: left;
}
.el-input{
  width:300px;
}
.el-input >>> .el-input__inner{
  background-color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
}
.el-input.is-disabled >>> .el-input__inner{
  background-color: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.4);
}
.edit-btn{
  border-radius: 10px;
  margin-left: 10px;
  width: 45%;
  background-color: rgba(234, 225, 225, 0.5);
  border-color: rgba(255, 255, 255, 0);
  box-shadow: 0 2px 12px 0 rgba(222, 218, 229, 0.3);
}
.el-button:focus,.el-button:hover{
  background-color: white;
  border-color: white;
}
</style>

