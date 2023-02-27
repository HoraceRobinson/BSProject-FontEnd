<template>
  <div class="work-cont">
    <div class="workspace-default">
      <div style="height: 40vh; margin-top: 20px">
        <el-row :gutter="12">
          <el-col :span="6" v-for="i in 4" :key="i" :offset="i>1?6*(i-1):0">
            <el-card shadow="always" round style="margin-left: 50px; margin-top: 10px; " :body-style="{padding: '0px'}" @click.native="editproj()">
              <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                   class="image">
              <div style="padding: 10px">
                <span style="font-size: 15px; font-weight: bold">项目管理<br></span>
                <div style="margin-top: 5px">
                  <el-tag size="mini" style="font-size: 10px">图片</el-tag>
                  <el-tag size="mini" style="margin-left: 10px; font-size: 10px">图片</el-tag>
                  <el-tag size="mini" style="margin-left: 10px; font-size: 10px">图片</el-tag>
                </div>
                <div style="margin-top: 5px">
                  <span style="color: #999999; font-size: 10px">项目一</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div style="height: 40vh">
        <el-row :gutter="12">
          <el-col :span="6" v-for="i in 4" :key="i" :offset="i>1?6*(i-1):0">
            <el-card shadow="always" round style="margin-left: 50px; margin-top: 10px; " :body-style="{padding: '0px'}">
              <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                   class="image">
              <div style="padding: 10px">
                <span style="font-size: 15px; font-weight: bold">项目管理<br></span>
                <div style="margin-top: 5px">
                  <el-tag size="mini" style="font-size: 10px">图片</el-tag>
                  <el-tag size="mini" style="margin-left: 10px; font-size: 10px">图片</el-tag>
                  <el-tag size="mini" style="margin-left: 10px; font-size: 10px">图片</el-tag>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div style="height: 5vh; text-align: center">
        <el-pagination layout="prev,pager,next,jumper" :total="11"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Workspace",
  data() {
    return {
      currentDate: new Date(),
      projid: '1'
    }
  },
  methods: {
    editproj(){
      this.$router.push({name: 'Editproj', params:{projid: this.$data.projid}});
    }
  }
}
</script>

<style scoped>

.work-cont {
  width: 100%;
  /*background-image: linear-gradient(to bottom, #);*/
  /*background-color: #564f6f;*/
  margin-top: 0;
}

.workspace-default {
  position: absolute;
  width: 83%;
  height: 93vh;
  margin-left: 20px;
  margin-top: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  background-color: rgba(244, 250, 215, 0.3);
  overflow-y: visible;
  font-family: "微软雅黑";
  /*background-image: linear-gradient(to bottom right, #57ba98, #3b945e);*/
}

.el-card {
  width: 200px;
  height: 250px;
  position: absolute;
  border-radius: 8px;
  border-color: rgba(86, 79, 111, 0);
}

.el-card:hover {
  transform: scale(1.1);
  box-shadow: 10px 10px 30px;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.image {
  width: 100%;
  height: 150px;
  display: block;
}
</style>