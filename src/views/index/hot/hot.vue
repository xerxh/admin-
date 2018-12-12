<template>
    <div>
      <!-- 热门推荐 -->
      <div :hidden="activeName != '1'">
        <MySearch
          @search="searchBanner"
          placeholder="热门课程" 
          >
          <MyBtn
            ref="addBannerForm"
            @postForm="postBannerAddForm"
            @initFormDate="initBannerForm"
            :config="bannerSelectBannerConfig">
            <el-form
              ref="bannerForm"
              slot="myform">
              <!-- <el-form-item
                label="类型:"
                :label-width="formLabelWidth">
                  <el-radio 
                    v-model="bannerRadio" 
                    label="1">课程</el-radio>
              </el-form-item> -->
              <div class="flex-row-between">
                <div class="form-box">
                  <!-- 课程 -->
                  <div>
                    <MySearch
                      @search="searchSlectBanner"
                      placeholder="姓名 / 昵称" 
                    >
                      <span 
                        slot="btnForm" 
                        class="searchSlectBannerTip">
                          *请选择热门课程
                      </span>
                    </MySearch>
                    <MyTable
                      ref="SelectCommodityTable"
                      :tableParams="searchSlectBannerTableParams"
                      :crudUrl="searchSlectBannerCrudUrl"
                      :height="200">
                      <!-- 插入选项框 -->
                      <el-table-column
                        slot="radioBox"
                        label="选择"
                        width="50">
                        <template scope="scope">
                          <el-radio
                            v-model="selectedTable" 
                            :label="scope.row.index"
                            @change.native="selectionBannerChange(scope.$index, scope.row)">&nbsp;</el-radio>
                        </template>
                      </el-table-column>
                    </MyTable>  
                    <el-form-item>
                      <span class="searchSlectBannerTip">
                        *选择的热门课程数据
                      </span>
                      <el-collapse accordion>
                        <el-collapse-item
                          :title="bannerAddCourse.name">
                          <div class="listBox">
                            {{bannerAddCourse.intro}}
                          </div>
                        </el-collapse-item>
                      </el-collapse>
                    </el-form-item>
                  </div>
                </div>
                <!-- 图片上传组件 -->
                <!-- <MyUpPic 
                  @getImgUrl="getImgUrl" 
                  :upParams="upParams" /> -->
              </div>
            </el-form>
          </MyBtn>
        </MySearch>
        <MyTable 
          ref="myBanner_table"
          :crudUrl="bannerCrudUrl"
          @rowClick="rowClick"
          :tableParams="bannerTableParams">
          <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <button
                  class="editBtn"
                  @click.stop="handleEdit(scope.$index, scope.row)">
                  <MyBtn
                    :ref="'bannerEditForm'+(scope.row.index)"
                    slot="btnForm"
                    :config="editBtnConfig"
                    @postForm="postEdit(scope.row)">
                  
                    <el-form
                      ref="editBannerForm"
                      slot="myform">
                      <div class="flex-row-between">
                        <div class="form-box">
                          <!-- 课程 -->
                          <div>
                            <MySearch
                              @search="searchSlectBanner"
                              placeholder="姓名 / 昵称" 
                            >
                              <span 
                                slot="btnForm" 
                                class="searchSlectBannerTip">
                                  *请选择热门课程
                              </span>
                            </MySearch>
                            <MyTable
                              ref="SelectCommodityTable"
                              :tableParams="searchSlectBannerTableParams"
                              :crudUrl="searchSlectBannerCrudUrl"
                              :height="200">
                              <!-- 插入选项框 -->
                              <el-table-column
                                slot="radioBox"
                                label="选择"
                                width="50">
                                <template scope="scope">
                                  <el-radio 
                                    v-model="selectedTable"
                                    :label="scope.row.index"
                                    @change.native="selectionBannerChange(scope.$index, scope.row)">&nbsp;</el-radio>
                                </template>
                              </el-table-column>
                            </MyTable>  
                            <el-form-item>
                              <span class="searchSlectBannerTip">
                                *选择的热门课程数据
                              </span>
                              <el-collapse accordion>
                                <el-collapse-item
                                  :title="bannerAddCourse.name">
                                  <div class="listBox">
                                    {{bannerAddCourse.intro}}
                                  </div>
                                </el-collapse-item>
                              </el-collapse>
                            </el-form-item>
                          </div>
                        </div>
                        <!-- 图片上传组件 -->
                        <!-- <MyUpPic
                          :img="upPicUrl" 
                          @getImgUrl="getImgUrl" 
                          :upParams="upParams" /> -->
                      </div>
                    </el-form>
                  </MyBtn>
                </button>

                <el-button
                type="primary"
                plain
                size="mini"
                @click="bannerDel(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
          </el-table-column>
        </MyTable>
      </div>
    </div>
    <!-- // 分页 -->
</template>

<script>
import MyBtn from '@/components/MyBtn'
import MyUpPic from '@/components/MyUpPic'
import search from '@/components/search'
import MyTable from '@/components/myTable'

import { pageComment } from '@/minxins/pageComment'

