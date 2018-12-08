<template>
  <div>
    <div class="orderList">
      <div class="searchPosition">
        <search 
          @search="search"
          placeholder="商品名称 / 订单号"
          />
      </div>
      <orderItem  
        v-for="(item, index) in tableData" 
        :key="index"
        :listData="item" />
    </div>
    <!-- 分页 -->
    <el-pagination
      :total="totalCount"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import search from '@/components/search'
import orderItem from '@/components/orderitem'
import { pagination } from '@/minxins/pagination'
import { mapGetters } from 'vuex'
import { 
  orderList,
  crudList 
} from '@/api/util'

export default {
  components: {
    orderItem,
    search
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'token'
    ])
  },  
  mixins: [pagination],
  data() {
    return {

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.setParams()
      crudList(this.params, orderList)
        .then(res => {
          this.setData(res)
          console.log(this.tableData)
        })
    },

  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";

.orderList{
  width: 90%;
  margin: 20px auto;
}
.searchPosition{
  margin-bottom: 20px;
}
</style>
