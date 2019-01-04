<template>
  <div class="dashboard-container">
    <!-- <div class="title">课程管理</div> -->
    <!-- 搜索组件 -->
    <Search
      @search="search"
      placeholder="姓名 / 昵称" 
    >
      <!-- 添加和添加的表单 -->
      <MyBtn
        slot="btnForm"
        :config="addBtnConfig"
        @initFormDate="initcourseEditForm"
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
                    v-if="item.label == '商品类别'"
                    :options="item.options"
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
            <MyUpPic @getImgUrl="getImgUrl" :upParams="upParams" />
          </div>
          <div>
            <Search
              @search="searchSelectCommodity"
              placeholder="姓名 / 昵称" 
            >
              <span 
                slot="btnForm" 
                class="searchSelectCommodityTip">
                  *请选择需要发布的商品
              </span>
            </Search>
            <MyTable
              ref="SelectCommodityTable"
              :tableParams="tableParams"
              :crudUrl="crudUrl"
              :height="200">
              <!-- 插入选项框 -->
              <el-table-column
                slot="radioBox"
                label="选择"
                width="50">
                <template scope="scope">
                  <el-radio 
                    v-model="commodityRadio"
                    :label="scope.row.index"
                    @change.native="selectionChange(scope.$index, scope.row)">&nbsp;</el-radio>
                </template>
              </el-table-column>
            </MyTable>  
            <el-form-item 
              label="课程推荐列表">
              <el-collapse accordion>
                <el-collapse-item
                  :title="addCourseForm.title">
                  <div class="listBox">
                    {{addCourseForm.desc}}
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
          </div>
        </el-form>               
      </MyBtn>        
    </Search>

    <MyTable 
      ref="my_table"
      :crudUrl="crudUrl"
      :isExpand="isExpand"
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
              {{scope.row.recommendno > 0 ? '是' : '否'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否发布" width="100"
        prop="onlinestatus">
        <template slot-scope="scope">
          <el-button
          size="mini"
          type="danger"
          @click="handleRelease(scope.$index, scope.row)">
              {{scope.row.onlinestatus > 0 ? '是' : '否'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="设置" width="150">
        <template slot-scope="scope">
          <!-- 拼团 -->
          <MyBtn
            :ref="'editForm'+(scope.row.index)"
            :config="fightGroup"
            @postForm="postEdit">

            <el-form
              slot="myform"
              ref="addForm"
              status-icon
              :model="courseEditForm">
              <div class="flex-row-start">
                <div class="form-box">

                  <el-form-item
                    :label="item.label"
                    :label-width="item.labelWidth"
                    v-for="(item, index) in fightGroupData.list"
                    :prop="`list.${index}.val`"
                    :rules="item.rules"
                    :key="index">

                    <el-date-picker
                      v-if="item.label == '拼团活动时间'"
                      v-model="item.val"
                      type="datetimerange"
                      :picker-options="item.pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="right">
                    </el-date-picker>

                    <div class="fightGroupItemBox"
                      v-if="item.label == '拼团有效时间'">
                      <el-input
                        v-model="item.val" />
                      <p>小时</p>
                    </div>
                    <!-- input输入框表单 -->
                    <blockquote 
                      v-if="item.mark == '拼团'">
                      <div class="fightGroupBox">
                        <div class="fightGroupItemBox">
                          <p>{{item.sumPeple.label}}</p>
                          <el-input
                          v-model="item.sumPeple.val"/>
                        </div>
                        <div class="fightGroupItemBox">
                          <p>{{item.price.label}}</p>
                          <el-input
                          v-model="item.price.val"/>       
                        </div>
                      </div>   
                    </blockquote>
                </el-form-item>    

                </div>
              </div>
            </el-form>   
          </MyBtn>
          <!-- 砍价 -->
          <MyBtn
            :ref="'editForm'+(scope.row.index)"
            :config="bargain"
            @postForm="postEdit">

            <el-form
              slot="myform"
              ref="addForm"
              status-icon
              :model="bargainData">
              <div class="flex-row-start">
                <div class="form-box">

                    <el-form-item
                      :label="item.label"
                      :label-width="detailLabelWidth"
                      v-for="(item, index) in bargainData.bargainList"
                      :prop="`bargainList.${index}.val`"
                      :rules="item.rules"
                      :key="index">

                      <el-date-picker
                        v-if="item.label == '砍价有效时间'"
                        v-model="item.val"
                        type="datetimerange"
                        :picker-options="item.pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                      </el-date-picker>
                      <!-- input输入框表单 -->
                      <el-input
                        v-else
                        v-model="item.val"/>
                    </el-form-item>  

                </div>
                <!-- 图片上传组件 -->
                <!-- <MyUpPic @getImgUrl="getImgUrl" :upParams="upParams" /> -->
              </div>
            </el-form>   
          </MyBtn>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
          <template slot-scope="scope">

            <el-button
            type="primary"
            plain
            size="mini"
            @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
      </el-table-column>
      <el-table-column label="评论" width="80">
        <template slot-scope="scope">
            <el-button
            type="info"
            plain
            size="mini"
            @click="handleDelete(scope.$index, scope.row)">
              查看
            </el-button>
          </template>
      </el-table-column>
      <el-table-column label="课程视频" width="100">
        <template slot-scope="scope">
          <a id="uploadVideoNow" @ href="javascript:void(0);">
            <!-- 上传视频按钮和表单组件 -->
            <MyBtn
              :config="upVideoBtn">
              <!-- 腾讯云视频上传 -->
              <div slot="myform">
                <div>
                  <label for="" class="inputLabel">章节名称:</label>
                  <div class="inputBox">
                    <el-input type="text" ></el-input>
                  </div>
                </div>
                <MyUpVideo/>
              </div>
            </MyBtn>  
          </a>
        </template>
      </el-table-column>
      <el-table-column label="视频进度">
        <template slot-scope="scope">
          
        </template>
      </el-table-column>
    </MyTable>

    <!-- 详情弹窗 -->
    <el-dialog 
      :visible.sync="dialogDetailVisible"
      title="老师详情"
      width="40%"
      center>
      <el-form :model="courseEditForm">
        <!-- <i class="el-icon-edit" @click="edit" /> -->
        <div class="flex-col-center">
          <div>
            <img :src="courseEditForm.imageUrl" class="pic" alt="">
          </div>
          <div class="detail-box">
            <el-form-item
              v-for="(item, index) in courseEditForm.list"
              :label="item.label+':'"
              :key="index"
              :label-width="detailLabelWidth">
              <div>{{ item.val }}</div>
            </el-form-item>
            <el-form-item
              label="老师简介:" 
              :label-width="detailLabelWidth">
              <div>{{ courseEditForm.desc }}</div>
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
import Search from '@/components/search'
import MyTable from '@/components/myTable'
import MyUpPic from '@/components/MyUpPic'
import MyBtn from '@/components/MyBtn'
import MyUpVideo from '@/components/MyUpVideo'

import { pageComment } from '@/minxins/pageComment'
import { teacherAddUrl, courseDelUrl, courseUpUrl, crudList } from '@/api/util'
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
      isRequired('请输入砍价金额', 'blur'),
      minMaxLen(1, 10),
      regTest(/^[^\u4E00-\u9FA5]+$/, '金额只能为数字')
    ]
    // 昵称验证
    const validateNickName = [
      isRequired('请输入砍价人数', 'blur'),
      minMaxLen(1, 10),
      regTest(/^[^\u4E00-\u9FA5]+$/, '只能为纯数字')
    ]
    const validateDetail = [
      isRequired('请输入老师简介', 'blur')
    ]
    const validateDate = [
      isRequired('请选择有效时间', 'blur')
    ]
    return {
      validateName: validateName,
      validateNickName: validateNickName,
      validateDetail: validateDetail,
      validateDate: validateDate,
      crudUrl: {
        // 查找列表数据接口
        selectUrl: '/hart/kss/admin/curriculum/getCurriculumList'
      },
      // 选中的商品
      commodityRadio:'',
      // 添加老师初始化数据
      addCourseForm: {
        imageUrl: '',
        teacherId: '',
        title: '',
        desc: '',
        index: '', // 记录在表格中的位置
        list: [
          {val: [1, 2], label: '商品类别', prop: 'typeName', 
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
          },
          {val: '',label: '商品价格',rules: validateName},
          {val: '', label: '积分', rules: validateNickName}
        ]
      },
      // 图片上传参数
      upParams:[],
      // 上传后的地址
      upPicUrl: '',
      // 添加按钮组件配置参数
      addBtnConfig: {
        // 弹出框名称
        title: '添加商品信息',
        // 按钮名称
        btnName: '添加商品',
        type: 'primary',
        size: 'mini',
        width: '40%'
      },
      // 拼团设置
      fightGroup: {
         // 弹出框名称
        title: '设置拼团信息',
        // 按钮名称
        btnName: '拼团',
        type: 'success',
        size: 'mini',
        width: '40%'
      },
      fightGroupData: {
        list: [
          {val: '', labelWidth: '110', label: '拼团活动时间', rules: validateDate,
              pickerOptions: { // 时间快捷方式设置
                shortcuts: [
                  {
                    text: '最近12小时',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      end.setTime(start.getTime() + 3600 * 1000 * 12);
                      picker.$emit('pick', [start, end]);
                    }
                  }, 
                  {
                    text: '最近24小时',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      end.setTime(start.getTime() + 3600 * 1000 * 24);
                      picker.$emit('pick', [start, end]);
                    }
                  },
                  {
                    text: '最近48小时',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      end.setTime(start.getTime() + 3600 * 1000 * 24 * 2);
                      picker.$emit('pick', [start, end]);
                    }
                  },
                  {
                    text: '最近一周',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                    }
                  },
                  {
                    text: '最近一个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                    }
                  },
                ]
              }
          },
          {val: '', labelWidth: '110', label: '拼团有效时间',rules: validateName},
          // 拼团123
          {label: '', labelWidth: '0',  mark: '拼团',
            sumPeple: {val: '', label: '成团人数'},
            price: {val: '', label: '成团价格'}
          },
          {label: '', labelWidth: '0', mark: '拼团',
            sumPeple: {val: '', label: '成团人数'},
            price: {val: '', label: '成团价格'}
          }
        ]
      },
      // 砍价设置
      bargain: {
         // 弹出框名称
        title: '设置砍价信息',
        // 按钮名称
        btnName: '砍价',
        type: 'warning',
        size: 'mini',
        width: '40%'
      },
      // 砍价表单配置列表
      bargainData:{
        bargainList:[
            {val: '',label: '砍价总金额',rules: validateName},
            {val: '', label: '砍价总人数', rules: validateNickName},
            {val: '', label: '砍价有效时间', rules: validateDate,
              pickerOptions: { // 时间快捷方式设置
                shortcuts: [
                  {
                    text: '最近12小时',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      end.setTime(start.getTime() + 3600 * 1000 * 12);
                      picker.$emit('pick', [start, end]);
                    }
                  }, 
                  {
                    text: '最近24小时',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      end.setTime(start.getTime() + 3600 * 1000 * 24);
                      picker.$emit('pick', [start, end]);
                    }
                  },
                  {
                    text: '最近48小时',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      end.setTime(start.getTime() + 3600 * 1000 * 24 * 2);
                      picker.$emit('pick', [start, end]);
                    }
                  },
                  {
                    text: '最近一周',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                    }
                  },
                  {
                    text: '最近一个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                    }
                  },
                ]
              }
            }
        ]
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
        teacherId: '',
        desc: '',
        index: '', // 记录在表格中的位置
        list: [
          {val: '',label: '课程名称',rules: validateName},
          {val: '', label: '虚拟', rules: validateNickName},
          {val: [1, 2], label: '课程类别', prop: 'typeName', 
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
          },
          {val: [1, 2], label: '授课老师', 
            options:[
              {value: 1, label: '王老师'},
              {value: 2, label: '李老师'}
            ]
          }
        ]
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
        {prop: 'createDate', label : '创建时间'},
        {prop: 'onlinetime', label : '上线时间'},
        {prop: 'offlinetime', label : '下线时间'},
        {prop: 'likenum', label : '运营点赞数'},
        {prop: 'realityLikeNum', label : '点赞数'},
        {prop: 'videoNum', label : '视频个数'},
        {prop: 'teacherNum', label : '老师个数'},
        {prop: 'recommendNum', label : '推荐个数'},
        {prop: 'url', label : '文章地址'}
      ]
    }
  },
  created(){
  
  },
  watch: {
   commodityRadio() {
     console.log(this.commodityRadio)
   }
  },
  methods: {
    // 选择表格数据
    selectionChange(index, row) {
      console.log(row)
      this.addCourseForm.title = row.name
      this.addCourseForm.desc = row.intro
      console.log('选择')
    },

    searchSelectCommodity(val) {
      this.$refs.SelectCommodityTable.search(val)
    },

    // 删除所选商品
    delSelectedCommodity() {

    },

    // 设置图片上传参数 
    setUpParams() {
      this.upParams = [
          { key: 'token', value: this.token },
          { key: 'type0', value: 1 },
          { key: 'type1', value: 1 },
          { key: 'parentId', value: this.courseEditForm.teacherId }
      ]
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
      const url = teacherAddUrl
      const form = this.addCourseForm
      const params = {
        token: this.token,
        name: form.name,
        nickName: form.nickName,
        sex: (form.sexName) == '男' ? 1 : 2,
        type: (form.typeName),
        dateOfBirth: form.date,
        intro: form.desc,
        teacherId: form.teacherId,
        picurl: this.upPicUrl
      }
      this.upPicUrl = ''
      crudList( params, url)
        .then(res => {
          // 刷新数据
          this.$message('新增老师完成')
          this.$refs.my_table.fetchData()
          this.$refs.my_table.dialogFormVisible = false
        })
    },

    // 修改老师信息
    postEdit() {
      console.log(222)
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
      var url = teacherUpUrl
      this.isEdit = false
      switch (form.typeName) {
        case '兼职':
          form.typeName = 2
          break
      
        case '全职':
          form.typeName = 1
          break
      }
      let params = {
        token: this.token,
        name: form.name,
        nickName: form.nickName,
        sex: (form.sexName) == '男' ? 1 : 2,
        type: (form.typeName),
        dateOfBirth: form.date,
        intro: form.desc,
        teacherId: form.teacherId,
        picurl: form.imageUrl
      }
      crudList( params, url)
        .then(res => {
          // 刷新数据
          this.$refs.my_table.fetchData()
        })
    },

    // 初始化老师数据
    initcourseEditForm(){
      // 清空表单  进行初始化
      this.$refs.addForm.resetFields()
    },

    // 设置form表单的回显数据
    setForm(row){
      console.log(row)
      this.courseEditForm = {
        imageUrl: row.picurl,
        teacherId: row.teacherId,
        desc: row.intro,
        index: row.index, // 记录在表格中的位置
        list: [
          {val: row.name, label: '课程名称',rules: this.validateName},
          {val: row.zan, label: '虚拟点赞数', rules: this.validateNickName},
          {val: [2, 1], label: '课程类别', prop: 'typeName', 
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
          },
          {val: [1, 2], label: '授课老师', 
            options:[
              {value: 1, label: '王老师'},
              {value: 2, label: '李老师'}
            ]
          }
        ]
      }
      this.setUpParams()
    },

    // 点击行触发操作
    rowClick({ row, cell, event }){
      switch (event.label) {
        case '操作':
        case '状态':
        case '是否置顶':
        case '是否发布':
        case '课程视频':
          break
        default:
          this.setForm(row)
          this.setUpParams()
          this.dialogDetailVisible = true          
          break;
      }
    },

    // 编辑详情
    handleEditFormatText(index, row){
      this.$router.push({name: 'formatText', params:{
        content:{
          token: this.token,
          teacherId: row.teacherId,
          guid: row.teacherId
        },
        type: 3,
        url: teacherUpUrl
      }})
    },

    
    // 置顶
    handleTop(index, row) {
        console.log(index, row);
        var params = {
            token: this.token,
            guid: row.guid
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
            guid: row.guid
        }
        console.log(row.onlinestatus)
        if(row.onlinestatus > 0){ // 已经是发布状态
            params.onlinestatus = 0
            var tip = '是否取消发布'
            var successTip = '取消发布成功!'
            var errorTip = '取消成功!'
        }else{ 
            params.onlinestatus = 1
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
          guid: row.guid
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
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
// 设置砍价表单样式
.fightGroupBox{
  display: flex;
}
.fightGroupItemBox{
  display: flex;
  width: 50%;
  margin-right: 20px;
}
.fightGroupItemBox p{
  width: 100px;
}
.searchSelectCommodityTip{
  line-height: 30px;
  color: red;
  font-weight: bold;
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
