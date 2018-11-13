<template>
  <div>
    <!-- 表格配置 -->
    <el-table
      v-loading="!listLoading"
      :data="tableData"
      :height="height"
      ref="selectTable"
      :default-sort = "{prop: 'date', order: 'descending'}"
      style="width: 100%;cursor:pointer;"
      element-loading-text="我已经飙到极限啦！！！---->火箭加载中"
      @selection-change="_selectionChange"
      @row-click="_rowClick"
    >
      <!-- 表格折叠行视图插槽 -->
      <slot name="expandView"/>
      <!-- 表格单选框 -->
      <slot name="radioBox"/>
      <!-- 表格多选框 -->
      <slot name="checkBox"/>
      <el-table-column
        label="编号"
        width="50"
        prop="index"
      />
      <!-- 第二行自定义插槽 -->
      <slot name="avatar" />
      <el-table-column
        v-for="(item, index) in tableParams"
        :key="index"
        :prop="item.prop"
        :width="item.width"
        :sortable="item.sort"
        :label="item.label"
      />
      <!-- 操作和状态默认插槽 -->
      <slot />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :total="totalCount"
      :current-page="currentPage"
      :page-sizes="[size, 20, 30, 40]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { crudList } from '@/api/util'
import { pagination } from '@/minxins/pagination'

export default {
  name: 'MyTable',
  components: {

  },
  mixins: [pagination],
  props: {
    // 表格列表参数
    tableParams: {
      type: Array,
      required: true
    },
    // 获取表格数据接口
    crudUrl: {
      type: Object,
      required: true
    },

    id: {
      type: String,
      required: false,
      default: ''
    },

    propParams: {
      type: Object,
      required: false,
      default: function() {
        return {}
      }
    },
    // 点击表格行触发回调
    rowClick: {
      type: Function,
      required: false,
      default: function() {
        return
      }
    },
    selectionChange: {
      type: Function,
      required: false,
      default: function() {
        return
      }
    },
    isExpand: {
      type: Boolean,
      required: false,
      default: false
    },
    height: {
      type: Number,
      required: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'token'
    ])
  },
  created() {
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    fetchData() {
      console.log(this.id)
      this.setParams(this.id, this.propParams)
      console.log(this.propParams)
      console.log('搜索')
      crudList(this.params, this.crudUrl.selectUrl)
        .then(res => {
          this.setData(res)
        })
    },
    _selectionChange(select) {
      console.log(select)
      this.$refs.selectTable.clearSelection()
      this.$emit('selectionChange', select)
    },
    _rowClick(row, cell, event) {
      this.$emit('rowClick', { row, cell, event })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
