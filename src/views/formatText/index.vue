<template>
  <div>
    <div class="components-container flex-row-between">
        <!-- <code>
          {{'components.tinymceTips'}}
          <a target="_blank" class="link-type" href="https://panjiachen.github.io/vue-element-admin-site/component/rich-editor.html"> {{'components.documentation'}}</a>
        </code> -->
        <!-- <div> -->
        <div class="tinymceBox">
          <!-- <button @click="getUEContent()">获取内容</button> -->
          <div  class="editor-upload-btn">
              <editorImage color="#1890ff" @successCBK="imageSuccessCBK"/>
          </div>
          <div style="overflow:auto">
              <UE v-if="dataIsGet" :defaultMsg=defaultMsg @contentChange="contentChange" :config=config :id=ue1 ref="ue"></UE>
          </div>
          <!-- <tinymce :height="300" ref="tinymce" v-model="content"/> -->
        </div>
        <div  class="editor-content">
          <div class="see-title">手机效果预览</div>
          <div class="tip">
            &nbsp;&nbsp;&nbsp;&nbsp;使用提示：
            当富文本文章内图片尺寸过大时请将图片进行尺寸调整
            否则可能会造成小程序图片无法显示
          </div>
          <div class="see-box" v-html="viewContent"/>
        </div>
      </div>
      <div class="btn-box">
          <el-button @click="sendArticle" type="success">提交</el-button>
          <el-button @click="back" type="primary">取消</el-button>
      </div>
    <!-- <div class="ueditorBox">
      <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue"></UE>
    </div> -->
  </div>
</template>

<script>
import UE from '@/components/ue/index';
import Tinymce from '@/components/Tinymce'
import editorImage from '@/components/editorImage'
import { mapGetters } from 'vuex'
import { teacherUpUrl, crudList, Get } from '@/api/util'

export default {
  name: 'TinymceDemo',
  components: { Tinymce, UE, editorImage},
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  data() {
    return {
      defaultMsg: '',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      ue1: "ue1", // 不同编辑器必须不同的id
      ue2: "ue2",
      params: {},
      url: '',
      content: '',
      viewContent: '',
      type: '',
      dataIsGet: false
    }
  },
  created() {
    console.log('激活了哦 ')
    this.params = this.$route.params.content
    this.url = this.$route.params.url
    this.type = this.$route.params.type
    this.mark = this.$route.params.mark
    if(this.$route.params.mark){
      console.log('有标记')
      console.log(this.params.detail)
      this.dataIsGet = true
      this.defaultMsg = this.params.detail
    }else{
      console.log('没有标记')
      Get(`/hart/admin/universal/getRichText?id=${this.params.guid}&type=${this.type}`)
        .then(res => {
          console.log(res)
          this.dataIsGet = true
          if(!res.data) return
          this.defaultMsg = res.data
          console.log('开始'+this.defaultMsg)        
          console.log('结束'+this.dataIsGet)
          console.log(this.defaultMsg)
        })
      console.log('渲染完成')
    }
  },
  methods: {
    sendArticle() {
      console.log('发送文章')
      let params = this.params
      params.detail = this.content
      params.type = this.type
      var url = '/hart/admin/universal/updateRichText'
      if(this.mark){
        params.guid = this.params.guid
        url = this.url
      }
      console.log(this.content)
      if(!this.content){
        this.$message({
          message: '文章详情为空 不能提交',
          type: 'error'
        })
        return
      }
      console.log(this)
      let _this = this
      crudList(params, url)
        .then(res => {
          console.log('发布成功')
          this.$message(
            {
              message: '发布成功',
              type: 'success'
            }
        ),

             _this.$router.back()
             console.log('返回')
            // console.log(this.$router)
            // console.log(this.$refs.tinymce)
            // this.$refs.tinymce.setContent("")
            _this.$refs.ue.destroyed()
             _this.$destroy();
          })
    },
    back() {
      this.$router.back(-1)
      this.$destroy();
    },
    getUEContent() {
      console.log(this.defaultMsg)
      let content = this.$refs.ue.getUEContent(); // 调用子组件方法
      this.$notify({
        title: '获取成功，可在控制台查看！',
        message: content,
        type: 'success'
      });
      console.log(content)
    },
    imageSuccessCBK(picUrl) {
      console.log('图片上传')
      console.log(picUrl)
      var html = this.content
      console.log(this.$refs.ue)
      // 在之后进行追加标签
      // this.$refs.ue.setUEContent(`<p><img src="${picUrl}"/></p>`)
      // 监听光标位置进行插入
      this.$refs.ue.insertContent(`<p><img src="${picUrl}"/></p>`)
    },
    // 动态监听数据变化
    contentChange(content) {
      this.content =  content
      this.viewContent = content.split('_ueditor_page_break_tag_').join('')
      console.log(this.content)
    }
    // getEditor () {
    //   return 
    // }

  },
  // activated(){
  //     console.log('激活了哦 ')
  //     this.params = this.$route.params.content
  //     this.url = this.$route.params.url
  //     this.type = this.$route.params.type
  //     Get(`/hart/kss/universal/getRichText?id=${this.params.guid}&type=${this.type}`)
  //       .then(res => {
  //         console.log(res)
  //         if(!res.data) return
  //         this.content = res.data.detail
  //         // this.$refs.tinymce.setContent(this.content)
  //       })
  // }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";
.editor-content{
  position: fixed;
  right: 0;
  margin-top: 20px;
  // margin-right: 40px;
  width: 30%;
}
.see-box{
  border: 1px solid rgb(204, 204, 204);
  height: 500px;
  width: 400px;
  margin: auto;
  overflow: auto;
}
.see-box p {
  word-wrap:break-word;
}
.see-title{
  text-align: center;
}
.tinymceBox{
  width: 60%;
  height: 500px;
  // display: block;
  // display: flex;
  // position: fixed;
  // top: 50px;
}
.btn-box{
  text-align: center;
  position: fixed;
  bottom: 30px;
  right: 120px;
}
.ueditorBox{
  width: 832px;
}
.editor-upload-btn{
  position: fixed;
  top: 50px;
  right: 450px;
  z-index: 10000;
}
.tip{
  color: red;
}
</style>

