<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" 
    icon="el-icon-upload" size="mini" type="primary" 
    @click=" dialogVisible=true">上传图片
    </el-button>
    <el-dialog width="30%" :visible.sync="dialogVisible" title="图片上传">
      <div class="flex-row-between">
        <div>
          <el-upload
            class="upload-demo"
            drag
            ref="upload"
            :show-file-list="false"
            :on-change="handlePreview"
            :auto-upload="false"
            limit:1
            :http-request="uploadPic">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
        <div class="img-box">
          <img :src="picImg" alt=""/>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <div class="img">
       <img :src="{picImg}" alt="">
    </div> -->
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import { uploadFile } from '@/api/upload'
import { mapGetters } from 'vuex'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
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
      file: '',
      dialogVisible: false,
      picImg: '',
      listObj: {},
      fileList: []
    }
  },
  methods: {
    uploadPic(){
      console.log('开始上传图片')
      let formData = new FormData()
      let file = this.file
      formData.append('file', file)
      formData.append('token', this.token)
      formData.append('type0', 0)
      formData.append('type1', 0)
      // 上传文件
      // uploadFile(formData)
      //     .then(res => {
      //       console.log(res)
      //       let picurl = res.data
            this.$emit('successCBK', 'picurl')
      //        this.picImg = ''
      // })
    },
    handleSubmit() {
      this.uploadPic()
      this.$refs.upload.clearFiles()
      console.log('提交')
      // console.log(arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handlePreview(file, fileList) {
        console.log(file);
        console.log(fileList)
        this.file = file.raw
        this.picImg = file.url
        console.log(this.picImg)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.editor-slide-upload {
  margin-bottom: 20px;
  // width: 300px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}

.img-box{
  width: 200px;
}
.img-box > img{
  width: 200px;
  height: 200px;
}
</style>
