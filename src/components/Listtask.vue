<template>
<div>
  <div style="width:100%; font-family: 微软雅黑; font-weight: bold; color: #564f6f; margin-top: 20px; font-size: 20px;">
    <span style="margin-left: 30px; text-shadow: 5px 5px 4px lightgray">在线任务</span>
  </div>
  <div style="margin: 20px 30px; width: 95%;  background-color: rgba(250,235,215,0.04);
    box-shadow: 2px -2px 12px 0 rgba(0, 0, 0, 0.3); font-family: 'Times New Roman', 微软雅黑; border-radius: 20px">
    <!--    <i>我发布的</i>-->
    <div style="margin-top: 30px;">

      <el-table style=" width: 90%; margin-left: 5%;  border-radius: 10px;"
                :data="pageData1.slice((currentPage1-1) * pageSize1,
                currentPage1 * pageSize1 > pageData1.length ? pageData1.length : currentPage1 * pageSize1)"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="cellStyle"
                :row-style="{'height': 0+'px'}"
                @row-click="showinfo"
      >
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="project_id" label="任务编号" width="140"></el-table-column>
        <el-table-column prop="project_type" label="任务类型" width="120"></el-table-column>
        <el-table-column prop="project_name" label="任务名称" width="160"></el-table-column>
        <el-table-column prop="created_time" label="创建时间" width="160"></el-table-column>
        <el-table-column prop="username" label="发布人" width="160"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button-group>
              <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="yellow"
                             title="确认领取任务？" @confirm="openinwork(scope.row)">
                <el-button slot="reference" type="success" size="mini" icon="el-icon-folder-opened" @click.native.stop=""
                           :disabled="ismine(scope.row)"></el-button>
              </el-popconfirm>
            </el-button-group>

          </template>

        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination :current-page="currentPage1" :page-size="pageSize1" :total="pageData1.length"
                     layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5,8,10,20,50]"
                     @size-change="handleSizeChange1" @current-change="handlePageChange1" background
                     style="text-align: center; margin-top: 20px;"/>
    </div>
    <div style="height: 20px"></div>
  </div>
  <el-divider></el-divider>
  <el-dialog :visible.sync="showmsg" title="项目信息" style="font-family: 微软雅黑">
    <el-descriptions title="项目信息" border :label-style="{'width': '80px'}" column="2">
      <el-descriptions-item label="项目名称">{{this.rowinfo.project_name}}</el-descriptions-item>
      <el-descriptions-item label="项目类型">{{this.rowinfo.project_type}}</el-descriptions-item>
      <el-descriptions-item label="作者">{{this.rowinfo.username}}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{this.rowinfo.created_time}}</el-descriptions-item>
      <el-descriptions-item label="结束时间">{{this.rowinfo.finished_time}}</el-descriptions-item>
      <el-descriptions-item label="项目描述">{{this.rowinfo.project_info}}</el-descriptions-item>
      <el-descriptions-item label="项目内容">
        <el-image v-for="item in fileinfo" :key="item" :src="item" :preview-src-list="fileinfo"></el-image>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</div>
</template>

<script>
import {getfiles, getonlinetask, getusername, updatetask} from "@/utils/project";

export default {
  name: "Listtask",
  inject: ['reload'],
  created() {
    getusername().then(value => {
      this.userlist = value.data
      console.log(this.userlist)
      getonlinetask().then(value => {
        this.pageData1 = value.data;
        console.log(this.pageData1)
        for(let i in this.pageData1){
          this.pageData1[i]['created_time'] = this.getdate(this.pageData1[i]['created_time']);
          this.pageData1[i]['project_type'] = this.pageData1[i]['project_type'] === 1 ? "图片任务" : "视频任务";
          if(this.$data.pageData1[i]['finished_time'] === null){
            this.$data.pageData1[i]['finished_time'] = "----/--/-- --:--:--";
          }
          else {
            this.pageData1[i]['finished_time'] = this.getdate(this.pageData1[i]['finished_time'])
          }
          for(let j in this.userlist){
            if(this.pageData1[i]['user_id'] === this.userlist[j]['id']){
              this.pageData1[i]['username'] = this.userlist[j]['username']
            }
          }
        }
      })
    })
  },
  data(){
    return {
      totalPage1: 1,
      currentPage1: 1,
      pageSize1: 8,
      pageData1: [],

      rowinfo: [],
      fileinfo: [],
      showmsg: false,
      statelist: ['未开始', '已发布', '已领取', '进行中', '已结束'],
      userlist: []
    }
  },
  methods: {
    cellStyle(row){
      if(row.row.state === '未开始' && row.column.label === '状态'){
        return "text-align: center; color: #909399";
      }
      else if(row.row.state === '已发布' && row.column.label === '状态'){
        return "text-align: center; color: #E6A23C";
      }
      else if(row.row.state === '已领取' && row.column.label === '状态'){
        return "text-align: center; color: #E6A23C";
      }
      else if(row.row.state === '进行中' && row.column.label === '状态'){
        return "text-align: center; color: #E6A23C";
      }
      else if(row.row.state === '已结束' && row.column.label === '状态'){
        return "text-align: center; color: #67C23A";
      }
      else{
        return "text-align: center;";
      }
    },
    showinfo(row){
      this.$data.rowinfo = row;
      this.showmsg = true;
      getfiles(row.project_id).then(value => {
        this.fileinfo = [];
        if(value.data.length !== 0){
          for (var i = 0; i < value.data.length; i++){
            let tmp = require('../../../projects/files/' + value.data[i].img_name);
            this.fileinfo.push(tmp);
          }
        }
      })
      console.log(this.rowinfo);
    },
    handleSizeChange1: function (size){
      this.$data.pageSize1 = size;
      console.log(size)
    },
    handlePageChange1: function (currentPage){
      this.currentPage1 = currentPage;
      console.log(this.$data.currentPage1)
    },
    getdate(date){
      var tmp = new Date(date);
      var year = tmp.getFullYear();
      var month = tmp.getMonth() < 9 ? "0" + (tmp.getMonth() + 1) : (tmp.getMonth() + 1);
      var day = tmp.getDate() < 10 ? "0" + tmp.getDate() : tmp.getDate();
      var hour = tmp.getHours() < 10 ? "0" + tmp.getHours() : tmp.getHours();
      var minute = tmp.getMinutes() < 10 ? "0" + tmp.getMinutes() : tmp.getMinutes();
      var sec = tmp.getSeconds() < 10 ? "0" + tmp.getSeconds() : tmp.getSeconds();
      var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + sec;
      return time;
    },
    ismine(row){
      if(row.user_id === this.$store.state.currentid){
        return true;
      }
      else{
        return false;
      }
    },
    openinwork(row){
      this.rowinfo = row;
      updatetask(2, this.$store.state.currentid, this.rowinfo.project_id);
      this.$message.success('领取成功')
      this.$store.commit('changeproj', this.rowinfo);
      this.$router.push({name: 'Mytask', params: {id: this.$store.state.currentid}});
    },
  }
}
</script>

<style scoped>
.el-image{
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin: 10px 10px;
  transition: all 0.4s;
}
.el-image:hover{
  transform: scale(1.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}
</style>