<template>
    <div class="dashboard-container">
        <!-- <div class="title">运营管理</div>    -->
        <div class="flex-row-start">

        <el-button type="success" size="mini" @click="addCompany">公司简介</el-button>

        <el-button type="danger" size="mini" @click="addHelp">帮助中心</el-button>

        </div>
        <el-tabs 
          v-model="activeName" 
          type="card" 
          @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in navTabs" 
            :key="index"
            :label="item.label" 
            :name="`${item.value}`"></el-tab-pane>
        </el-tabs>
        <!-- 类别数据 -->
        <div :hidden="activeName != '1'">
          <MyBtn
            ref="addForm"
            @postForm="postBigForm"
            :config="addBigTypeConfig">
            <el-form
              slot="myform">
              <div class="addBox">
                <!-- 图片上传组件 -->
                <MyUpPic
                  ref="myPic"
                  :upParams="upParams"
                  @getImgUrl="getImgUrl" />
                <el-form-item
                  label="类型名称" 
                  :label-width="formLabelWidth">
                  <el-input v-model="typeValue"/>
                </el-form-item>
              </div>
            </el-form>
          </MyBtn>
          <!-- 类型树 -->
          <div class="block">
            <el-tree
              :data="types"
              node-key="value"
              default-expand-all
              :expand-on-click-node="false">
              <span 
                class="custom-tree-node" 
                slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span @click="() => append(data)">
                  <!-- <div
                    type="text"
                    size="mini"
                    @click="() => append(data)"> -->
                    <MyBtn
                      :ref="`addTypesBtn${data.value}`"
                      @postForm="postForm"
                      :config="addBtnConfig">
                      <el-form
                        slot="myform">
                        <div class="addBox">
                          <!-- 图片上传组件 -->
                          <MyUpPic
                            ref="`myPic${data.value}`"
                            :upParams="upParams"
                            @getImgUrl="getImgUrl" />
                          <el-form-item
                            label="类型名称" 
                            :label-width="formLabelWidth">
                            <el-input v-model="typeValue"/>
                          </el-form-item>
                        </div>
                      </el-form>
                    </MyBtn>
                  <!-- </div> -->
                  <el-button
                    type="text"
                    size="mini"
                    @click="(event) => edit(data)">
                    <MyBtn
                      :ref="`addBtn${data.value}`"
                      @postForm="editTypesForm(data)"
                      :config="editBtnTypeConfig">
                      <el-form
                        slot="myform">
                        <div class="addBox">
                          <!-- 图片上传组件 -->
                          <MyUpPic
                            ref="`myPic${data.value}`"
                            :upParams="upParams"
                            :img="upPicUrl"
                            @getImgUrl="getImgUrl" />
                          <el-form-item
                            label="类型名称" 
                            :label-width="formLabelWidth">
                            <el-input v-model="typeValue"/>
                          </el-form-item>
                        </div>
                      </el-form>
                    </MyBtn>
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)">
                    删除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
        <!-- 搜索数据 -->
        <div :hidden="activeName != '2'">
          <MyBtn
            ref="addSearchForm"
            @postForm="postSearchAddForm"
            :config="searchAddBtnConfig">
            <el-form
              slot="myform">
              <el-form-item
                label="搜索内容" 
                :label-width="formLabelWidth">
                <el-input v-model="searchAddContent"/>
              </el-form-item>
            </el-form>
          </MyBtn>
          <MyTable 
            ref="my_table"
            :crudUrl="crudUrl"
            @rowClick="rowClick"
            :tableParams="tableParams">
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <button
                    class="editBtn"
                    @click.stop="handleEdit(scope.$index, scope.row)">
                    <MyBtn
                      :ref="'editForm'+(scope.row.index)"
                      slot="btnForm"
                      :config="editBtnConfig"
                      @postForm="postEdit(scope.row)">
                      
                      <el-form
                        slot="myform">
                        <el-form-item
                          label="搜索内容" 
                          :label-width="formLabelWidth">
                          <el-input v-model="searchEditContent"/>
                        </el-form-item>
                      </el-form>
                    </MyBtn>
                  </button>

                  <el-button
                  type="primary"
                  plain
                  size="mini"
                  @click="handleDel(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
            </el-table-column>
          </MyTable>
        </div>
        <!-- 虚拟用户 -->
        <!-- <div :hidden="activeName != '3'">
          <MyBtn
            ref="addSearchForm"
            @postForm="postSearchAddForm"
            :config="searchAddBtnConfig">
            <el-form
              slot="myform">
              <el-form-item
                label="搜索内容" 
                :label-width="formLabelWidth">
                <el-input v-model="searchAddContent"/>
              </el-form-item>
            </el-form>
          </MyBtn>
          <MyTable 
            ref="my_table"
            :crudUrl="crudUrl"
            @rowClick="rowClick"
            :tableParams="tableParams">
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <button
                    class="editBtn"
                    @click.stop="handleEdit(scope.$index, scope.row)">
                    <MyBtn
                      :ref="'editForm'+(scope.row.index)"
                      slot="btnForm"
                      :config="editBtnConfig"
                      @postForm="postEdit(scope.row)">
                      
                      <el-form
                        slot="myform">
                        <el-form-item
                          label="搜索内容" 
                          :label-width="formLabelWidth">
                          <el-input v-model="searchEditContent"/>
                        </el-form-item>
                      </el-form>
                    </MyBtn>
                  </button>

                  <el-button
                  type="primary"
                  plain
                  size="mini"
                  @click="handleDel(scope.$index, scope.row)">
                    删除
                  </el-button>
                </template>
            </el-table-column>
          </MyTable>
        </div> -->
    </div>
    <!-- // 分页 -->
