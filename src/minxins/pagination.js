
export const pagination = {
  data() {
    return {
      // 记录列表加载状态
      listLoading: false,
      tableData: [],
      // 当期页数
      currentPage: 1,
      // 当前页可以显示的数据条数
      size: 10,
      // 总数据量
      totalCount: 0,
      // 搜索条件
      criteria: '',
      // 编辑修改状态记录
      isEdit: false,
      // 获取数据参数
      params: {}
    }
  },
  methods: {
    // 设置数据请求参数
    setParams() {
      this.params = {
        token: this.token,
        criteria: this.criteria || '',
        size: this.size,
        type: this.type || '',
        current: this.currentPage
      }
    },
    // 设置页面数据
    setData(res) {
      this.tableData = res.data.records
      this.tableData.map((item, index) => {
        item.index = ++index + (this.currentPage - 1) * this.size
        return item
      })
      this.totalCount = res.data.total
      this.listLoading = true
    },
    // 搜索数据
    search(val) {
      console.log(val)
      this.criteria = val
      this.fetchData()
    },
    // 当前页面最大显示数修改
    handleSizeChange(val) {
      this.size = val
      this.fetchData()
    },
    // 当前显示页页数修改
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    }
  }
}
