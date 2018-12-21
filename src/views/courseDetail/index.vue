<template>
    <div class="dashboard-container">
        <div class="title course-title">课程下视频列表展示</div>
        <Search :isShow="false" @search="search" placeholder="视频名称"/>
        <div class="upVideoBox">
             <el-button type="success" round @click="showUpVideo">上传视频</el-button>
             <div class="progressBox">
                 <span>视频上传进度条:</span>
                 <div>
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" 
                    color="rgba(142, 113, 199, 0.7)"></el-progress>                       
                 </div>
             </div>
        </div>
        <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="我已经飙到极限啦！！！---->火箭加载中"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >   
            <el-table-column v-for="(item, index) in tableParams" :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width">
                
            </el-table-column>
            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <span @click="handleEdit(scope.$index, scope.row)">
                        <i class="el-icon-edit-outline"></i>
                    </span>
                    <span class="icon" @click="handleDelete(scope.$index, scope.row)">
                        <i class="el-icon-close"></i>
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="修改视频信息" 
        width="40%"
        center
        :visible.sync="dialogFormVisible">
            <el-form  status-icon  ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="视频名称" prop="pass">
                    <el-input type="text" v-model="videoName"></el-input>
                </el-form-item>
                <!-- <el-form-item  label="虚拟点赞数">
                    <el-input type="text" v-model="vrLickNum"></el-input>
                </el-form-item> -->
                <el-form-item>
                    <form id="form2">
                        <input id="addCover-file" type="file" @change="selectCover" style="display:none;"/>
                        <!-- <input id="addVideo-file" type="file" @change="selectVideo" style="display:none;"/> -->
                    </form>
                    <div class="row" style="padding:10px;">
                        <a id="addCover" href="javascript:void(0);" 
                        @click="upCover"
                        class="btn btn-outline">修改封面</a>
                        <!-- <a id="uploadFile" @click="UploadFile" href="javascript:void(0);"  class="btn btn-outline">上传视频和封面</a> -->
                    </div>
                    <div>
                        <video class="video" ref="video" 
                        v-if="videourl && picurl" controls :src="videourl"
                        :poster="picurl"></video>
                    </div>
                </el-form-item>
                <el-form-item label="视频简介">
                    <el-input  v-model="videoInfo"
                    :autosize="{ minRows: 5, maxRows: 5}"
                    type="textarea"/>
                </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateVideoText">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="添加课程视频" 
        width="45%"
        center
        :visible.sync="dialogVideoVisible">
            <el-form  status-icon  ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="课程名称" prop="pass">
                    <el-input type="text"  v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程简介">
                    <el-input 
                    v-model="form.intro" 
                    :autosize="{ minRows: 5, maxRows: 5}"
                    type="textarea"/>
                </el-form-item>
                <el-form-item>
                    <form id="form3">
                        <input id="addupVideo-file" type="file" @change="selectVideo" style="display:none;"/>
                        <input id="addupCover-file" type="file" @change="selectCover" style="display:none;"/>
                    </form>
                    <div class="row" style="padding:10px;">
                        <a id="addVideo" href="javascript:void(0);"
                        @click="addupVideo"
                        class="btn btn-outline">添加视频</a>
                        <a id="addCover" href="javascript:void(0);" 
                        @click="addupCover"
                        class="btn btn-outline">添加封面</a>
                        <!-- <a id="uploadFile" @click="UploadFile" href="javascript:void(0);"  class="btn btn-outline">上传视频和封面</a> -->
                    </div>
                    <div>
                        <video class="video" ref="video" 
                        v-if="videourl && picurl" 
                        controls :src="videourl"
                        :poster="picurl"></video>
                    </div>
                </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVideoVisible = false">取 消</el-button>
            <el-button type="primary" @click="UploadFile">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import Search from '@/components/search'
import $ from 'jquery'
import { 
  videoListUrl, 
  videoDelUrl, 
  crudList, 
  videoUpUrl, 
  videoSonAddUrl
  } from '@/api/util'
import { 
  uploadFileGet, 
  uploadFile, 
  uploadSignatureUrl
  } from '@/api/upload'
import { mapGetters } from 'vuex'

