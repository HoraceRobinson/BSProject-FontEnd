<template>
  <div>
    <div style="width:100%; font-family: 微软雅黑; font-weight: bold; color: #564f6f; margin-top: 20px; font-size: 20px;">
      <span style="margin-left: 30px; text-shadow: 5px 5px 4px lightgray">我的项目</span>
      <el-divider></el-divider>
    </div>
    <div style="margin: 20px 30px; width: 95%;  background-color: rgba(250,235,215,0.04);
    box-shadow: 2px -2px 12px 0 rgba(0, 0, 0, 0.3); font-family: 'Times New Roman', 微软雅黑; border-radius: 20px">
      <div style="margin-top: 30px;">
      <el-table style=" width: 90%; margin-left: 5%;  border-radius: 10px;"
                :data="pageData.slice((currentPage-1) * pageSize,
                currentPage * pageSize > pageData.length ? pageData.length : currentPage * pageSize)"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="cellStyle"
                :row-style="{'height': 0+'px'}"
                @row-click="showinfo"
                >
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="project_id" label="项目编号" width="140"></el-table-column>
        <el-table-column prop="project_type" label="项目类型" width="120"></el-table-column>
        <el-table-column prop="project_name" label="项目名称" width="160"></el-table-column>
        <el-table-column prop="created_time" label="创建时间" width="160"></el-table-column>
        <el-table-column prop="finished_time" label="结束时间" width="160"></el-table-column>
        <el-table-column prop="state" label="状态" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="success" size="mini" icon="el-icon-folder-opened" @click.native.stop="openinwork(scope.row)"
              :disabled="isedit(scope.row)"/>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click.native.stop="editproj(scope.row)"
              :disabled="isedit(scope.row)"></el-button>
              <el-button type="primary" size="mini" icon="el-icon-download" @click.native.stop="saveresult(scope.row)"
                         :disabled="isedit(scope.row)"></el-button>
              <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="yellow"
                             title="确认发布项目？" @confirm="createtask(scope.row)">
                <el-button slot="reference" type="primary" size="mini" icon="el-icon-share" @click.native.stop=""
                :disabled="istask(scope.row)"></el-button>
              </el-popconfirm>
              <el-popconfirm confirm-button-text="确定" cancel-button-text="再想想" icon="el-icon-info" icon-color="red"
                             title="项目删除后内容不可恢复。确认删除？" @confirm="deleteproject(scope.row)">
                <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete" @click.native.stop=""
                :disabled="isedit(scope.row)"></el-button>
              </el-popconfirm>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
        </div>
      <div>
      <el-pagination :current-page="currentPage" :page-size="pageSize" :total="pageData.length"
                     layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5,8,10,20,50]"
       @size-change="handleSizeChange" @current-change="handlePageChange" background
      style="text-align: center; margin-top: 20px;"/>
        </div>
      <div style="height: 20px"></div>
    </div>

    <el-dialog :visible.sync="showmsg" title="项目信息" style="font-family: 微软雅黑">
      <el-descriptions title="项目信息" border :label-style="{'width': '80px'}" column="2">
        <el-descriptions-item label="项目名称">{{this.rowinfo.project_name}}</el-descriptions-item>
        <el-descriptions-item label="项目类型">{{this.rowinfo.project_type}}</el-descriptions-item>
        <el-descriptions-item label="作者">{{this.$store.state.currentuser}}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{this.rowinfo.created_time}}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{this.rowinfo.finished_time}}</el-descriptions-item>
        <el-descriptions-item label="项目描述">{{this.rowinfo.project_info}}</el-descriptions-item>
        <el-descriptions-item label="项目内容" v-if="this.rowinfo.project_type === '图片项目'">
          <el-image v-for="item in fileinfo" :key="item" :src="item" :preview-src-list="fileinfo"></el-image>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-drawer title="项目信息" :visible.sync="showdrawer" @closed="reset" :show-close=false  style="font-family: 微软雅黑" @close="reset">
      <el-form :model="projForm" :rules="rules" ref="projForm" class="proj-form"  label-width="80px" hide-required-asterisk>
        <el-form-item prop="project_name" label="项目名称">
          <el-input v-model="projForm.project_name" prefix-icon="el-icon-folder" placeholder="projForm.project_name" :disabled = true></el-input>
        </el-form-item>
        <el-form-item prop="project_creator" label="作者">
          <el-input v-model="projForm.project_creator" prefix-icon="el-icon-user" placeholder="projForm.project_creator" :disabled = true />
        </el-form-item>
        <el-form-item prop="project_type" label="项目类型">
          <el-input v-model="projForm.project_type" prefix-icon="el-icon-collection-tag" placeholder="projForm.project_type" :disabled = true />
        </el-form-item>
        <el-form-item prop="tags" label="标签">
          <el-tag v-for="tag in projForm.tags" :key="tag" closable @close="handleTagClose(tag)" size="medium">{{tag}}</el-tag>
          <el-input class="new-tag" v-if="available" v-model="inputTag" ref="saveTagInput" size="small" @keyup.enter.native="handleTagConf"
                    @blur="handleTagConf" ></el-input>
          <el-button v-else-if="buttonvisible" class="button-tag" size="small" @click="showinput" >+ 新标签</el-button>
        </el-form-item>
        <el-form-item prop="project_info" label="项目描述">
          <el-input type="textarea" v-model="projForm.project_info" placeholder="projForm.project_info" />
        </el-form-item>
        <el-form-item prop="filelist" label="项目文件">
          <el-upload action='http://localhost:3000/project/uploadfile' :file-list="filelist" list-type="picture" show-file-list
          :headers="headers" :on-success="filesuccess" :on-remove="removefile" :on-change="change" :disabled=true>
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button @click.native="savechange()" class="edit-btn" >保存</el-button>
      <el-button @click.native="reset()" class="edit-btn">取消</el-button>
    </el-drawer>
  </div>
