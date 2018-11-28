<template>
  <div class="dashboard-container">
    <!-- <div class="title">老师管理</div> -->
    <!-- 搜索组件 -->
    <MySearch
      @search="search"
      placeholder="姓名 / 昵称" 
    >
      <!-- 添加和添加的表单 -->
      <MyBtn
        slot="btnForm"
        ref="addBtn"
        :config="addBtnConfig"
        @initFormDate="initTeacherForm"
        @postForm="addClick">
          <!-- 添加显示的表单内容 -->
          <el-form
            slot="myform"
            ref="addForm"
            status-icon
            :model="addTeacherForm">
            <div class="flex-row-start">
              <div class="form-box">

                  <el-form-item
                  :label="item.label"
                  :label-width="formLabelWidth"
                  v-for="(item, index) in addTeacherForm.list"
                  :prop="`list.${index}.val`"
                  :rules="item.rules"
                  :key="index">
                    <!-- 选项下拉框 -->
                    <el-select
                      v-if="item.label == '类型'" 
                      v-model="item.val"
                      type="mini"
                      placeholder="请选择类型">
                      <el-option label="兼职" value="2"/>
                      <el-option label="全职" value="1"/>
                    </el-select>
                    <!-- 单选框表单 -->
                    <el-radio-group
                      v-else-if="item.label == '性别'" 
                      v-model="item.val">
                      <el-radio label="男" value="1"/>
                      <el-radio label="女" value="2"/>
                    </el-radio-group>

                    <!-- 日期选择表单 -->
                    <el-date-picker
                      v-else-if="item.label == '出生日期'"
                      v-model="item.val"
                      :clearable="false"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                    </el-date-picker>

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
                :upParams="upParamsAdd" />
            </div>
            <div>
                <el-form-item 
                  :label-width="formLabelWidth"
                  :prop="'desc'"
                  :rules="validateDetail"
                  label="老师简介">
                    <el-input v-model="addTeacherForm.desc" 
                    :autosize="{ minRows: 5, maxRows: 5}"
                    type="textarea"/>
                </el-form-item>
            </div>
          </el-form>               
      </MyBtn>        
    </MySearch>

    <MyTable 
      ref="my_table"
      :crudUrl="crudUrl"
      @rowClick="rowClick"
      :tableParams="tableParams">
      <el-table-column label="状态" width="80">
          <template slot-scope="scope">
              <el-button
              size="mini"
              type="warning"
              @click="swaticStatus(scope.$index, scope.row)">
                {{scope.row.statusName}}
              </el-button>
          </template>
      </el-table-column>
      <el-table-column label="是否置顶" width="100">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleTop(scope.$index, scope.row)">
                {{scope.row.recommendno > 0 ? '是' : '否'}}
            </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <button
              class="editBtn"
              @click.stop="handleEdit(scope.$index, scope.row)">
              <MyBtn
                :ref="'editForm'+(scope.row.index)"
                slot="btnForm"
                @initFormDate="initEditFormData(scope.row)"
                :config="editBtnConfig"
                @postForm="postEdit(scope.row)">
                
                <el-form
                  slot="myform"
                  :ref="'editFormRefs'+(scope.row.index)"
                  :model="teacherForm">
                  <div class="flex-row-start">
                    <div class="form-box">
                      <el-form-item
                        :label="item.label" 
                        :label-width="formLabelWidth"
                        v-for="(item, index) in teacherForm.list"
                        :prop="`list.${index}.val`"
                        :rules="item.rules"                   
                        :key="index">
                        <!-- 选项下拉框 -->
                        <el-select
                          v-if="item.label == '类型'" 
                          v-model="item.val"
                          type="mini"
                          placeholder="请选择类型">
                          <el-option label="兼职" value="2"/>
                          <el-option label="全职" value="1"/>
                        </el-select>
                        <!-- 单选框表单 -->
                        <el-radio-group
                          v-else-if="item.label == '性别'"
                          v-model="item.val">
                          <el-radio label="男" value="1"/>
                          <el-radio label="女" value="2"/>
                        </el-radio-group>
                        <!-- 日期选择表单 -->
                        <el-date-picker
                          v-else-if="item.label == '出生日期'"
                          v-model="item.val"
                          :clearable="false"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期" />
                        <!-- input输入框表单 -->
                        <el-input
                          v-else
                          v-model="item.val"/>
                      </el-form-item>

                    </div>
                    <!-- 图片上传组件 -->
                    <MyUpPic
                      :img="upPicUrl"
                      :upParams="upParams"
                      @getImgUrl="getImgUrl" />
                  </div>
                  <div>
                    <el-form-item
                      :label-width="formLabelWidth"
                      :prop="'desc'"
                      :rules="validateDetail"
                      label="老师简介">
                      <el-input
                        v-model="teacherForm.desc"
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
            @click="handleEditFormatText(scope.$index, scope.row)">
              编辑详情
            </el-button>
          </template>
      </el-table-column>
    </MyTable>

    <!-- 详情弹窗 -->
    <el-dialog 
      :visible.sync="dialogDetailVisible"
      title="老师详情"
      width="40%"
      center>
      <el-form :model="teacherForm">
        <i class="el-icon-edit" @click="edit" />
        <div class="flex-col-center">
          <div>
            <img :src="teacherForm.imageUrl" class="pic" alt="">
          </div>
          <div class="detail-box">
            <el-form-item
              v-for="(item, index) in teacherForm.list"
              :label="item.label+':'"
              :key="index"
              :label-width="detailLabelWidth">
              <div>{{ item.val }}</div>
            </el-form-item>
            <el-form-item
              label="老师简介:" 
              :label-width="detailLabelWidth">
              <div>{{ teacherForm.desc }}</div>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button 
          @click="dialogDetailVisible = false">
            取 消
        </el-button>
        <el-button 
          type="primary" 
          @click="dialogDetailVisible = false">
            确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import search from '@/components/search'
