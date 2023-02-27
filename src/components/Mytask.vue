<template>
<div>
  <div style="width:100%; font-family: 微软雅黑; font-weight: bold; color: #564f6f; margin-top: 20px; font-size: 20px;">
    <span style="margin-left: 30px; text-shadow: 5px 5px 4px lightgray">我的发布</span>
  </div>
  <div style="margin: 10px 30px; width: 95%;  background-color: rgba(250,235,215,0.04);
    box-shadow: 2px -2px 12px 0 rgba(0, 0, 0, 0.3); font-family: 'Times New Roman', 微软雅黑; border-radius: 20px">
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
        <el-table-column prop="finished_time" label="结束时间" width="160"></el-table-column>
        <el-table-column prop="co_username" label="领取人" width="160"></el-table-column>
        <el-table-column prop="state" label="状态" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200px">
          <template slot-scope="scope">
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="yellow"
                           title="确认撤销任务发布？" @confirm="cancleup(scope.row)">
              <el-button slot="reference" type="danger" size="mini" icon="el-icon-circle-close" @click.native.stop=""
                         :disabled="isup(scope.row)"></el-button>
            </el-popconfirm>
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
  <div style="width:100%; font-family: 微软雅黑; font-weight: bold; color: #564f6f; margin-top: 20px; font-size: 20px">
    <span style="margin-left: 30px; text-shadow: 5px 5px 4px lightgray">已领取任务</span>
  </div>
  <div style="margin: 20px 30px; width: 95%;  background-color: rgba(250,235,215,0.04);
    box-shadow: 2px -2px 12px 0 rgba(0, 0, 0, 0.3); font-family: 'Times New Roman', 微软雅黑; border-radius: 20px">
    <!--    <i>我发布的</i>-->
    <div style="margin-top: 30px;">

      <el-table style=" width: 90%; margin-left: 5%;  border-radius: 10px;"
                :data="pageData2.slice((currentPage2-1) * pageSize2,
                currentPage2 * pageSize2 > pageData2.length ? pageData2.length : currentPage2 * pageSize2)"
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
        <el-table-column prop="finished_time" label="结束时间" width="160"></el-table-column>
        <el-table-column prop="state" label="状态" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="success" size="mini" icon="el-icon-folder-opened" @click.native.stop="openinwork(scope.row)"
                         :disabled="isedit(scope.row)"/>
              <el-popconfirm confirm-button-text="确定" cancel-button-text="再想想" icon="el-icon-info" icon-color="red"
                             title="任务结束后不可编辑。确认结束？" @confirm="finishtask(scope.row)">
                <el-button slot="reference" type="danger" size="mini" icon="el-icon-document-delete" @click.native.stop=""
                         :disabled="isedit(scope.row)"/>
              </el-popconfirm>
            </el-button-group>

          </template>

        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination :current-page="currentPage2" :page-size="pageSize2" :total="pageData2.length"
                     layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5,8,10,20,50]"
                     @size-change="handleSizeChange2" @current-change="handlePageChange2" background
                     style="text-align: center; margin-top: 20px;"/>
    </div>
    <div style="height: 20px"></div>
  </div>
  <el-divider></el-divider>
  <el-dialog :visible.sync="showmsg" title="项目信息" style="font-family: 微软雅黑">
    <el-descriptions title="项目信息" border :label-style="{'width': '80px'}" column="2">
      <el-descriptions-item label="项目名称">{{this.rowinfo.project_name}}</el-descriptions-item>
      <el-descriptions-item label="项目类型">{{this.rowinfo.project_type}}</el-descriptions-item>
      <el-descriptions-item label="作者">{{this.rowinfo.create_user}}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{this.rowinfo.created_time}}</el-descriptions-item>
      <el-descriptions-item label="结束时间">{{this.rowinfo.finished_time}}</el-descriptions-item>
      <el-descriptions-item label="项目描述">{{this.rowinfo.project_info}}</el-descriptions-item>
      <el-descriptions-item label="项目内容" v-if="this.rowinfo.project_type === '图片项目'">
        <el-image v-for="item in fileinfo" :key="item" :src="item" :preview-src-list="fileinfo"></el-image>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</div>
