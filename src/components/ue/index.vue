<template>
  <div>
    <script :id=id type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      id: {
        type: String
      },
      contentChange: {
        type: Function
      }
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor(this.id, this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
      // 动态监听函数
      this.editor.addListener('contentChange',(editor) => {
            this.$emit('contentChange', this.getUEContent())
            console.log('动态监听')
      });
      console.log("上传这堆错误不用理会，上传接口需自行开发配置");
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
      setUEContent(html) { // 获取纯文本内容方法
        // html = '<p><hy-mark></hy-mark></p>'+html
        return this.editor.setContent(html, true)
      },
      insertContent(html) { // 光标位置插入标签
        return this.editor.execCommand('inserthtml',html)
      }
    },
     destroyed() {
      this.editor.destroy();
    }
  }
</script>