export default {
    components:{
        Search
    },
    computed: {
      ...mapGetters([
        'name',
        'roles',
        'token'
      ])
    }, 
    data() {
        return {
            dialogVideoVisible: false,
            dialogFormVisible: false,
            currentPage: 1,
            videoName: '2',
            videoInfo: 3,
            recommendId: '',
             // 搜索条件
            criteria: '',
            // 是否显示列表加载条
            listLoading: false,
            // 当前页是第几页
            currentPage: 1,
            // 当前也显示多少条数据
            size: 10,
            // 虚拟赞
            vrLickNum: 0,
            // 视频地址和封面图
            videourl : '',
            picurl : '',
            // 封面图文件
            coverFile: '',
            // 视频文件
            videoFile: '',
            // 当前视频的videoId
            videoId: '',
            // 视频上传进度条
            progress: 0,
            // 总数据量
            totalCount: 0,
            // 没有指定的属性为默认值
            tableParams : [
                // {prop: 'recommendId', label : '视频ID', width: 80},
                {prop: 'name', label : '视频名称'},
                {prop: 'intro', label : '视频简介'},
                // {prop: 'playnum', label : '虚拟播放量', width: 100},
                // {prop: 'realityPlaynum', label : '实际播放量', width: 100},
                {prop: 'duration', label : '视频时长', width: 80}
            ],
            tableData: [],
            form: {
                name: '',
                type: '',
                picurl: '',
                intro: '',
                // date: '',
                // desc: '',
                imageUrl: '',
                courseId: ''
            }
        }
    },
    created() {
        this.params = this.$route.params
        console.log(this.params)
        this.fetchData()
    },
    methods:{
        fetchData() {
          this.listLoading = true
          console.log('刷新数据')
          let params = {
            token: this.token,
            criteria: this.criteria || '',
            size: this.size,
            curriculumId: this.params.curriculumId,
            current: this.currentPage
          }
          crudList(params, videoListUrl).then(response => {
            console.log(response)
            this.tableData = response.data.records
            console.log(this.tableData)
            this.totalCount = response.data.total
            this.size = response.data.size
            console.log(this.tableData)
            this.listLoading = false
          })
        },
        handleSizeChange(val) {
            this.size = val
            this.fetchData()
            console.log(`每页 ${val} 条`);
        },
        // 搜索数据
        search(val) {
          console.log(val)
          this.criteria = val
          this.fetchData()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.fetchData()
            console.log(`当前页: ${val}`);
        },
        handleEdit(index, row) {
            console.log(row);
            this.recommendId = row.recommendId
            this.videoName = row.name
            this.videourl = row.videourl
            this.picurl = row.picurl
            this.videoInfo = row.intro
            this.videoId = row.videoId
            this.dialogFormVisible = true
        },
        // 删除
        handleDelete(index, row) {
          console.log(row);
          this.$confirm('此操作将删除该视频所有信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let params = {
                recommendId : row.recommendId,
                token : this.token
              }
              crudList(params, videoDelUrl)
                .then(res => {
                    this.fetchData()
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
            }) 
          }) 
        },
        updateVideoText(){
            console.log('点击了提交-----')
            console.log(this.coverFile)
            if(!this.coverFile){
              const params = {
                recommendId: this.recommendId,
                name: this.videoName,
                intro: this.videoInfo,
                playnum: this.vrLickNum,
                token: this.token
              }
              crudList(params, videoUpUrl)
                .then(res => {
                    this.$message('修改成功')
                    this.fetchData()
                    this.dialogFormVisible = false
                })
            }else{
              this.startUploader()
              this.dialogFormVisible = false
              $('#form2')[0].reset()
            }
            this.videourl = ''
            this.picurl = ''

        },
        upCover() {
            console.log('修改封面')
            $('#addCover-file').click();
        },
        addupVideo() {
            $('#addupVideo-file').click()
        },
        addupCover() {
            $('#addupCover-file').click()
        },
        selectCover(e){
            var coverFile = e.target.files[0];
            this.picurl = URL.createObjectURL(coverFile)
            this.coverFile = coverFile;
        },
        getSignature(callback){
            uploadFileGet(this.token)
                .then( res => {
                    console.log(res)
                    callback(res.data)
                })
        },
        // 修改封面图
        startUploader(){
                var _this = this
                console.log('开始上传')
                console.log(this.coverFile)
                qcVideo.ugcUploader.start({
                    coverFile: this.coverFile,
                    getSignature: this.getSignature,
                    fileId: this.videoId,
                    success: function(result){
                        console.log('封面上传成功')
                        if (result.type == 'cover'){
                            _this.$message({
                                message: '封面上传成功',
                                type: 'success'
                            });
                        }
                    },
                    error: function(result){
                        console.log('封面上传失败')
                        console.log(result)
                        _this.$message({
                            message: '封面图上传失败',
                            type: 'error'
                        });
                    },
                    finish: function(result){
                        console.log('封面上传成功——————————————————')
                        console.log(result)
                        let params = {
                            recommendId: _this.recommendId,
                            name: _this.videoName,
                            intro: _this.videoInfo,
                            playnum: _this.vrLickNum,
                            picurl: result.coverUrl,
                            token: _this.token
                        }
                        crudList(params, videoUpUrl).then(res => {
                            _this.$message('修改成功')
                            _this.fetchData()
                        })
                    }
                });
        },
        initForm () {
            this.form = {
                name: '',
                type: '',
                picurl: '',
                intro: '',
                // date: '',
                // desc: '',
                imageUrl: '',
                courseId: ''
            }
        },
        // 点击上传视频
        showUpVideo(index, row) {
            this.initForm()
            this.videourl = ''
            this.picurl = ''
            this.form.courseId = this.params.curriculumId
            this.dialogVideoVisible = true
        },
        // 选择上传视频  视频  和 封面图
        selectVideo(e) {
            if(e.target.files[0].type !== "video/mp4"){
                this.$message('请选择视频文件')
                return
            }
            var videoFile = e.target.files[0];
            console.log(videoFile)
            this.videourl = URL.createObjectURL(videoFile)
            this.videoFile = videoFile;
        },
        upVideo(){
            if(this.videoFile){
                if(!this.coverFile){
                     this.$message({
                            message: '没有上传封面图',
                            type: 'warning'
                    });
                    return
                }
                var _this = this
                console.log('开始上传')
                qcVideo.ugcUploader.start({
                    videoFile: this.videoFile,
                    coverFile: this.coverFile,
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
                        if(result.type == 'video') {
                            console.log(Math.floor(result.curr*100))
                            _this.progress = Math.floor(result.curr*100)
                        } 
                    },
                    finish: function(result){
                        console.log(result)
                        let videoTime = Math.floor(_this.$refs.video.duration)
                        let params = {
                            token: _this.token,
                            videoId: result.fileId,
                            curriculumId: _this.form.courseId,
                            name: _this.form.name,
                            videourl: result.videoUrl,
                            picurl: result.coverUrl,
                            intro: _this.form.intro,
                            duration: videoTime
                        }
                        crudList(params, videoSonAddUrl)
                            .then(res => {
                                console.log('上传完成————————')
                                _this.fetchData()
                                _this.progress = 0
                                console.log(res)
                            })
                        
                    }
                });
            } else {
               this.$message({
                    message: '请提交视频',
                    type: 'warning'
               });
            }
        },
        // selectUpCover (e) {
        //     var coverFile = e.target.files[0];
        //     this.picurl = URL.createObjectURL(coverFile)
        //     this.coverFile = coverFile;     
        // },
        // 提交视频添加信息
        UploadFile() {
            this.upVideo()
            $('#form3')[0].reset()
            this.videoFile = ''
            this.coverFile = ''
            this.dialogVideoVisible = false   
        }

    }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";

.dialog-footer{
    text-align: right;
}
.course-title{
    margin-left: 25px;
}
.icon{
    margin-left: 30px;
}
.video{
    width: 420px;
}
.btn{
    border: 1px solid gray;
    padding: 10px;
    border-radius: 4px;
}
.upVideoBox{
    text-align: right;
    top: -30px;
    // z-index: -10;
    width: 50%;
    margin-left: 50%;
    position: relative;
}
.progressBox{
    display: flex;
    justify-content: space-around;
    width: 500px;
    margin-top: 10px;
    position: absolute;
    right: 0;
}
.progressBox div{
    flex: 1;
    margin-left: 10px;
}
.upVideoBox .el-button{
    z-index: 100;
}
</style>