</template>

<script>
import MyBtn from '@/components/MyBtn'
import MyUpPic from '@/components/MyUpPic'
import Search from '@/components/search'
import MyTable from '@/components/myTable'

import { pageComment } from '@/minxins/pageComment'

import { mapGetters } from 'vuex'
import { 
  courseTypesSelectUrl,
  courseTypesUpUrl,
  courseTypesAddUrl,
  courseTypesDelUrl,
  searchSelectUrl, 
  searchAddUrl, 
  searchUpUrl, 
  searchDelUrl, 
  crudList, 
  Get 
  } from '@/api/util'

let id = 1000;
export default {
    components:{
      MyBtn,
      MyUpPic,
      Search,
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
        // 图片上传参数
        upParams:[],
        // 子类添加配置
        addBtnConfig: {
          // 弹出框名称
          title: '添加类别',
          // 按钮名称
          btnName: '添加',
          type: 'text',
          size: 'mini',
          width: '40%'
        },
        // 修改
        editBtnTypeConfig: {
           // 弹出框名称
          title: '修改类别',
          // 按钮名称
          btnName: '修改',
          type: 'text',
          size: 'mini',
          width: '40%'
        },
        // 添加大类配置
        addBigTypeConfig: {
          // 弹出框名称
          title: '添加类别',
          // 按钮名称
          btnName: '添加最高类别',
          type: 'primary',
          size: 'mini',
          width: '40%'
        },
        // 当前操作的节点数据默认为最高节点
        typeData: -1,
        // 输入的type
        typeValue: '',
        // 树结构数据
        types: [],
        activeName: "1",
        navTabs: [
          {
            value: 1,
            label: "类别"
          },
          {
            value: 2,
            label: "搜索"
          },
          // {
          //   value: 3,
          //   label: "虚拟用户"
          // }
        ],
        // 搜索列表数据
        crudUrl: {
          // 查找列表数据接口
          selectUrl: searchSelectUrl
        },
        // 搜索列表参数设置
        tableParams : [
          { prop: 'content', label: '搜索内容' },
          { prop: 'createDate', label: '搜索创建时间' }
        ],
        // 编辑按钮配置
        editBtnConfig: {
          // 弹出框名称
          title: '修改老师信息',
          // 按钮名称
          btnName: '编辑',
          type: 'primary',
          size: 'mini',
          width: '40%'
        },
        // 搜索添加按钮配置
        searchAddBtnConfig: {
          // 弹出框名称
          title: '添加搜索设置',
          // 按钮名称
          btnName: '添加',
          type: 'primary',
          size: 'mini',
          width: '40%'
        },
        // 添加搜索内容
        searchAddContent: '',
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
      this.getTypesTree()
    },
    methods: {
      rowClick() {

      },

      setForm(row) {
        this.searchEditContent = row.content
      },

      postSearchAddForm() {
        const params = {
          token: this.token,
          content: this.searchAddContent
        }
        crudList(params, searchAddUrl)
          .then(res => {
              this.$message('添加搜索成功')
              this.$refs.my_table.fetchData()
              this.$refs.addSearchForm.dialogFormVisible = false
          })
      },
      // 修改表格数据
      postEdit(row) {
        const params = {
          token: this.token,
          content: this.searchEditContent,
          guid: row.guid
        }
        crudList(params, searchUpUrl)
          .then(res => {
              this.$message('修改搜索成功')
              this.$refs.my_table.fetchData()
              const myRefs = 'editForm'+row.index
              this.$refs[myRefs].dialogFormVisible = false
          })
      },
      // 删除内容
      handleDel(index, row) {
        this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              const params = {
                token: this.token,
                guid: row.guid
              }
              crudList(params, searchDelUrl)
                .then(res => {
                    this.$refs.my_table.fetchData()
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
            }) 
          }) 
      },
      // 获取类别树
      getTypesTree() {
        const selectUrl = `${courseTypesSelectUrl}?token=${this.token}`
        Get(selectUrl)
          .then(res => {
            this.types = res.data
          })
      },

      handleClick(tab) {
        console.log(tab)
      },

      append(data) {
        // console.log(data)
        this.typeData = data.value
      },
      edit(data) {
        this.typeData = data.value
        this.typeValue = data.label
        this.upPicUrl = data.picurl
      },
      editTypesForm(row) {
        const params = {
          token: this.token,
          categoryId: this.typeData,
          name: this.typeValue,
          picurl: this.upPicUrl
        }
        crudList(params, courseTypesUpUrl)
          .then(res => {
            var myRefs = 'addBtn' + this.typeData
            this.getTypesTree()
            this.$message('修改成功')
            this.$refs[myRefs].dialogFormVisible = false
            console.log(res)
          })
      },
      postBigForm () {
        const params = {
          token: this.token,
          parentId: -1,
          name: this.typeValue,
          picurl: this.upPicUrl
        }
        crudList(params, courseTypesAddUrl)
          .then(res => {
            console.log(res)
            var myRefs = 'addForm'
            var myPicRefs = 'myPic'
            this.$refs[myPicRefs].imageUrl = ''
            this.$refs[myRefs].dialogFormVisible = false
            this.getTypesTree()
            this.$message('添加成功')
          })
        this.upPicUrl = ''
        this.typeValue = ''
      },
      postForm() {
        const params = {
          token: this.token,
          parentId: this.typeData,
          name: this.typeValue,
          picurl: this.upPicUrl
        }
        console.log(this.typeData+'________________')

        crudList(params, courseTypesAddUrl)
          .then(res => {
            console.log(res)
            console.log('+++++++++++++++=')
            var myRefs = 'addTypesBtn' + this.typeData
            // this.$refs[myPicRefs].imageUrl = ''
            console.log(this.$refs)
            this.$refs[myRefs].dialogFormVisible = false
            this.getTypesTree()
            this.$message('添加成功')
          })
        this.upPicUrl = ''
        this.typeValue = ''
      },

      remove(node, data) {
        console.log(data)
        console.log(data.children.length)
        if(data.children.length){
          this.$message('该类别下有子类别！无法进行删除')
          return
        }
        this.$confirm('请确认是否进行删除', '提示', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            })
            .then(() => {
              const params = {
                token: this.token,
                categoryId: data.value
              }
              crudList(params, courseTypesDelUrl)
                .then(res => {
                  this.getTypesTree()
                  this.$message('删除成功')
                })
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消操作'
                }) 
            }) 
      },

      addCompany() {
        Get(`/hart/kss/admin/system/getHartDetail?token=${this.token}`)
            .then(res => {
                console.log(res)
                let guid = res.data.guid
              this.$router.push({name: 'formatText', params:{
                  content:{
                      token: this.token,
                      guid: guid,
                      detail: res.data.detail
                  },
                  mark: 'system',
                  url: '/hart/kss/admin/system/updateHartDetail'
              }})  
            })
      },

      addHelp() {
          Get(`/hart/kss/admin/system/getHelpInfo?token=${this.token}`)
            .then(res => {
                console.log(res)
                let guid = res.data.guid
              this.$router.push({name: 'formatText', params:{
                  content:{
                      token: this.token,
                      guid: guid,
                      detail: res.data.detail
                  },
                  mark: 'system',
                  url: '/hart/kss/admin/system/updateHelpInfo'
              }})  
            })
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
