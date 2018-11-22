<template>
    <div class="dashboard-container">
        <div class="title">用户管理</div>
        <Search @add="add" :isShow="true" />
            <!-- 学员管理表格 -->
      <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort = "{prop: 'date', order: 'descending'}"
      >
            <el-table-column
            prop="id"
            label="用户id"
            width="180">
        </el-table-column>
        <el-table-column
            prop="nikeName"
            label="用户名"
            width="180">
        </el-table-column>
        <!-- <el-table-column
            prop="source"
            label="来源">
        </el-table-column>
        <el-table-column
            prop="iphone"
            label="手机号">
        </el-table-column> -->
        <el-table-column
            prop="registeredTime"
            sortable
            label="用户登录时间">
        </el-table-column>
        <el-table-column
            prop="loginTime"
            sortable
            label="用户下线时间">
        </el-table-column>
        <el-table-column
            prop="likeSum"
            sortable
            label="点赞数">
        </el-table-column>
        <el-table-column
            prop="browseSum"
            sortable
            label="浏览量">
        </el-table-column>
        <el-table-column
            prop="collectionSum"
            sortable
            label="收藏数">
        </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
    </el-pagination>
    </div>    
</template>

<script>
import Search from '@/components/search'
export default {
    components: {
        Search
    },
    data() {
        return {
            currentPage4: 2,
            tableData: [
                    {
                    id: '20160502',
                    nikeName: '王小虎',
                    source: 'ios',
                    iphone: '15711235689',
                    registeredTime: '2018-08-30',
                    loginTime: '2018-08-30',
                    likeSum: 299,
                    browseSum: 900,
                    collectionSum: 200
                },
                {
                    id: '20160502',
                    nikeName: '王小虎',
                    source: 'ios',
                    iphone: '15711235689',
                    registeredTime: '2018-08-30',
                    loginTime: '2018-08-30',
                    likeSum: 299,
                    browseSum: 900,
                    collectionSum: 200
                },{
                    id: '20160502',
                    nikeName: '王小虎',
                    source: 'ios',
                    iphone: '15711235689',
                    registeredTime: '2018-08-30',
                    loginTime: '2018-08-30',
                    likeSum: 299,
                    browseSum: 900,
                    collectionSum: 200
                },
                {
                    id: '20160502',
                    nikeName: '王小虎',
                    source: 'ios',
                    iphone: '15711235689',
                    registeredTime: '2018-08-30',
                    loginTime: '2018-08-30',
                    likeSum: 299,
                    browseSum: 900,
                    collectionSum: 200
                },{
                    id: '20160502',
                    nikeName: '王小虎',
                    source: 'ios',
                    iphone: '15711235689',
                    registeredTime: '2018-08-30',
                    loginTime: '2018-08-30',
                    likeSum: 299,
                    browseSum: 900,
                    collectionSum: 200
                },
                {
                    id: '20160502',
                    nikeName: '王小虎',
                    source: 'ios',
                    iphone: '15711235689',
                    registeredTime: '2018-08-30',
                    loginTime: '2018-08-30',
                    likeSum: 299,
                    browseSum: 900,
                    collectionSum: 200
            }]
        }
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        add(e){
          // 点击添加显示弹窗
          this.dialogFormVisible = e.isShow
        },
    }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
    @import "src/styles/mixin.scss";

</style>
