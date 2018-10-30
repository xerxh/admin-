import { mapGetters } from 'vuex'
import { crudList } from '@/api/util'
export const pageComment = {
  data() {
    return {
      // 图片上传参数
      upParams: [],
      // 上传后的地址
      upPicUrl: '',
      // 当前操作是编辑还是新增
      // 默认为新增  为true时是编辑
      isEdit: false,
      dialogDetailVisible: false,
      formLabelWidth: '80px',
      detailLabelWidth: '110px'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'token'
    ])
  },
  methods: {
    // 搜索数据
    search(val) {
      this.$refs.my_table.search(val)
    },
    // 从子组件获取上传的图片地址
    getImgUrl(imageUrl) {
      console.log('获取的图片地址' + imageUrl)
      this.upPicUrl = imageUrl
    },
    // 编辑修改
    handleEdit(index, row) {
      // this.initForm()
      console.log('编辑')
      this.setForm(row)
      this.isEdit = true
    },
    // 删除或修改状态
    switchState({ tip, params, url, successTip, errorTip }) {
      this.$confirm(tip, '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          crudList(params, url)
            .then(res => {
              // 刷新数据
              this.$refs.my_table.fetchData()
              this.$message({
                type: 'success',
                message: successTip
              })
            })
        })
        .catch(() => {
          this.$message({
              type: 'info',
              message: errorTip
          }) 
      }) 
    }
  }
}