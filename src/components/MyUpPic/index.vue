<template>
  <div class="up-avatar">
    <el-upload
      ref="upload"
      :show-file-list="false"
      :on-change="addFile"
      :on-progress="watchProgress"
      :auto-upload="true"
      :http-request="uploadPic"
      limit:1
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/">
      <img 
        v-if="imageUrl || img" 
        :src="imageUrl || img" 
        class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      <!-- <el-progress type="circle" class="progress"
      :percentage="80" color="#8e71c7"></el-progress> -->
      <!-- <div slot="tip" class="avatar-tip">
        <span @click="submitUpload">头像上传</span>
      </div> -->
    </el-upload>
  </div>
</template>

<script>
import { uploadFile } from '@/api/upload'
export default {
  name: 'MyUpPic',
  props: {
    upParams: {
      type: Array,
      required: true
    },
    // 上传完图片后传递图片地址给父组件的回调函数
    getImgUrl: {
      type: Function,
      default: () => {

      }
    },
    img: {
      type: String,
      required: false,
      default: ''
    }
  },
  created() {
    console.log(this.img)
    // this.imageUrl = this.img
  },
  data() {
    return {
      // 判断是否可以上传
      isCanUpload: false,
      // 上传完成后的图片url
      imageUrl: ''
    }
  },
  watch: {
    imageUrl: function() {
      console.log('监听图片地址变化 更新父组件中图片地址')
      this.$emit('getImgUrl', this.imageUrl)
    }
  },
  methods: {
    // 添加图片文件
    addFile(file) {
      console.log('添加文件')
      console.log(file)
      // this.form.imageUrl = URL.createObjectURL(file.raw);
      this.file = file.raw
      console.log(file.raw.type)
      const isJPG = file.raw.type === 'image/jpeg'
      const isLt2M = file.raw.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      else if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      else {
        // return isJPG && isLt2M
        this.isCanUpload = true
      }
    },
    // 监听图片上传进度条
    watchProgress(event) {
      console.log(2222)
      console.log(event)
    },
    uploadPic() {
      if (!this.isCanUpload) {
        return
      }
      console.log('开始上传图片')
      const formData = new FormData()
      const file = this.file
      formData.append('file', file)
      console.log(this.upParams)
      this.upParams.map(item => {
        formData.append(item.key, item.value)
      })
      this.imageUrl = ''
      console.log('发送图片地址')
      uploadFile(formData)
        .then(res => {
          console.log('上传成功')
          this.$message(res.msg)
          this.imageUrl = res.data
          console.log(res)
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";

 // .avatar-uploader .el-upload {
  //   border: 1px dashed #d9d9d9;
  //   border-radius: 6px;
  //   cursor: pointer;
  //   position: relative;
  //   overflow: hidden;
  // }
  // .avatar-uploader .el-upload:hover {
  //   border-color: #409EFF;
  // }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
  }
  .progress{
    position: relative;
    top: -150px;
  }
  .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .up-avatar{
    margin-left: 50px;
  }
  .avatar-tip{
    text-align: center;
    line-height: 50px;
  }
  .avatar-tip>span{
    border: 1px solid #409EFF;
    background: #409EFF;
    padding: 5px 10px;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
