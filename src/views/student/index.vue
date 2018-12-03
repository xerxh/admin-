<template>
  <div class="dashboard-container">
    <myTable
      :tableParams="tableParams"
      :isShowSearch="isShowSearch"
      :crudUrl="crudUrl">
      <el-table-column
        slot="avatar"
        label="用户"
        width="80">
        <template slot-scope="scope">
          <img
            :src="scope.row.avatarUrl"
            class="avatar">
        </template>
      </el-table-column>
    </myTable>
  </div>
</template>

<script>

import MyTable from '@/components/myTable'
import { 
  userSelectUrl
} from '@/api/util'
export default {
  components: {
    MyTable
  },
  data() {
    return {
      crudUrl: {
        // 查找列表数据接口
        selectUrl : userSelectUrl
      },
      // 是否启用搜索组件
      isShowSearch: false,
      // 没有指定的属性为默认值
      tableParams: [
        // {prop: 'index', label : '编号', width: 80},
        { prop: 'nickName', label: '用户昵称' },
        { prop: 'sources', label: '来源', width: 80 },
        { prop: 'sexName', label: '性别', width: 80 },
        { prop: 'mobile', label: '手机号', width: 80 },
        { prop: 'createDate', label: '注册时间'},
        { prop: 'lastLoginTime', label: '登录时间'},
        { prop: 'orderNum', label: '订单个数', width: 100 },
        { prop: 'collectNum', label: '收藏个数', width: 100 },
        { prop: 'readNum', label: '浏览量', width: 100, },
        { prop: 'surplus', label: '消费积分数', width: 100 },
        { prop: 'total', label: '总积分数', width: 100 }
      ]
    }
  },
  computed: {
   
  },
  created() {

  },
  methods: {
    
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.avatar{
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