</template>

<script>
import {
  changetags,
  deleteproj,
  getallproj,
  getfiles,
  gettags,
  saveprojVOC,
  settask
} from "@/utils/project";

export default {
  name: "Listproj",
  inject: ['reload'],
  created() {
    getallproj(this.$store.state.currentid).then(value => {
      this.$data.pageData = value.data;
      for (var i = 0; i < this.$data.pageData.length; i++){
        this.$data.pageData[i]['created_time'] = this.getdate(this.$data.pageData[i]['created_time']);
        this.$data.pageData[i]['project_type'] = this.$data.pageData[i]['project_type'] === 1 ? "图片项目" : "视频项目";
        this.pageData[i]['state'] = this.statelist[this.pageData[i]['state']];
        if(this.$data.pageData[i]['finished_time'] === null){
          this.$data.pageData[i]['finished_time'] = "----/--/-- --:--:--";
        }
        else{
          this.pageData[i]['finished_time'] = this.getdate(this.pageData[i]['finished_time'])
        }
      }
    });
  },
  data(){
    return{
      totalPage: 1,
      currentPage: 1,
      pageSize: 8,
      pageData: [],
      rowinfo: [],
      showmsg: false,
      choosework: false,
      showdrawer: false,

      available: false,
      inputTag: '',
      buttonvisible: true,
      projForm:{
        project_id: 0,
        project_name: '',
        project_creator: this.$store.state.currentuser,
        tags: [],
        project_info: '',
        project_type: '',
      },
      filelist:[],
      files: [],
      fileinfo: [],
      workspace: [],
      opener: '',
      headers: {
        Authorization: localStorage.getItem("token")
      },
      statelist: ['未开始', '已发布', '已领取', '进行中', '已结束'],
      uploadurl: "http://localhost:3000/project/uploadfile",
      rules:{
        project_name:[
          {
            required: true, message:"请输入项目名称", trigger: 'blur'
          },
          {
            min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur'
          }
        ]
      },
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
    handleSizeChange: function (size){
      this.$data.pageSize = size;
      console.log(size)
    },
    handlePageChange: function (currentPage){
      this.currentPage = currentPage;
      console.log(this.$data.currentPage)
    },
    showinput(){
      this.available = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleTagClose(tag){
      this.projForm.tags.splice(this.projForm.tags.indexOf(tag), 1);
      if(this.projForm.tags.length < 5){
        this.buttonvisible = true;
      }
    },
    handleTagConf(){
      let input = this.inputTag;
      if(input){
        this.projForm.tags.push(input);
      }
      this.available = false;
      if(this.projForm.tags.length === 5){
        this.buttonvisible = false;
      }
      this.inputTag = '';
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
    editproj(row){
      this.rowinfo = row;
      this.projForm.project_id = row.project_id;
      this.projForm.project_name = row.project_name;
      this.projForm.project_info = row.project_info;
      this.projForm.project_type = row.project_type;
      gettags(row.project_id).then(value => {
        if(value.data.length !== 0) {
          for (var i = 0; i < value.data.length; i++) {
            this.projForm.tags.push(value.data[i].tag_name);
          }
        }
        getfiles(row.project_id).then(value => {
          if(value.data.length !== 0){
            for (var i = 0; i < value.data.length; i++){
              let tmp = require('../../../projects/files/' + value.data[i].img_name);
              this.filelist.push({name: value.data[i].img_name, url: tmp});
            }
          }
          console.log(this.filelist);
        });
      });
      this.showdrawer = true;
    },
    reset(){
      this.showdrawer = false;
      this.projForm.tags = [];
      this.projForm.project_info = '';
      this.filelist = [];
      this.files = [];
    },
    savechange(){
      changetags(this.projForm.project_id, this.projForm.tags, this.projForm.project_info);
      this.showdrawer = false;
      this.$message({
        showClose: true,
        message: '项目信息已更改',
        type: 'success'
      });
      this.reload()
    },
    filesuccess(file){
      this.files.push(file.originalname);
      console.log(this.files)
    },
    removefile(file){
      this.files.splice(this.files.indexOf(file.name), 1);
    },
    change(){
      // console.log(this.showdrawer);
    },
    createtask(row){
      this.rowinfo = row;
      settask(row.project_id).then(value => {
        if(value.data.state === true){
          this.$message.success('任务已发布');
          this.reload();
        }
        else{
          this.$message.error('任务发布失败');
        }
      })
      console.log(row)
    },
    deleteproject(row){
      console.log('delete')
      this.rowinfo=row;
      deleteproj(row.project_id).then(value => {
        if(value.data.state === true){
          this.$message.success('项目已删除')
          this.reload()
        }
        else{
          this.$message.error('删除失败')
        }
      });
    },
    openinwork(row){
      this.rowinfo = row;
      this.$store.commit('changeproj', this.rowinfo);
      this.$store.commit('setproj')
      if(this.rowinfo.project_type === '图片项目'){
        this.$store.commit('setpic')
        this.$router.push({name: 'Editproj', params: {id: this.$store.state.currentid}});
      }
      else{
        this.$router.push({name: 'Test', params: {id: this.$store.state.currentid}});
      }
    },
    isedit(row){
      return row.state === '已发布' || row.state === '已领取';
    },
    istask(row){
      return row.state !== '未开始';
    },
    saveresult(row){
      saveprojVOC(row.project_id).then(value => {
        if(value.data.state === true){
          this.$message.success('项目标注文件导出成功')
        }
      })
    }
  },
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
.el-input >>> .el-input__inner{
  width:300px
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
  width: 70px;
  height: 28px;
}
.button-tag{
  margin-left: 5px;
  height: 28px;
  line-height: 26px;
  padding-top: 0;
  padding-bottom: 0;
}
.proj-form{
  width: 500px;
  margin-top: 15px;
  margin-left:25px
}
.el-textarea >>> .el-textarea__inner{
  font-family: 楷体;
  width: 300px;
}
.el-descriptions :not(.is-bordered) >>> .el-descriptions-item__cell{
  width: 200px;
  /*text-align: center;*/
}
>>> .el-upload-list__item{
  width: 70%
}
>>> .el-select-dropdown__item{
  font-family: 微软雅黑;
}
</style>