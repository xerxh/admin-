<template>
  <div class="btn-container">
    <el-button
      :type="config.type"
      @click="click"
      :size="config.size">
        {{config.btnName}}
    </el-button>
    <!-- 添加弹窗 -->
    <div
      @click.stop="stopClick">
      <el-dialog :title="config.title" 
        :width="config.width"
        center
        :visible.sync="dialogFormVisible">
        <!-- 表单弹窗展示主体 -->
        <slot name="myform" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyBtn',
  props: {
    postForm: {
      type: Function,
      required: false
    },
    config: {
      type: Object,
      required: true
    },
    initFormDate: {
      type: Function,
      required: false,
      default: function() {
        return
      }
    }
    // // 切换表单组件的显示和隐藏
    // isShow: {
    //   type: Boolean,
    //   required: false
    // }
  },
  data() {
    return {
      dialogFormVisible: false
    }
  },
  created() {

  },
  watch: {
    dialogFormVisible:function() {
      // 初始化页面表单元素
      console.log('改变')
      setTimeout(() => {
        this.$emit('initFormDate')
      },100)
      // this.$emit('initFormDate')
    }
  },
  methods: {
    init() {
      
    },
    submitForm() {
      // 触发父组件的提交表单元素函数
      // 同时在提交完成后改变表单的显示状态
      this.$emit('postForm')
      // this.dialogFormVisible = false
    },
    click() {
      this.dialogFormVisible = true
    },
    stopClick() {
      // 阻止事件冒泡 触发外部点击事件
      return
    }
  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";

.btn-container{
  display: inline-block;
}
</style>
