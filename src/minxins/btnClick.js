
export const btnClick = {
  data() {
    return {
    }
  },
  methods: {
    // 编辑详情按钮 跳转到富文本编辑页面
    handleEditFormatText(params) {
      this.$router.push({
        name: 'formatText',
        params: params
      })
    }
  }
}