import MyTable from '@/components/MyTable'
import MyUpPic from '@/components/MyUpPic'
import MyBtn from '@/components/MyBtn'

import { pageComment } from '@/minxins/pageComment'
import { 
  teacherSelectUrl,
  teacherAddUrl, 
  teacherDelUrl, 
  teacherUpUrl, 
  crudList 
} from '@/api/util'
import { 
  isRequired, 
  regTest, 
  minMaxLen 
  } from '@/utils/validate'

export default {
  components: {
    MySearch: search,
    MyTable,
    MyUpPic,
    MyBtn
  },
  mixins: [pageComment],   
  data() {
    // 姓名验证
    const validateName = [
      isRequired('请输入老师姓名', 'blur'),
      minMaxLen(1, 10),
      regTest(/^[\u4E00-\u9FA5]+$/, '姓名只能为中文')
    ]
    // 昵称验证
    const validateNickName = [
      isRequired('请输入老师昵称', 'blur'),
      minMaxLen(1, 10)
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
      crudUrl: {
        // 查找列表数据接口
        selectUrl: teacherSelectUrl
      },
      // 添加老师初始化数据
      addTeacherForm: {
        imageUrl: '',
        teacherId: '',
        desc: '',
        index: '', // 记录在表格中的位置
        list: {
          'name': {val: '',label: '姓名',rules: validateName},
          'nickName': {val: '', label: '昵称', rules: validateNickName},
          'typeName': {val: '全职', label: '类型', prop: 'typeName'},
          'sexName': {val: '男', label: '性别', prop: 'sexName'},
          'date': {val: '', label: '出生日期', prop: 'date', rules: validateDate}
        }
      },
      // 图片上传参数
      upParamsAdd: [],
      // 上传后的地址
      upPicUrl: '',
      // 添加按钮组件配置参数
      addBtnConfig: {
        // 弹出框名称
        title: '添加老师信息',
        // 按钮名称
        btnName: '添加',
        type: 'primary',
        size: 'mini',
        width: '40%'
      },
      // 置顶位置
      recommendno: 0,
      editBtnConfig: {
        // 弹出框名称
        title: '修改老师信息',
        // 按钮名称
        btnName: '编辑',
        type: 'primary',
        size: 'mini',
        width: '40%',
      },

      // 需要提交的表单信息
      // 同时作为表单回显的展示
      teacherForm: {
        imageUrl: '',
        teacherId: '',
        desc: '',
        index: '', // 记录在表格中的位置
        list: {
          'name': { val: '', label: '姓名', rules: validateName },
          'nickName': { val: '', label: '昵称', rules: validateNickName },
          'typeName': { val: '', label: '类型' },
          'sexName': { val: '', label: '性别' },
          'date': { val: '', label: '出生日期', rules: validateDate}
        }
      },
      // 没有指定的属性为默认值
      tableParams : [
        // { prop: 'index', label: '编号', width: 80 },
        { prop: 'name', label: '老师名称' },
        { prop: 'nickName', label: '昵称' },
        { prop: 'sexName', label: '性别', width: 80, sort: true },
        // {prop: 'age', label : '年龄', width: 80, sort: true},
        { prop: 'dateOfBirth', label: '出生日期', width:120, sort: true },
        { prop: 'typeName', label: '类型', width: 80 },
        { prop: 'statusName', label: '状态', width: 80 }
      ]
    }
  },
  created() {
    this.upParamsAdd = [
      { key: 'token', value: this.token },
      { key: 'type0', value: 1 },
      { key: 'type1', value: 1 },
      { key: 'parentId', value: '' }
    ]
  },  
  methods: {
    // 设置图片上传参数 
    setUpParams(id) {
      this.upParams = [
        { key: 'token', value: this.token },
        { key: 'type0', value: 1 },
        { key: 'type1', value: 1 },
        { key: 'parentId', value: id }
      ]
    },

    // 老师置顶
    handleTop(index, row) {
        console.log(index, row);
        var params = {
            token: this.token,
            teacherId: row.teacherId
        }
        if(row.recommendno > 0){ // 已经是置顶状态
            var tip = '是否取消置顶'
            var successTip = '取消置顶成功!'
            var errorTip = '已取消操作!'
            params.recommendno = 0
        }else{ 
            params.recommendno = ++this.recommendno
            var tip = '是否确认进行置顶'
            var successTip = '置顶成功!'
            var errorTip = '已取消操作!'
        }
        this.$confirm(tip, '提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        }).then(() => {
            crudList(params, teacherUpUrl)
                .then(res => {
                    this.$refs.my_table.fetchData()
                    this.$message({
                        type: 'success',
                        message: successTip
                    })
                });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: errorTip
            }) 
        }) 
    },
    // 添加老师
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
      const url = teacherAddUrl
      const form = this.addTeacherForm
      const params = {
        token: this.token,
        name: form.list.name.val,
        nickName: form.list.nickName.val,
        sex: form.list.sexName.val == '男' ? 1 : 2,
        type: form.list.typeName.val == '全职' ? 1 : 2,
        dateOfBirth: form.list.date.val,
        intro: form.desc,
        teacherId: form.teacherId,
        picurl: this.upPicUrl
      }
      crudList( params, url)
        .then(res => {
          // 刷新数据
          this.$message('新增老师完成')
          this.$refs.my_table.fetchData()
          this.$refs.addBtn.dialogFormVisible = false
          this.upPicUrl = ''
        })
    },

    initEditFormData(row) {
      this.isEdit = false
    },
    // 修改老师信息
    postEdit(row) {
      let isValidate = false
      let myRefs = 'editFormRefs' + row.index
      this.$refs[myRefs].validate(validate => {
        if(validate) {
          // 当验证全部通过
          isValidate = true
        }
      })
      // 如果没有验证通过防止提交表单
      if(!isValidate) return
      if(!this.upPicUrl){
        this.$message('请提交合适图片')
        return
      }
      const form = this.teacherForm
      var url = teacherUpUrl
      this.isEdit = false
      let params = {
        token: this.token,
        name: form.list.name.val,
        nickName: form.list.nickName.val,
        sex: form.list.sexName.val == '男' ? 1 : 2,
        type: form.list.typeName.val == '全职' ? 1 : 2,
        dateOfBirth: form.list.date.val,
        intro: form.desc,
        teacherId: form.teacherId,
        picurl: this.upPicUrl
      }
      crudList( params, url)
        .then(res => {
          // 刷新数据
          this.$refs.my_table.fetchData()
          const formRef = 'editForm'+this.teacherForm.index
          this.$refs[formRef].dialogFormVisible = false
          this.$message('编辑完成')
        })
    },
    // 初始化老师数据
    initTeacherForm(){
      // 清空表单  进行初始化
      this.$refs.addForm.resetFields()
      this.$refs.addPic.imageUrl = ''
    },
    // 设置form表单的回显数据
    setForm(row){
      this.teacherForm = {
        imageUrl: row.picurl,
        teacherId: row.teacherId,
        desc: row.intro,
        index: row.index,
        list: {
          'name': {val: row.name, label: '姓名', rules: this.validateName},
          'nickName': {val: row.nickName, label: '昵称', rules: this.validateNickName},
          'typeName': {val: row.typeName, label: '类型'},
          'sexName': {val: row.sexName, label: '性别'},
          'date': {val: row.dateOfBirth, label: '出生日期', rules: this.validateDate}
        }
      }
      this.upPicUrl = row.picurl
      this.setUpParams(row.teacherId)
    },
    // 改变老师离职和在职状态
    swaticStatus(index, row) {
      let params = {
        token: this.token,
        teacherId: row.teacherId,
        status: ''
      }
      if(row.statusName == '在职'){
        var tip = '是否改变老师状态'
        var successTip = '更改成功!'
        var errorTip = '已取消操作!'
        params.status = 2
      }
      if(row.statusName == '离职'){
        var tip = '是否改变老师状态'
        var successTip = '更改成功!'
        var errorTip = '已取消操作!'
        params.status = 1
      }
      this.switchState({
        successTip,
        errorTip,
        params,
        tip,
        url: teacherUpUrl
      })
    },
    // 详情弹出框表单中的编辑按钮
    edit() {
        this.isEdit = true
        this.dialogDetailVisible = false
        // 修改编辑按钮组件中对应表单的显示状态
        // 需要改变状态的组件别名
        const formRef = 'editForm'+this.teacherForm.index
        this.$refs[formRef].dialogFormVisible = true
    },
    // 点击行触发操作
    rowClick({ row, cell, event }){
      if (event.label != '操作' 
        && event.label != '状态'
        && event.label != '是否置顶') {
        this.setForm(row)
        this.setUpParams()
        this.dialogDetailVisible = true
        console.log('行触发')
      }
    },
    // 编辑详情
    handleEditFormatText(index, row){
      this.$router.push({
        name: 'formatText', 
        params:{
          content:{
            token: this.token,
            id: row.teacherId,
            guid: row.teacherId
          },
          type: 3,
          url: teacherUpUrl
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

  .editBtn{
    border: 0;
    padding: 0;
    outline: 0;
  }
  // 用户详情
  .pic{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin:0 auto;
  }
  .detail-box{
    margin-top: 30px;
    width: 100%;
  }
  .detail-box .el-form-item{
    margin-bottom: 0;
  }
  .dialog-footer{
    text-align: right;
  }
  .el-icon-edit{
    position: absolute;
    top: 20px;
  }
</style>