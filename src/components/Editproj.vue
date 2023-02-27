<template>
  <div style="background-color: rgba(220,223,230,0.3)">
    <div style="width: 100%; height: 50px; margin-top: 10px">
      <el-breadcrumb class="nav" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{name:'Listproj', params: {id: getid}}" v-if="taskorproj">项目列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{name:'Mytask', params: {id: getid}}" v-if="!taskorproj">我的任务</el-breadcrumb-item>
        <el-breadcrumb-item>{{getprojname}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{getpicture}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-divider></el-divider>
    <el-row :gutter="10" class="tagList">
      <el-col :span="17">
        <div style="margin-left: 20px;">
          <ui-marker
              ref="aiPanel-editor"
              class="ai-observer"
              :uniqueKey="uuid"
              :ratio="16 / 9"
              :imgUrl="currentInfo.currentBaseImage"
              @vmarker:onImageLoad="onImageLoad"
          ></ui-marker>
        </div>

      </el-col>
      <el-col :span="6">
        <div class="title">标签列表</div>
        <div class="tags" v-for="(v, i) in tags" :key="i">
          <el-tag size="middle" @click="setTag(v)">
            {{ v.tagName }}
          </el-tag>
          <i class="el-icon-delete" @click="delTag(i)"></i>
        </div>
        <div style="margin-left: 20px">
<!--          <el-button type="success" class="handleButton" @click="addTag">-->
<!--            添加标签-->
<!--          </el-button>-->
          <el-button type="primary" class="handleButton" @click="saveLabel">
            保存标注
          </el-button>
        </div>
        <div>
          <div class="title" style="margin-top: 25px">当前标注信息</div>
          <div class="labelinfo">
            {{allInfo}}
          </div>
        </div>
        <div style="margin-left: 20px">
          <el-button type="primary" class="handleButton" @click="showexp">导出标注文件</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 图片导航 -->
    <div class="pics">
      <div class="arrow arrow-left" @click="showMore('down')">
        <i class="el-icon-arrow-left" />
      </div>
      <div class="pic-container">
        <div class="pic-box" ref="picContainer">
          <div class="pic" v-for="(v, i) in pics" :key="i">
            <div
                class="info"
                :style="{ 'background-image': 'url(' + v.cropImage + ')'}"
                @click="activePic(v.cropImage)"
            ></div>
          </div>
        </div>
      </div>
      <div class="arrow arrow-right" @click="showMore('up')">
        <i class="el-icon-arrow-left" />
      </div>
    </div>

    <el-dialog title="保存标注文件" :visible.sync="showSave" width="400px" style="font-family: 微软雅黑;">
      <el-form ref="saveForm" :model="saveForm" label-width="80px">
        <el-form-item label="文件类型">
          <el-select v-model="saveForm.type" style="width: 250px">
            <el-option value="json" label="json"></el-option>
            <el-option value="COCO" label="COCO"></el-option>
            <el-option value="PASCAL VOC" label="PASCAL VOC"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件路径">
          <el-input :placeholder="saveForm.savePath" disabled v-model="saveForm.savePath" style="width: 250px;">
            <el-button slot="append" icon="el-icon-folder" type="success"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="文件名" v-show="saveForm.type === 'json'">
          <el-input :placeholder="getpicture+'-'+labeledtime" v-model="saveForm.file_name" style="width: 250px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 250px;" @click="saveLabelAsFile"><i class="el-icon-download"></i>保存文件 </el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
import { AIMarker } from 'vue-picture-bd-marker'
import {
  getfiles,
  getlabel,
  gettags,
  saveJSON,
  savelabel,
  saveprojCOCO,
  saveprojVOC,
  updatestate
} from "@/utils/project";
export default {
  name: 'Editproj',
  components: { 'ui-marker': AIMarker },
  data() {
    return {
      uuid: '0da9130',
      // 当前图片的信息，包含图片原本的高矮胖瘦尺寸
      currentInfo: {
        currentBaseImage:'',
        rawW: 0,
        rawH: 0,
        currentW: 0,
        currentH: 0,
        checked: false, // false表示当前图片还没有标记过
        data: [] // 表示图片矩形标记信息
      },

      pics: [],
      pic_name: [],
      active: 0, // 当前图片序号
      picTotal: 10, // 照片总数

      tags: [],
      allInfo: [], // 图片的矩形标记信息集合
      imageInfo: [], // 存储图片原始信息
      width: 0,
      height: 0,
      showSave: false,
      saveForm: {
        type: 'json',
        file_name: '',
        savePath: 'D:/BSProject/projects/outputs'
      },
      labeledtime: new Date().getTime()
    }
  },
  mounted() {
    getfiles(this.$store.state.currentprojid).then(value => {
      for(var i = 0; i < value.data.length; i++){
        let tmp = require('../../../projects/files/' + value.data[i].img_name);
        this.pics.push({cropImage: tmp});
        this.pic_name.push(value.data[i].img_name);
      }
      this.currentInfo.currentBaseImage = this.pics[0].cropImage;
      this.picTotal = this.pics.length;
      gettags(this.$store.state.currentprojid).then(value => {
        for(var i = 0; i < value.data.length; i++){
          let s = value.data[i].tag_name;
          this.tags.push({tagName: s, tag: s});
        }
        getlabel(this.$store.state.currentprojid, this.currentInfo.currentBaseImage).then(value => {
          if(value.data.length !== 0){
            for(let i in value.data){
              let tmp = value.data[i];
              this.allInfo.push({tag: tmp.tag, tagName: tmp.tagName, position:{x: tmp.x, x1: tmp.x1, y:tmp.y, y1: tmp.y1}, uuid: tmp.uuid, });
            }
          }
          this.$refs['aiPanel-editor'].getMarker().renderData(this.allInfo);
        })
      })
    })
  },
  methods: {
    showexp(){
      this.showSave = true;
      this.saveForm.file_name=this.getpicture+'-'+this.labeledtime
    },
    /**记录图片当前的大小和原始大小 data={rawW,rawH,currentW,currentH} */
    onImageLoad(data) {
      console.log(data)
      this.imageInfo = data
    },
    setTag(v) {
      this.allInfo = []
      this.$refs['aiPanel-editor'].getMarker().setTag(v)
      this.allInfo = this.$refs["aiPanel-editor"].getMarker().getData();
      this.labeledtime = new Date().getTime()
      console.log(this.currentInfo)
    },
    delTag(index) {
      this.tags.splice(index, 1)
    },
    close() {
      this.innerVisible = false
      this.$refs['innerForm'].resetFields()
    },
    saveLabel() {
      let data = this.$refs['aiPanel-editor'].getMarker().getData()

      this.allInfo = data

      let size = {width: this.imageInfo.rawW, height: this.imageInfo.rawH}
      let xmin = (parseInt(this.allInfo[0].position.x.substring(0, this.allInfo[0].position.x.length - 1)) * size.width) / 100
      console.log(xmin, '左上')
      let ymin = (parseInt(this.allInfo[0].position.y.substring(0, this.allInfo[0].position.y.length - 1)) * size.height) / 100
      console.log(ymin, '右手上')
      let xmax = (parseInt(this.allInfo[0].position.x1.substring(0, this.allInfo[0].position.x1.length - 1)) * size.width) / 100
      console.log(xmax, '右上')
      let ymax = (parseInt(this.allInfo[0].position.y1.substring(0, this.allInfo[0].position.y1.length - 1)) * size.height) / 100
      console.log(ymax, '左上')
      this.width = (xmax - xmin).toFixed(2);
      this.height = (ymax - ymin).toFixed(2);

      console.log(this.width, this.height)
      savelabel(this.$store.state.currentprojid, this.currentInfo.currentBaseImage, this.allInfo);

      updatestate(this.$store.state.currentprojid, 3);
      this.$message.success('标注信息已更新')

    },

    // 点击左右按钮显示更多
    showMore(v) {
      let el = this.$refs.picContainer
      if (v === 'up') {
        this.active++
        if (this.active >= this.picTotal - 5) {
          // 最后4张图
          this.active = this.pics.length - 5
          return
        }
        if (this.pics.length - 5 === this.active && this.pics.length < this.picTotal) {
          // this.photoPageIndex++
          this.getPhotos()
          return
        }
      } else {
        this.active--
        if (this.active < 0) this.active = 0
      }
      el.style.transform =
          'translateX(-' + (this.active / this.pics.length) * 100 + '%)'
    },

    getPhotos() {
      return this.$nextTick(() => {
        let el = this.$refs.picContainer
        if (el) {
          el.style.width = el.scrollWidth + 'px'
          el.style.transform = 'translateX(-' + (this.active / this.pics.length) * 100 + '%)'
        }
      })
    },
    /**得到当前点击图片*/
    activePic(v) {
      console.log(this.currentInfo.currentBaseImage.substring(5))
      this.allInfo = [];
      this.$refs['aiPanel-editor'].getMarker().clearData();
      this.currentInfo.currentBaseImage = v
      getlabel(this.$store.state.currentprojid, v).then(value => {
        if(value.data.length !== 0){
          for(let i in value.data){
            let tmp = value.data[i];
            this.allInfo.push({tag: tmp.tag, tagName: tmp.tagName, position:{x: tmp.x, y:tmp.y, x1: tmp.x1, y1: tmp.y1}, uuid: tmp.uuid, });
          }
        }
        this.$refs['aiPanel-editor'].getMarker().renderData(this.allInfo);
      })
    },
    saveLabelAsFile(){
      if(this.saveForm.type === 'json'){
        saveJSON(this.getpicture, this.allInfo, this.imageInfo, this.saveForm.file_name, this.labeledtime).then(value => {
          if(value.data.state === true){
            this.$message.success('标注信息已保存')
          }
          else{
            this.$message.error('标注信息保存失败')
          }
        })
      }
      else if(this.saveForm.type === 'PASCAL VOC'){
        saveprojVOC(this.$store.state.currentprojid).then(value => {
          if(value.data.state === true){
            this.$message.success('标注信息已保存')
          }
          else{
            this.$message.error('标注信息保存失败')
          }
        })
      }
      else if(this.saveForm.type === 'COCO'){
        saveprojCOCO(this.$store.state.currentprojid).then(value => {
          if(value.data.state === true){
            this.$message.success('标注信息已保存')
          }
          else{
            this.$message.error('标注信息保存失败')
          }
        })
      }
    },

    handleChange(label) {
      console.log(label)
    },
  },
  computed: {
    getid: function (){
      return this.$store.state.currentid;
    },
    getprojname: function (){
      return this.$store.state.currentprojname;
    },
    getpicture: function (){
      let tmp = 0;
      for(let i in this.pics){
        if(this.pics[i].cropImage === this.currentInfo.currentBaseImage){
          tmp = i;
        }
      }
      return this.pic_name[tmp];
    },
    taskorproj: function (){
      return this.$store.state.currenttype === 'project';
    }
  }
}
</script>

<style lang="scss" scoped>
.pics {
  width: 100%;
  overflow: hidden;
  margin-bottom: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  .arrow {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    //background-image: url('~@/assets/logo.png');
    background-repeat: no-repeat;
    background-size: contain;
    &.arrow-right {
      transform: rotate(180deg);
    }
  }
  .pic-container {
    width: calc(100% - 30px);
    height: 114px;
    margin: 0 auto;
    overflow: hidden;
    background-color: rgba(153, 153, 153, 0.1);
    .pic-box {
      height: 100%;
      min-width: calc(100% - 30px);
      transition: all 0.3s linear;
      display: flex;
      flex-wrap: nowrap;
    }
    .pic {
      float: left;
      border: 1px solid #ccc;
      box-sizing: border-box;
      margin-right: 10px;
      width: 185px;
      height: 114px;

      .info {
        width: 183px;
        height: 100%;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        border-color: #2d283e;
        position: relative;
        transform: scale(1);
        transition: all 0.3s;
        &:hover {
          //border: 1px solid skyblue;
          transform: scale(1.05);
          transition: all 0.3s;
        }
      }
    }
  }
}
.tagList {
  .title {
    font-weight: bold;
    font-family: 微软雅黑;
    margin-left: 20px;
    height: 30px;
    line-height: 20px;
  }
  .handleButton {
    width: 100%;
    margin-top: 10px;
  }
  .tags {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    margin-left: 20px;
    margin-top: 10px;
    font-family: 楷体;
    .el-icon-delete {
      color: cornflowerblue;
      cursor: pointer;
    }
  }
}
.nav{
  font-family: 微软雅黑;
  font-size: 18px;
  padding: 20px 20px;
  //margin-top: 20px;
  //margin-left: 20px;
}
.ai-observer{
  font-family: 楷体;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
  border-radius: 10px;
}
.el-tag{
  width: 270px
}
.labelinfo{
  background-color: rgba(220, 223, 230, 0.3);
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.4);
  margin-left: 20px;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  font-family: 'Times New Roman',楷体;
  color: #9ea3ab;
}
</style>