import { mapGetters } from 'vuex'
import { 
  hotUpUrl,
  hotDelUrl,
  hotAddUrl,
  hotSelectUrl,
  crudList, 
  Get 
  } from '@/api/util'

export default {
  name: 'hotTable',
  components:{
    MyBtn,
    MyUpPic,
    MySearch: search,
    MyTable
  },
  mixins: [pageComment],
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'token'
    ])
  },  
  data() {
    return {
      // banner列表的选项框
      bannerRadio: "1",
      // banner表格选中的数据
      selectedTable: '',
      // 图片上传参数
      upParams:[],
      activeName: "1",
      navTabs: [
        {
          value: 1,
          label: "banner数据"
        },
        {
          value: 2,
          label: "热门推荐"
        }
      ],
      // 搜索列表数据
      bannerCrudUrl: {
        // 查找列表数据接口
        selectUrl: hotSelectUrl
      },
      hotCrudUrl: {
        selectUrl: hotSelectUrl
      },
      searchSlectBannerCrudUrl: {
        selectUrl: '/hart/admin/curriculum/getCurriculumList'
      },
      searchSlectBannerTableParams: [
        {prop: 'name', label : '课程名称'}
      ],
      // banner列表参数设置
      bannerTableParams: [
        { prop: 'name', label: '名称' }
      ],
      // 编辑按钮配置
      editBtnConfig: {
        // 弹出框名称
        title: '修改热门课程信息',
        // 按钮名称
        btnName: '编辑',
        type: 'primary',
        size: 'mini',
        width: '50%'
      },
      // 搜索添加按钮配置
      bannerSelectBannerConfig: {
        // 弹出框名称
        title: '添加热门课程信息',
        // 按钮名称
        btnName: '添加',
        type: 'primary',
        size: 'mini',
        width: '50%'
      },
      // 添加banner-h5内容
      bannerAddContent: '',
      // 添加banner-课程内容
      bannerAddCourse: {},
      // 修改搜索内容
      searchEditContent: ''
    }
  },
  created() {
    this.upParams = [
        { key: 'token', value: this.token },
        { key: 'type0', value: 1 },
        { key: 'type1', value: 1 },
        { key: 'parentId', value: '' }
    ]
  },
  methods: {
    searchSlectBanner(val) {
      this.$refs.SelectCommodityTable.search(val)
    },
    // 选择banner数据
    selectionBannerChange(index, row) {
      this.bannerAddCourse = row
    },
    // 初始化banner数据
    initBannerForm() {
      this.bannerAddContent = ''
      this.bannerAddCourse = {}
      this.bannerRadio = '1'
      this.upPicUrl = ''
    },
    // 设置banner数据
    setBannerForm(row) {
      console.log(row)
      this.initBannerForm()
      this.bannerAddCourse = {name: row.name}
      this.upPicUrl = row.picurl
      this.bannerRadio = `${row.type}`
    },
    // 删除banner数据
    bannerDel(index, row) {
      var params = {
        token: this.token,
        guid: row.guid
      }
      var tip = '此操作将删除该课程所有信息, 是否继续?'
      var successTip = '删除成功!'
      var errorTip = '已取消删除!'
      this.$confirm(tip, '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          crudList(params, hotDelUrl)
            .then(res => {
              // 刷新数据
              this.$refs.myBanner_table.fetchData()
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
    },
    // 编辑banner数据
    handleEdit(index, row) {
      console.log('编辑')
      this.setBannerForm(row)
    },
    searchBanner(val) {
      this.$refs.myBanner_table.search(val)
    },
    searchHot(val) {
      this.$refs.myHot_table.search(val)
    },
    rowClick() {

    },

    postBannerAddForm() {
      // 如果bannerRadio选择的是 1课程 / 2 H5
      var params = {
        token: this.token,
        parentId: this.bannerAddCourse.curriculumId,
        // picurl: this.upPicUrl
      }
      crudList(params, hotAddUrl)
        .then(res => {
            this.$message('添加banner成功')
            this.$refs.myBanner_table.fetchData()
            this.$refs.addBannerForm.dialogFormVisible = false
        })
    },
    // 修改表格数据
    postEdit(row) {
      console.log(row)
      var params = {
        token: this.token,
        guid: row.guid,
        parentId: this.bannerAddCourse.curriculumId,
        // picurl: this.upPicUrl
      }
      crudList(params, hotUpUrl)
        .then(res => {
            this.$refs.myBanner_table.fetchData()
            const formRef = 'bannerEditForm'+row.index
            this.$refs[formRef].dialogFormVisible = false
            this.$message('编辑完成')
        })
    },
    handleClick(tab) {
      console.log(tab)
    }
  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";
.block {
  width: 50%;
  margin-top: 20px;
}
.el-input{
  width: 90%;
}
.addBox{
  text-align: center;
}
.editBtn{
  border: 0;
  padding: 0;
  outline: 0;
}
.flex-row-start > button{
  // margin-left: 20px;
  margin-bottom: 10px;
}
.searchSlectBannerTip{
  line-height: 30px;
  color: red;
  font-weight: bold;
}
.form-box{
  width: 80%;
}
</style>

<style>
  span.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
