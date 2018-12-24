<template>
  <div class="dashboard-container">
    <!-- <div class="title">课程管理</div> -->
    <!-- 搜索组件 -->
    <Search
      ref="search"
      @search="search"
      placeholder="姓名 / 昵称" 
    >
      <!-- 添加和添加的表单 -->
      <MyBtn
        slot="btnForm"
        ref="addBtn"
        :config="addBtnConfig"
        @initFormDate="initcourseAddForm"
        @postForm="addClick">
        <!-- 添加显示的表单内容 -->
        <el-form
          slot="myform"
          ref="addForm"
          status-icon
          :model="addCourseForm">
          <div class="flex-row-start">
            <div class="form-box">

                <el-form-item
                :label="item.label"
                :label-width="formLabelWidth"
                v-for="(item, index) in addCourseForm.list"
                :prop="`list.${index}.val`"
                :rules="item.rules"
                :key="index">
                  <!-- 选项下拉框 -->
                  <el-cascader
                    v-if="item.label == '课程类别'"
                    :options="item.options"
                    change-on-select
                    v-model="item.val"
                  ></el-cascader>

                  <el-select
                      v-else-if="item.label == '授课老师'"
                      v-model="item.val"
                      multiple
                      placeholder="请选择相关老师">
                      <el-option
                      v-for="option in item.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value">
                      </el-option>
                  </el-select>
                  <!-- input输入框表单 -->
                  <el-input 
                    v-else
                    v-model="item.val"/>
                </el-form-item>  

            </div>
            <!-- 图片上传组件 -->
            <MyUpPic
              ref="addPic" 
              @getImgUrl="getImgUrl"
              :upParams="upAddParams" />
          </div>
          <div>
              <el-form-item 
                :label-width="formLabelWidth"
                :prop="'desc'"
                :rules="validateDetail"
                label="课程简介">
                  <el-input v-model="addCourseForm.desc" 
                  :autosize="{ minRows: 5, maxRows: 5}"
                  type="textarea"/>
              </el-form-item>
          </div>
        </el-form>               
      </MyBtn>        
    </Search>
    <div class="navPosition">
      <el-cascader
        :options="classificationOptions"
        change-on-select
        size="small"
        v-model="selectTypes"
        @change="handleChange" /> 
      <el-button type="mini" @click="resetTypes">重置课程分类</el-button>
    </div>

    <MyTable 
      ref="my_table"
      :crudUrl="crudUrl"
      :isExpand="isExpand"
      @rowClick="rowClick"
      :propParams="propParams"
      :tableParams="tableParams">
      <!-- 折叠行插槽视图内容 -->
      <el-table-column
        slot="expandView"
        type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item
                v-for="(item, index) in tableSonParams" 
                :label="item.label+':'" 
                :key="index">
                <span>{{ props.row[item.prop] }}</span>
              </el-form-item>
            </el-form>
          </template>
      </el-table-column>
      <!-- 默认插槽内容 -->
      <el-table-column label="是否置顶" width="90">
        <template slot-scope="scope">
          <el-button
          size="mini"
          @click="handleTop(scope.$index, scope.row)">
              {{scope.row.recdNo > 0 ? '是' : '否'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否发布" width="100"
        prop="onlineStatus">
        <template slot-scope="scope">
          <el-button
          size="mini"
          type="danger"
          @click="handleRelease(scope.$index, scope.row)">
            {{formateOnlineStatus(scope.row.onlineStatus)}}
              <!-- {{scope.row.onlineStatus == 2 ? '是' : '否'}} -->
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <button
              class="editBtn"
              @click.stop="handleEdit(scope.$index, scope.row)">
              <MyBtn
                :ref="'editForm'+(scope.row.index)"
                :config="editBtnConfig"
                @postForm="postEdit(scope.row)">
                
                <el-form
                  slot="myform"
                  :ref="'editFormRefs'+(scope.row.index)"
                  status-icon
                  :model="courseEditForm">
                  <div class="flex-row-start">
                    <div class="form-box">

                        <el-form-item
                        :label="item.label"
                        :label-width="detailLabelWidth"
                        v-for="(item, index) in courseEditForm.list"
                        :prop="`list.${index}.val`"
                        :rules="item.rules"
                        :key="index">
                          <!-- 选项下拉框 -->
                          <el-cascader
                            v-if="item.label == '课程类别'"
                            :options="item.options"
                            change-on-select
                            @change="handCourseChange"
                            v-model="item.val"
                          ></el-cascader>
                          <!-- input输入框表单 -->
                          <el-input 
                            v-else
                            v-model="item.val"/>
                        </el-form-item>  

                    </div>
                    <!-- 图片上传组件 -->
                    <MyUpPic 
                      :img="courseEditForm.imageUrl"
                      @getImgUrl="getImgUrl" 
                      :upParams="upParams" />
                  </div>
                  <div>
                      <el-form-item 
                        :label-width="formLabelWidth"
                        :prop="'desc'"
                        :rules="validateDetail"
                        label="老师简介">
                          <el-input v-model="courseEditForm.desc" 
                          :autosize="{ minRows: 5, maxRows: 5}"
                          type="textarea"/>
                      </el-form-item>
                  </div>
                </el-form>   
              </MyBtn>
            </button>

            <el-button
            type="primary"
            plain
            size="mini"
            @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
      </el-table-column>
      <el-table-column label="课程视频" width="100">
        <template slot-scope="scope">
          <a id="uploadVideoNow" href="javascript:void(0);">
            <!-- 上传视频按钮和表单组件 -->
            <MyBtn
              @postForm="postVideoForm(scope.row)"
              :ref="'upVideo'+(scope.row.index)"
              :config="upVideoBtn">
              <!-- 腾讯云视频上传 -->
              <div slot="myform">
                <div>
                  <label for="" class="inputLabel">章节名称:</label>
                  <div class="inputBox">
                    <el-input type="text" 
                      v-model="inputLabel" />
                  </div>
                </div>
                <MyUpVideo ref="myVideo"/>
              </div>
            </MyBtn>  
          </a>
        </template>
      </el-table-column>
      <el-table-column label="视频进度" width="100">
        <template slot-scope="scope">
            <el-progress
              :ref="'progress'+(scope.row.index)"
              :text-inside="true" 
              :stroke-width="18" 
              :percentage="scope.row.progress"></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="查看评论" width="100">
        <template slot-scope="scope">
            <el-button
                size="mini"
                type="warning"
                @click="handleRecommend(scope.$index, scope.row)">
                    查看评论
            </el-button>
        </template>
      </el-table-column>
      <el-table-column label="编辑详情" width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="handleEditFormatText(scope.$index, scope.row)">
            编辑详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="添加老师" width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="addTeach(scope.$index, scope.row)">
            添加老师
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="相关推荐" width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="addCourseSuggest(scope.$index, scope.row)">
            相关推荐
          </el-button>
        </template>
      </el-table-column>
    </MyTable>

  </div>
</template>

<script>
import Search from '@/components/search'
import MyTable from '@/components/myTable'
import MyUpPic from '@/components/MyUpPic'
import MyBtn from '@/components/MyBtn'
import MyUpVideo from '@/components/MyUpVideo'

import { pageComment } from '@/minxins/pageComment'

import { 
  teachersSelectUrl,
  courseSelectUrl, 
  courseDelUrl,
  courseAddUrl, 
  courseUpUrl,
  courseNavListUrl, 
  crudList,
  Get
} from '@/api/util'

import { isRequired, regTest, minMaxLen } from '@/utils/validate'

export default {
  components: {
    Search,
    MyTable,
    MyUpPic,
    MyBtn,
    MyUpVideo
  },
  mixins: [pageComment],   
  data() {
    // 姓名验证
    const validateName = [
      isRequired('该项为必填项', 'blur'),
      // minMaxLen(1, 10),
      // regTest(/^[\u4E00-\u9FA5]+$/, '姓名只能为中文')
    ]
    // 昵称验证
    const validateNickName = [
      isRequired('该项为必填项', 'blur'),
      regTest(/^[0-9.]+$/, '只能输入数字')
    ]
    const validateDetail = [
      isRequired('请输入老师简介', 'blur')
    ]
    const validateDate = [
      isRequired('请选择出生日期', 'blur')
    ]
    return {
      validateName: validateName,
      validateNickName: validateNickName,
      validateDetail: validateDetail,
      validateDate: validateDate,
      // 二级分类
      classificationOptions: [
        {
          value: 'zhinan',
          label: '指南',
          children:[
            {
              value: 'zhinan',
              label: '指南2', 
            }
          ]
        },
        {
          value: 'zhinan',
          label: '指南2',
        }
      ],
      crudUrl: {
        // 查找列表数据接口
        selectUrl: courseSelectUrl
      },
      // 所有老师的数据
      teachers: [],
      // 添加课程初始化数据
      addCourseForm: {
        imageUrl: '',
        curriculumId: '',
        desc: '',
        index: '', // 记录在表格中的位置
        list: {
          courseName: {val: '',label: '课程名称',rules: validateName},
          courseSum: {val: '', label: '虚拟数量', rules: validateNickName},
          coursePrice: {val: '', label: '课程价格', rules: validateNickName},
          courseType: {val: [], label: '课程类别', prop: 'typeName', 
            options: [
              { 
                value: 1,
                label: '通识课',
                children: [
                  {value: 1, label: '基础课'},
                  {value: 2, label: '进阶课'}
                ]
              },
              {
                value: 2,
                label: '专业课',
                children: [
                  {value: 1, label: '一对一'},
                  {value: 2, label: 'Weekly Reding'}
                ]
              }
            ]
          }
        }
      },
      // 图片上传参数
      upParams:[],
      // 更新上传参数
      upAddParams: [],
      // 上传后的地址
      upPicUrl: '',
      // 添加按钮组件配置参数
      addBtnConfig: {
        // 弹出框名称
        title: '添加课程信息',
        // 按钮名称
        btnName: '添加课程',
        type: 'primary',
        size: 'mini',
        width: '40%'
      },
      editBtnConfig: {
        // 弹出框名称
        title: '修改课程信息',
        // 按钮名称
        btnName: '编辑',
        type: 'primary',
        size: 'mini',
        width: '40%'
      },
      upVideoBtn: {
        title: '视频上传',
        btnName: '上传视频',
        type: 'success',
        size: 'mini',
        width: '40%'
      },
      // 需要提交的表单信息
      // 同时作为表单回显的展示
      courseEditForm: {
        imageUrl: '',
        curriculumId: '',
        desc: '',
        index: '', // 记录在表格中的位置
        list: {
         courseName: {val: '', label: '课程名称',rules: this.validateName},
          courseSum: {val: '', label: '虚拟点赞数', rules: this.validateNickName},
          courseSum: {val: '', label: '虚拟购买数量', rules: this.validateNickName},
          coursePrice: {val: '', label: '价格', rules: this.validateNickName},
          courseType: {val: [], label: '课程类别', prop: 'typeName', 
            options: []
          }
        }
      },
      // 没有指定的属性为默认值
      tableParams: [
        {prop: 'name', label : '课程名称'}
      ],
      // 启用myTable组件的折叠行
      isExpand: true,
      // 折叠行参数列表
      tableSonParams: [
        {prop: 'name', label : '课程名称'},
        {prop: 'intro', label : '课程简介'},
        {prop: 'discountPrice', label : '价格'},
        {prop: 'virtualPurchases', label : '虚拟购买数'},
        {prop: 'createDate', label : '创建时间'},
        {prop: 'onlinetime', label : '上线时间'},
        {prop: 'offlinetime', label : '下线时间'},
        {prop: 'minCategoryName', label : '类型一'},
        {prop: 'maxCategoryName', label : '类型二'},
        {prop: 'videoNum', label : '视频个数'},
        {prop: 'teacherNum', label : '老师个数'},
        {prop: 'recommendNum', label : '推荐个数'},
        // {prop: 'url', label : '文章地址'}
      ],
      // 置顶位置
      recommendno: 0,
      // 正在上传视频的进度条
      progressIndex: '',
      // 正在上传视频的数据
      progressRow: {},
      // 视频名称
      inputLabel: '',
      // 修改选择的类型
      editTypes : '',
      // 选择的数据
      propParams: {},
      // selectTypes 分类搜索选择
      selectTypes: []
    }
  },
  created(){
    this.getNavList()
    // 初始化更新图片上传参数
    this.upAddParams = [
      { key: 'token', value: this.token },
      { key: 'type0', value: 1 },
      { key: 'type1', value: 1 },
      { key: 'parentId', value: '' }
    ]
  },
  updated() {
   
  },
  watch: {
    // 监听上传进度条 并绑定到视图
    progress:function(val, oldVal) {
      console.log('进度条')
      let table = this.$refs.my_table
      let row = this.progressRow
      row.progress = this.progress
      // 更新数组对应的视图
      table.$set(table.tableData, (this.progressIndex - 1), row);
    }
  },
  methods: {
    formateOnlineStatus(val) {
      if(val == 2) {
        return '是'
      }
      else if(val == 1) {
        return '否'
      }else{
        return '否'
      }

    },
    // 重置课程分类
    resetTypes() {
      this.selectTypes = []
      this.$refs.my_table.fetchData()
    },
    // 获取当前选中的类名
    handleChange(val) {
      this.options = val
      // console.log(this.$refs.search)
      const id = val[val.length-1]
      console.log(id)
      this.propParams = {categoryId: id }
      console.log(this.propParams)
      this.$refs.my_table.fetchData()
      // this.$refs.search.search()
    },
    handCourseChange(val) {
      console.log('改变修改')
      this.editTypes = val
      console.log(this.courseEditForm)
    },
    // 获取所有老师的数据列表
    getTeachers(curriculumId) {
      const params = {
        curriculumId: curriculumId,
        token: this.token
      }
      crudList(params, teachersSelectUrl)
        .then(res => {
          console.log(res)
        })
    },
    // 获取类别树状列表
    getNavList() {
      const url = `${courseNavListUrl}?token=${this.token}`
      Get(url)
        .then(res => {
          console.log(res)
          this.classificationOptions = res.data
          this.addCourseForm.list.courseType.options = this.classificationOptions
        })
    },
    // 设置图片上传参数 
    setUpParams() {
      this.upParams = [
          { key: 'token', value: this.token },
          { key: 'type0', value: 1 },
          { key: 'type1', value: 1 },
          { key: 'parentId', value: this.courseEditForm.curriculumId }
      ]
    },
    // 提交视频上传
    postVideoForm(row) {
      console.log('提交视频')
      let name = this.inputLabel
      this.$refs.myVideo.startUploader(row.curriculumId, name)
      const myRefs = 'upVideo'+row.index
      this.$refs[myRefs].dialogFormVisible = false
      this.inputLabel = ''
      this.progressIndex = row.index
      this.progressRow = row
    },
    // 添加课程
    addClick() {
      // 对添加表单数据进行验证
      let isValidate = false
      this.$refs.addForm.validate(validate => {
        if(validate) {
          // 当验证全部通过
          isValidate = true
        }
      })
      if(!this.upPicUrl){
        this.$message('请提交合适图片')
        return
      }
      // 如果没有验证通过防止提交表单
      if(!isValidate) return
      console.log(this.addCourseForm)
      const form = this.addCourseForm
      if(form.list.courseType.val.length < 2){
        this.$message('请选择正确的课程类型')
        return
      }
      const params = {
        token: this.token,
        name: form.list.courseName.val,
        categoryId: form.list.courseType.val.pop(),
        discountPrice: form.list.coursePrice.val,
        virtualPurchases: form.list.courseSum.val,
        picurl: this.upPicUrl,
        intro: form.desc
      }
      this.upPicUrl = ''
      crudList( params, courseAddUrl)
        .then(res => {
          // 刷新数据
          this.$message('新增课程完成')
          this.$refs.my_table.fetchData()
          this.$refs.addBtn.dialogFormVisible = false
        })
    },

    // 修改老师信息
    postEdit(row) {
      console.log(222)
      let myRefs = 'editFormRefs' + row.index
      let isValidate = false
      this.$refs[myRefs].validate(validate => {
        if(validate) {
          // 当验证全部通过
          isValidate = true
        }
      })
      if(!this.upPicUrl){
        this.$message('请提交合适图片')
        return
      }
      // 如果没有验证通过防止提交表单
      if(!isValidate) return
      this.isEdit = false
      const form = this.courseEditForm
      if(form.list.courseType.val.length < 2){
        this.$message('请选择正确的课程类型')
        return
      }
      console.log(this.courseEditForm)
      const params = {
        token: this.token,
        name: form.list.courseName.val,
        curriculumId: form.curriculumId,
        categoryId: form.list.courseType.val.pop(),
        discountPrice: form.list.coursePrice.val,
        virtualPurchases: form.list.courseSum.val,
        picurl: this.upPicUrl,
        intro: form.desc
      }
      this.upPicUrl = ''
      crudList( params, courseUpUrl)
        .then(res => {
          // 刷新数据
          this.$refs.my_table.fetchData()
          const formRef = 'editForm'+row.index
          this.$refs[formRef].dialogFormVisible = false
          this.$message('修改课程完成')
        })
    },

    // 初始化课程数据
    initcourseAddForm(){
      // 清空表单  进行初始化
      this.$refs.addForm.resetFields()
      this.$refs.addPic.imageUrl = ''
    },
    // 初始化修改数据
    initCourseEditForm(row) {
      console.log(row)
      const formRef = 'editFormRefs'+row.index
      this.$refs[formRef].resetFields()
    },

    // 设置form表单的回显数据
    setForm(row){
      console.log(row.parentId)
      console.log(row.categoryId)
      console.log(row.maxCategoryName)
      console.log(row.minCategoryName)
      console.log('编辑赋值')
      this.courseEditForm = {
        imageUrl: row.picurl,
        curriculumId: row.curriculumId,
        desc: row.intro,
        index: row.index, // 记录在表格中的位置
        list: {
          courseName: {val: row.name, label: '课程名称',rules: this.validateName},
          courseSum: {val: row.zan, label: '虚拟点赞数', rules: this.validateNickName},
          courseSum: {val: row.virtualPurchases, label: '虚拟购买数量', rules: this.validateNickName},
          coursePrice: {val: row.discountPrice, label: '价格', rules: this.validateNickName},
          courseType: {val: [row.parentId, row.categoryId], label: '课程类别', prop: 'typeName', 
            options: this.classificationOptions
          }
        }
      }
      this.upPicUrl = row.picurl
      console.log(this.courseEditForm)
      console.log('++++++++++++')
      this.setUpParams()
    },

    // 点击行触发操作
    rowClick({ row, cell, event }){
      console.log('skj')
      switch (event.label) {
        case '操作':
        case '状态':
        case '是否置顶':
        case '是否发布':
        case '课程视频':
        case '视频进度':
        case '查看评论':
        case '编辑详情':
        case '添加老师':
        case '相关推荐':
          break
        default:
          this.$router.push({
            name: 'courseDetail', 
            params:{
                curriculumId: row.curriculumId
            }
          })         
          break
      }
    },

    handleRecommend(index, row) {
      console.log("去往评论");
      this.$router.push({
        name: "recommend",
        params: {
          token: this.token,
          parentId: row.curriculumId,
          type0: 3,
          type1: 1,
          type: 1
        }
      });
    },

    // 编辑详情
    handleEditFormatText(index, row){
      this.$router.push({
        name: 'formatText', 
        params:{
          content:{
            token: this.token,
            id: row.curriculumId,
            guid: row.curriculumId
          },
          type: 1,
          url: courseUpUrl
        }
      })
    },

    
    // 置顶
    handleTop(index, row) {
        console.log(index, row);
        var params = {
            token: this.token,
            curriculumId: row.curriculumId
        }
        if(row.recdNo > 0){ // 已经是置顶状态
            var tip = '是否取消置顶'
            var successTip = '取消置顶成功!'
            var errorTip = '已取消操作!'
            params.recdNo = 0
        }else{ 
            params.recdNo = ++this.recommendno
            var tip = '是否确认进行置顶'
            var successTip = '置顶成功!'
            var errorTip = '已取消操作!'
        }
        this.switchState({
          successTip,
          errorTip,
          params,
          tip,
          url: courseUpUrl
        })
    },

    // 发布
    handleRelease(index, row) {
        console.log(index, row);
        var params = {
            token: this.token,
            curriculumId: row.curriculumId
        }
        console.log(row.onlineStatus)
        if(row.onlineStatus == 2){ // 已经是发布状态
            params.onlineStatus = 1
            var tip = '是否取消发布'
            var successTip = '取消发布成功!'
            var errorTip = '取消成功!'
        }else{ 
            params.onlineStatus = 2
            var tip = '是否确认进行发布'
            var successTip = '发布成功!'
            var errorTip = '发布成功!'
        }
        this.switchState({
          successTip,
          errorTip,
          params,
          tip,
          url: courseUpUrl
        })
    },

    // 删除课程
    handleDelete(index, row) {
      console.log(index, row);
        var params = {
          token: this.token,
          curriculumId: row.curriculumId
      }
      var tip = '此操作将删除该课程所有信息, 是否继续?'
      var successTip = '删除成功!'
      var errorTip = '已取消删除!'
      this.switchState({
        successTip,
        errorTip,
        params,
        tip,
        url: courseDelUrl
      })
    },

    // 添加老师
    addTeach(index, row) {
      this.$router.push({
        name: 'courseTeacher', 
        params:{
          content:{
            token: this.token,
            id: row.curriculumId,
            guid: row.curriculumId
          },
          id: row.curriculumId, 
          type: 1,
          url: courseUpUrl
        }
      })
    },
    addCourseSuggest(index, row) {
      this.$router.push({
        name: 'courseSuggest', 
        params:{
          content:{
            token: this.token,
            id: row.curriculumId,
            guid: row.curriculumId
          },
          id: row.curriculumId, 
          type: 1,
          url: courseUpUrl
        }
      })
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
  .navPosition{
    position: relative;
    top: -30px;
    left: 450px;
  }
  .editBtn{
    border: 0;
    padding: 0;
    outline: 0;
  }
  .inputBox{
    width: 80%;
    display: inline-block;
  }
  .inputLabel{
    // font-size: 20px;
    font-weight: bold;
  }
// 折叠行
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .row-btn{
      display: inline-block;
      border: 1px solid #409EFF;
      text-align: center;
      padding: 3px 10px;
      font-size: 12px;
      background: #409EFF;
      color: #ffffff;
      border-radius: 3px;
  }
  .btn{
      border: 1px solid gray;
      padding: 10px;
      border-radius: 4px;
  }
  .course-name{
      cursor: pointer;
  }
  .course-name:focus,.course-name:hover{
      color: red;
  }
  .videoBox{
      height: 300px;
  }
  .video{
      height: 300px;
      width: 450px;
  }
</style>
