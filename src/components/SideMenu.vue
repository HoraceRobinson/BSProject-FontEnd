<template>
  <div class="sidemenu">
    <el-menu
        :default-active="$router.path"
        background-color="#2d283e"
        text-color="#d1d7e0"
        active-text-color="#802bb1"
        unique-opened
        router
        style="min-height: 100vh; width: 100%; border-right: 0">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-s-home" style="color: #564f6f"></i>
          <span>任务社区</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="listtask"><i class="el-icon-share" style="color: #564f6f"/>在线任务</el-menu-item>
          <el-menu-item index="mytask"><i class="el-icon-finished" style="color: #564f6f"/>我的任务</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-files" style="color: #564f6f"></i>
          <span>项目管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="createproj"><i class="el-icon-circle-plus-outline" style="color: #564f6f"/>新建项目</el-menu-item>
          <el-menu-item index="listproj"><i class="el-icon-s-operation" style="color: #564f6f"/>项目列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="resource" >
        <i class="el-icon-document" style="color: #564f6f"></i>
        <span slot="title">在线资源</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>


export default {
  name: "SideMenu",
}
</script>

<style scoped>
.el-menu-item-group >>> .el-menu-item-group__title{
  padding:0;
}
.el-submenu .el-menu-item{
  min-width: 100%
}

</style>

<script>

</script>