</template>

<script>
import {endtask, getfiles, getmytask, getuptask, getusername, updatestate} from "@/utils/project";

export default {
  name: "Mytask",
  inject: ['reload'],
  created() {
    getusername().then(value => {
      this.userlist = value.data;
      getuptask(this.$store.state.currentid).then(value => {
        this.$data.pageData1 = value.data;
        for (var i = 0; i < this.$data.pageData1.length; i++){
          this.$data.pageData1[i]['created_time'] = this.getdate(this.$data.pageData1[i]['created_time']);
          this.$data.pageData1[i]['project_type'] = this.$data.pageData1[i]['project_type'] === 1 ? "图片项目" : "视频项目";
          this.pageData1[i]['state'] = this.statelist[this.pageData1[i]['state']];
          this.pageData1[i]['create_user'] = this.$store.state.currentuser;
          if(this.$data.pageData1[i]['finished_time'] === null){
            this.$data.pageData1[i]['finished_time'] = "----/--/-- --:--:--";
          }
          else{
            this.pageData1[i]['finished_time'] = this.getdate(this.pageData1[i]['finished_time']);
          }
          for(let j in this.userlist){
            if(this.pageData1[i]['co_user'] === this.userlist[j]['id']){
              this.pageData1[i]['co_username'] = this.userlist[j]['username'];
            }
          }
        }
        getmytask(this.$store.state.currentid).then(value => {
          this.pageData2 = value.data;
          for(let i in this.pageData2){
            this.pageData2[i]['created_time'] = this.getdate(this.pageData2[i]['created_time']);
            this.pageData2[i]['project_type'] = this.pageData2[i]['project_type'] === 1 ? "图片任务" : "视频任务";
            this.pageData2[i]['state'] = this.statelist[this.pageData2[i]['state']];
            if(this.pageData2[i]['finished_time'] === null){
              this.pageData2[i]['finished_time'] = "----/--/-- --:--:--";
            }
            else{
              this.pageData2[i]['finished_time'] = this.getdate(this.pageData2[i]['finished_time']);
            }
            for(let j in this.userlist){
              if(this.pageData2[i]['user_id'] === this.userlist[j]['id']){
                this.pageData2[i]['create_user'] = this.userlist[j]['username']
              }
            }
          }
        })
      });
    })

  },
  data(){
    return {
      totalPage1: 1,
      currentPage1: 1,
      pageSize1: 8,
      pageData1: [],

      totalPage2: 1,
      currentPage2: 1,
      pageSize2: 8,
      pageData2: [],
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
    handleSizeChange2: function (size){
      this.$data.pageSize2 = size;
      console.log(size)
    },
    handlePageChange2: function (currentPage){
      this.currentPage2 = currentPage;
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
    isup(row){
      if(row.state === '已发布'){
        return false;
      }
      else{
        return true;
      }
    },
    cancleup(row){
      updatestate(row.project_id, 0);
      this.$message.success('任务撤销成功');
      this.reload()
    },
    openinwork(row){
      this.rowinfo = row;
      this.$store.commit('changeproj', this.rowinfo);
      this.$store.commit('settask')
      if(this.rowinfo.project_type === '图片任务'){
        this.$router.push({name: 'Editproj', params: {id: this.$store.state.currentid}});
      }
      else{
        this.$router.push({name: 'Test', params: {id: this.$store.state.currentid}});
      }

    },
    isedit(row){
      if(row.state === '已结束'){
        return true;
      }
      else{
        return false;
      }
    },
    finishtask(row){
      endtask(this.getcurrentdate(), row.project_id, 4).then(value => {
        if(value.data.state === true){
          this.$message.success('任务已提交')
        }
        else{
          this.$message.error('任务提交失败')
        }
        this.reload()
      })
    },
    getcurrentdate(){
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
    }
  }
}
</script>

<style scoped>
.el-descriptions :not(.is-bordered) >>> .el-descriptions-item__cell{
  width: 200px;
}
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