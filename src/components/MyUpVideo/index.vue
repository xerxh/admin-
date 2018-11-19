<template>
  <div>
    <form id="form2">
      <input 
        id="addVideo-file" 
        type="file"
        style="display:none;"
        @change="selectVideo"/>
      <input 
        id="addCover-file"
        style="display:none;" 
        type="file" 
        @change="selectCover"/>
    </form>
    <div class="row">
      <a id="addVideo" href="javascript:void(0);"
      @click="addVideo"
      class="btn btn-outline">添加视频</a>
      <a id="addCover"  href="javascript:void(0);" 
      @click="addCover"
      class="btn btn-outline">添加封面</a>
      <!-- <a id="uploadFile" 
      @click="UploadFile" 
      href="javascript:void(0);"
      class="btn btn-outline">
        上传视频和封面
      </a> -->
    </div>
    <div class="videoBox">
      <span>预览</span>
      <video class="previewVideo" ref="video" 
        v-if="upVideo && posterVideo" controls 
        :src="upVideo"
        :poster="posterVideo"></video>
    </div>
  </div>
</template>

<script>
import { 
  uploadFileGet,
  uploadFile, 
  uploadSignatureUrl
} from '@/api/upload'

import { mapGetters } from 'vuex'

import { 
  crudList,
  Get
} from '@/api/util'

import store from '@/store'
export default {
  name: 'MyUpVideo',
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'token'
    ])
  },
  data() {
    return {
      videoFileList: [],
      coverFileList: [], 
      // 上传视频的地址
      upVideo: '',
      // 上传的封面图地址
      posterVideo: '',
      // 视频成功参数
      params: {},
      // 视频上传进度
      progress: 0
    }
  },
  components: {

  },
  methods: {
    // 添加视频
    addVideo(){
      $('#addVideo-file').click();
    },
    // 添加视频封面图
    addCover(){
      $('#addCover-file').click();
    },
    // 上传视频和封面图
    UploadFile() {

    },
    // 获取视频上传 腾讯云签名
    getSignature(callback){
      uploadFileGet(this.token)
        .then( res => {
            console.log(res)
            callback(res.data)
        })
    },
    // 选取视频
    selectVideo(e){
      console.log(e.target.files[0])
      if(e.target.files[0].type !== "video/mp4"){
          this.$message('请选择视频文件')
      }
      var videoFile = e.target.files[0];
      console.log(videoFile)
      let url = URL.createObjectURL(videoFile)
      this.upVideo = url
      this.videoFileList[0] = videoFile;
      $('#result').append(videoFile.name +　'\n');
    },
    // 选取封面图
    selectCover(e){
        var coverFile = e.target.files[0];
        this.posterVideo = URL.createObjectURL(coverFile)
        this.coverFileList[0] = coverFile;
        $('#result').append(coverFile.name +　'\n');
    },
    // 视频上传进度和状态
    startUploader(id, name){
      console.log(this.videoFileList.length)
      return new Promise( (resolve, reject) => {
        if(this.videoFileList.length){
          // var num = this.addUploaderMsgBox();
          console.log(this.coverFileList)
          if(!this.coverFileList[0]){
                this.$message({
                      message: '没有上传封面图',
                      type: 'warning'
              });
          }
          var _this = this
          console.log('开始上传')

          resolve()

          var resultMsg = qcVideo.ugcUploader.start({
              videoFile: this.videoFileList[0],
              coverFile: this.coverFileList[0],
              getSignature: this.getSignature,
              allowAudio: 1,
              success: function(result){
                  console.log(result)
                  if(result.type == 'video') {
                      console.log(result)
                      _this.$message({
                              message: '视频上传成功',
                              type: 'success'
                      });
                      // this.cosBox[num] = null;
                  } else if (result.type == 'cover') {
                      _this.$message({
                          message: '封面上传成功',
                          type: 'success'
                      });
                  }
              },
              error: function(result){
                  console.log(result)
                  if(result.type == 'video') {
                      _this.$message({
                          message: '视频上传失败',
                          type: 'error'
                      });
                  } else if (result.type == 'cover') {
                      _this.$message({
                          message: '封面图上传失败',
                          type: 'error'
                      });
                  }
              },
              progress: function(result){
                  console.log(_this.tableData);

                  if(result.type == 'video') {
                      console.log(`视频进度___${_this.index}`+Math.floor(result.curr*100))
                      // console.log(_this.tableData[_this.index])
                      // let array = _this.tableData[_this.index]
                      // array.progress = Math.floor(result.curr*100)
                      // _this.$set(_this.tableData, _this.index, array)
                      var progress = Math.floor(result.curr*100)
                      store.dispatch('getProgress', progress)
                  } 
              },
              finish: function(result){
                  console.log(result)
                  let videoTime = Math.floor(_this.$refs.video.duration)
                  // 视频成功参数
                  _this.params = {
                      token: _this.token,
                      videoId: result.fileId,
                      name: name,
                      videourl: result.videoUrl,
                      picurl: result.coverUrl,
                      //传递过来的数据
                      curriculumId: id,
                      // intro: intro,
                      duration: videoTime
                  }
                  crudList(_this.params, '/hart/admin/curriculum/addCurriculumVedio')
                      .then(res => {
                          console.log('上传完成————————')
                          // successFunc()
                          resolve('完成了')
                          $('#form2')[0].reset()
                          _this.videoFileList = []
                          _this.coverFileList = []
                          _this.upVideo = ''
                          _this.posterVideo = ''
                          store.dispatch('getProgress', 0)
                          // _this.fetchData()
                          console.log(res)
                      })
                  
              }
          });
          if(resultMsg){
              $('[name=box'+num+']').text(resultMsg);
          }
        } else {
          this.$message({
              message: '请提交视频',
              type: 'warning'
          });
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";

.videoBox{
  height: 300px;
  text-align: center;
  display: flex;
  flex-direction: column;
  vertical-align:top;
}
// .video{
//     height: 300px;
//     width: 450px;
// }
.previewVideo{
  margin: 0 auto;
  height: 300px;
  width: 450px;
  border: 4px solid #cccccc;
}
.row{
  padding:10px;
  display: flex;
  justify-content: space-around;
  padding-left:55px;
}
.btn{
    border: 1px solid gray;
    padding: 5px 10px;
    border-radius: 4px;
    background: blanchedalmond;
}
</style>
