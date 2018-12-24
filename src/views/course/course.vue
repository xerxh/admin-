<template>
    <div class="dashboard-container">
        <div class="title">课程管理</div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane v-for="(item, index) in navTabs" 
            :key="index"
            :label="item.label" :name="item.value"></el-tab-pane>
        </el-tabs>
        <Search @add="add" @search="searchRecommentList" :isShow="true" placeholder="课程名称"/>
        <!-- 老师管理 -->
        <el-table
        :data="tableData"
        style="width: 100%;cursor:pointer;"
        v-loading="listLoading"
        element-loading-text="我已经飙到极限啦！！！---->火箭加载中"
        :row-class-name="tableRowClassName"
        @row-click="rowClick"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <div>
                            <el-form-item label="课程名称">
                                <span>{{props.row.name}}</span>
                            </el-form-item>
                        </div>
                        <el-form-item :label="item.label" v-for="(item, index) in tableSonParams" 
                        :key="index">
                            <span>{{ props.row[item.prop] }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in tableParams" :key="index"
                :prop="item.prop"
                :width="item.width"
                :sortable="item.sort"
                :label="item.label">
            </el-table-column>
            <el-table-column label="编辑" width="100">
                <template slot-scope="scope">
                    <!-- <div class="btnBox"> -->
                        <el-button
                        size="mini"
                        type="warning" plain
                        @click="handleEditFormatText(scope.$index, scope.row)">编辑详情</el-button>
                    <!-- </div> -->
                </template>
            </el-table-column>
            <el-table-column label="编辑" width="100">
                <template slot-scope="scope">
                    <!-- <div class="btnBox"> -->
                        <el-button
                        size="mini"
                        type="success" plain
                        @click="addRecommentVideo(scope.$index, scope.row)">相关推荐</el-button>
                    <!-- </div> -->
                </template>
            </el-table-column>
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
                prop="onlinestatus"
                :filters="[{ text: '是', value: 1 }, { text: '否', value: 0 }]"
                :filter-method="filterTag">
                <template slot-scope="scope">
                  <el-button
                  size="mini"
                  type="danger"
                  @click="handleRelease(scope.$index, scope.row)">
                      {{scope.row.onlinestatus > 0 ? '是' : '否'}}
                  </el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <span @click="handleEdit(scope.$index, scope.row)">
                        <i class="el-icon-edit-outline"></i>
                    </span>
                    <span class="icon" @click="handleDelete(scope.$index, scope.row)">
                        <i class="el-icon-close"></i>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="上传视频" width="100">
                <template slot-scope="scope">
                    <span class="row-btn">
                        <a id="uploadVideoNow" @ href="javascript:void(0);" 
                        @click="uploadVideo(scope.$index, scope.row)">  
                            上传视频
                        </a>
                    </span>
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
            <el-table-column width="100">
                <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.progress"></el-progress>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
        </el-pagination>

        <el-dialog :title="title" 
        width="40%"
        center
        :visible.sync="dialogFormVisible">
            <el-form  status-icon  ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="课程名称" prop="form.name">
                    <el-input type="text" v-model="form.name"  auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="虚拟点赞数:" prop="pass">
                    <el-input type="text" @change="vrZan" v-model="form.likenum"></el-input>
                </el-form-item>
                <div style="display: flex;">
                    <div>
                        <el-form-item label="课程类别" prop="checkPass">
                            <el-select v-model="activeName" placeholder="请选择">
                                    <el-option
                                    v-for="item in navTabs"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="相关老师">
                            <el-select
                                v-model="teachers"
                                multiple
                                placeholder="请选择相关老师">
                                <el-option
                                v-for="item in options5"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>                      
                    </div>
                    <div>
                        <el-form-item label="封面图:">
                            <!-- <img class="coverMap" src="src/assets/logo.png" alt="" srcset=""> -->
                            <div class="up-avatar">
                                <el-upload
                                    class="avatar-uploader"
                                    ref="upload"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :show-file-list="false"
                                    :on-change="addFile"
                                    :auto-upload="true"
                                    limit:1
                                    :http-request="uploadPic">
                                    <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <div slot="tip" class="avatar-tip">
                                    <!-- <span @click="submitUpload">封面上传</span> -->
                                    </div>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>                    
                </div>
                <el-form-item label="课程简介">
                    <el-input 
                    v-model="form.intro" 
                    :autosize="{ minRows: 5, maxRows: 5}"
                    type="textarea"/>
                </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCouse">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="添加课程视频" 
        width="45%"
        center
        :visible.sync="dialogVideoVisible">
            <el-form  status-icon  ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="课程名称" prop="pass">
                    <el-input type="text"  v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="课程简介">
                    <el-input 
                    v-model="form.intro" 
                    :autosize="{ minRows: 5, maxRows: 5}"
                    type="textarea"/>
                </el-form-item> -->
                <el-form-item>
                    <form id="form2">
                        <input id="addVideo-file" type="file" @change="selectVideo" style="display:none;"/>
                        <input id="addCover-file" type="file" @change="selectCover" style="display:none;"/>
                    </form>
                    <div class="row" style="padding:10px;">
                        <a id="addVideo" href="javascript:void(0);"
                        @click="addVideo"
                        class="btn btn-outline">添加视频</a>
                        <a id="addCover" href="javascript:void(0);" 
                        @click="addCover"
                        class="btn btn-outline">添加封面</a>
                        <!-- <a id="uploadFile" @click="UploadFile" href="javascript:void(0);"  class="btn btn-outline">上传视频和封面</a> -->
                    </div>
                    <div class="videoBox">
                        <video class="video" ref="video" 
                        v-if="upVideo && posterVideo" controls :src="upVideo"
                        :poster="posterVideo"></video>
                    </div>
                </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVideoVisible = false">取 消</el-button>
            <el-button type="primary" @click="UploadFile">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="添加相关推荐" 
        width="60%"
        center
        :visible.sync="dialogVideoRecommend">
            <el-form  status-icon  ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <!-- <el-form-item label="课程名称" prop="pass">
                    <el-autocomplete
                        v-model="state4"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                        >
                    </el-autocomplete>
                </el-form-item> -->
                <el-form-item label="课程名称">
                    <div style="height: 40px">
                        <Search @add="add" :isShow="false" @search="searchRecommentList" placeholder="课程名称"/>
                    </div>
                    <el-table :data="tableRecommentData"
                        style="width: 100%"
                        ref="multipleTable"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        height="250">
                            <el-table-column
                                type="selection"
                                width="55">
                            </el-table-column>
                            <el-table-column v-for="(item, index) in tableRecommendParams" :key="index"
                                :prop="item.prop"
                                :width="item.width"
                                :sortable="item.sort"
                                :label="item.label">
                            </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item>
                    <el-pagination
                        @size-change="recommentSizeChange"
                        @current-change="recommentCurrentChange"
                        :current-page="recommentCurrentPage"
                        :page-size="recommentSize"
                        layout="total, prev, pager, next, jumper"
                        :total="recommentTotalCount">
                    </el-pagination>
                </el-form-item>
                <el-form-item label="课程推荐列表">
                    <el-collapse>
                        <el-collapse-item 
                        :title="item.name" 
                        :name="index+1" 
                        v-for="(item, index) in listArray" :key="index">
                            <div class="listBox">
                                <i class="el-icon-close closeBtn" @click="delArray(index, item)"></i>
                                {{item.intro}}
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVideoVisible = false">取 消</el-button>
            <el-button type="primary" @click="sendRecommend">确 定</el-button>
          </div>
        </el-dialog>
    </div>
    <!-- // 分页 -->
</template>

<script>
import Search from '@/components/search'

import $ from 'jquery'
import { mapGetters } from 'vuex'
import { getList } from '@/api/table'

import { 
  uploadFileGet, 
  uploadFile, 
  uploadSignatureUrl
} from '@/api/upload'

import {
  courseSelectUrl, 
  courseAddUrl, 
  courseDelUrl, 
  courseUpUrl, 
  videoSonAddUrl, 
  courseRecommendList, 
  teacherUrl, 
  crudList, 
  courseRecommend, 
  courseCurriculumKList 
} from '@/api/util'

export default {
    components:{
        Search
    },  
    computed: {
      ...mapGetters([
        'name',
        'roles',
        'token'
      ])
    },   
    data() {
        return {
            index: 0,
            cosBox: [],
            videoCur: 0,
            videoFileList: [],
            coverFileList: [], 
            // 上传视频的地址
            upVideo: '',
            // 上传的封面图地址
            posterVideo: '',
            dialogVideoVisible: false,
            dialogVideoRecommend: false,
            // 列表url
            url: courseSelectUrl,
            title: '',
            // 搜索条件
            criteria: '',
            // 置顶位置
            recommendno: 0,
            // 是否显示列表加载条
            listLoading: true,
            // 当前页是第几页
            currentPage: 1,
            // 当前也显示多少条数据
            size: 10,
            // 总数据量
            totalCount: 0,
            // 是否可以提交
            isSend: false,
            // 是否正在进行编辑操作
            isEdit: false,
            type: '1',
            fileList: [],
            // 默认显示已授页面
            activeName: '1',
            dialogFormVisible: false,
            navTabs: [
                {
                    value: '1',
                    label: '已授'
                }, 
                {
                    value: '2',
                    label: '未授'
                }
            ],
            value: '',
            options5: [],
            teachers: [],
            form: {
                name: '',
                type: '',
                picurl: '',
                intro: '',
                // date: '',
                // desc: '',
                imageUrl: '',
                courseId: ''
            },
            // 相关推荐
            listArray: [], // 数据列表
            // 相关推荐选择的数据
            restaurants: [],
            timeout:  null,
            // 表格配置config没有指定的属性为默认值
            tableParams : [
                {prop: 'index', label : '编号', width: 50},
                {prop: 'name', label : '课程名称'},
                // {prop: 'likenum', label : '运营点赞数', width: 100},
                // {prop: 'realityLikeNum', label : '点赞数', width: 90},
                // {prop: 'createDate', label : '创建时间'},
                // {prop: 'onlinetime', label : '上线时间'},
                // {prop: 'offlinetime', label : '下线时间'},
                // {prop: 'videoNum', label : '视频个数', width: 80},
                // {prop: 'teacherNum', label : '老师个数', width: 80},
                // {prop: 'recommendNum', label : '推荐个数', width:80},
            ],
            // 表格子项展示config配置
            tableSonParams : [
                // {prop: 'name', label : '课程名称'},
                {prop: 'createDate', label : '创建时间'},
                {prop: 'likenum', label : '运营点赞数'},
                {prop: 'realityLikeNum', label : '点赞数'},
                {prop: 'onlinetime', label : '上线时间'},
                {prop: 'offlinetime', label : '下线时间'},
                {prop: 'videoNum', label : '视频个数'},
                {prop: 'teacherNum', label : '老师个数'},
                {prop: 'recommendNum', label : '推荐个数'},
                 {prop: 'url', label : '文章地址'} 
            ],
            tableRecommendParams:[
                {prop: 'name', label : '课程名称'},
                {prop: 'onlinetime', label : '上线时间', width : 150}
            ],
            tableData: [],
            // 是否进行分页数据刷新了
            isPage:false,
            // 可被推荐数据列表
            tableRecommentData: [],
            // 相关推荐下多选框  选取的数据
            multipleSelection: [],
            // 分页的时候保存已经选择的选项
            saveSelection: [],
            // 推荐列表搜索条件
            recommentCriteria: '',
            // 推荐列表分页
            // 当前页是第几页
            recommentCurrentPage: 1,
            // 当前也显示多少条数据
            recommentSize: 5,   
            // 总数据量
            recommentTotalCount: 0,
        }
    },
    created() {
        this.fetchData()
        let params = {
                token: this.token
        }
        crudList(params, '/hart/kss/admin/curriculum/getTeacherKList')
                .then(res => {
                    let array = []
                    if(!res.data.records.length) return
                    res.data.records.map(item => {
                        console.log(typeof item.teacherId)
                        console.log(item.name)
                        array.push({
                            value: item.teacherId,
                            label: item.name
                        })
                    })
                    console.log('老师个数__'+array.length)
                    console.log(array)
                    this.options5 = array
                })
    },
    methods: {
        // 表格行样式控制
        tableRowClassName({row, rowIndex}) {
            console.log('行样式改变')
            console.log(row)
            if (row.rowClass === 1) {
                return 'warning-row';
            }
            // if (row.onlinestatus === 0) {
            //     return 'warning-row';
            // } else if (row.onlinestatus === 1) {
            //     return 'success-row';
            // }
            // return '';
        },
        filterTag(value, row) {
            console.log('筛选')
            return row.onlinestatus === value;
        },
        // 相关推荐下多选框选取
        handleSelectionChange(val) {
            console.log('选取数据')
            console.log(val)
            console.log('____')
            // console.log(this.restaurants)
            if(this.isPage){
                this.isPage = false
                return
            }
            console.log('跳转执行了')
            this.multipleSelection = val;
            // this.listArray = this.listArray.concat(this.multipleSelection)
            this.listArray = this.restaurants.concat(this.multipleSelection)
            // console.log(this.restaurants)
        },
        toggleSelection(rows) {
            if (rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        // 已授 未授切换
        handleClick(tab) {
            console.log(tab)
            this.type = tab.name
            this.fetchData()
        },
        // 格式化日期
        formaterDate(date){
            return date.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)
        },
        // 推荐表格分页
        recommentCurrentChange(val) {
            this.recommentCurrentPage = val
            this.isPage = true
            // 筛选掉不重复的选项数据
            console.log('分页')
            console.log(this.multipleSelection)
            this.restaurants = this.restaurants.concat(this.multipleSelection)
            // this.saveSelection = this.saveSelection.concat(this.multipleSelection)
            this.toggleSelection(this.multipleSelection)
            console.log(this.multipleSelection)
            this.fetchRecommentList()
        },
        recommentSizeChange() {
            this.recommentSize = val
            this.fetchRecommentList()
        },
        // 提交推荐数据
        sendRecommend() {
            let ids = []
            this.listArray.map(item => {
                console.log(item)
                ids.push(item.guid)
            })
            let params = {
                token: this.token,
                curriculumId: this.form.courseId,
                reccurriculumIds : ids.join(',')
            }
            crudList(params, courseRecommend)
                .then(res => {
                    console.log(res)
                    this.$message('推荐设置成功')
                    this.dialogVideoRecommend = false
                    this.listArray = [],
                    this.restaurants = [],
                    this.tableRecommentData = [],
                    this.multipleSelection = []
                })
        },
        delArray(index, row){
            console.log('删除')
            this.listArray.splice(index,1)
            // console.log(this.multipleSelection)
            let array = this.multipleSelection
            var _this = this
            array.forEach((item, index) => {
                console.log('循环')
                console.log(index)
                if(item.id == row.id){
                    _this.multipleSelection.splice(index, 1)
                    this.toggleSelection([row])
                }
            })
            // this.listArray = this.restaurants.concat(this.multipleSelection)
            console.log('循环完成')
            console.log(this.multipleSelection)
        },
        initForm () {
            this.form = {
                name: '',
                type: this.type,
                picurl: '',
                intro: '',
                // date: '',
                // desc: '',
                imageUrl: '',
                courseId: ''
            }
        },
        // 封面图上传
        addFile(file){
          console.log('添加文件')
          console.log(file)
          //   this.form.imageUrl = URL.createObjectURL(file.raw);
          this.file = file.raw
          console.log(file.raw.type)
          const isJPG = file.raw.type == 'image/jpeg';
          const isLt2M = file.raw.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          else if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          else {
            // return isJPG && isLt2M
            this.isCanUpload = true
          }
        },
        uploadPic(){
          if(!this.isCanUpload){
              return
          }
          console.log('开始上传图片')
          let formData = new FormData()
          let file = this.file
          formData.append('file', file)
          formData.append('token', this.token)
          formData.append('type0', 2)
          formData.append('type1', 1)
          console.log('22_'+this.form.articleId)
          formData.append('parentId', this.form.articleId)
          formData.append('token', this.token)
          // 上传文件
          uploadFile(formData)
              .then(res => {
                console.log(res)
                if(res.code == 1){
                    this.form.imageUrl = res.data
                    this.$message('图片上传成功')
                }
          })
        },
        searchRecommentList(val) {
            this.recommentCriteria = val
            this.fetchRecommentList()
        },
        // 刷新可以被推荐数据列表
        fetchRecommentList() {
            let params = {
                token: this.token,
                curriculumId: this.form.courseId,
                size: this.recommentSize,
                criteria : this.recommentCriteria,
                current: this.recommentCurrentPage
            }
            crudList(params, courseCurriculumKList)
                .then(res => {
                    console.log(res)
                    var array = []
                    res.data.records.forEach( (item, index) => {
                        var obj = item
                        item.index = index
                        item.onlinetime = this.formaterDate(item.onlinetime)
                        array.push(obj)
                    })
                    this.tableRecommentData = array
                    this.recommentSize = res.data.size
                    this.recommentCurrentPage = res.data.current
                    this.recommentTotalCount = res.data.total
                })
        },
        // 添加相关推荐
        addRecommentVideo (index, row) {
            console.log('相关推荐')
            this.setForm(row)
            this.recommentCriteria = ''
            this.recommentCurrentPage = 1
            this.listArray = []
            let params = {
                token: this.token,
                curriculumId: row.guid
            }
            // 获取可以被推荐的数据列表
            this.fetchRecommentList()
            // 回显列表的数据    
            crudList(params, courseRecommendList)
                .then(res => {
                    // 列表显示数据
                    this.listArray = res.data
                    // 保存列表最原始的值
                    this.restaurants = res.data
                    console.log(this.listArray)
                })
            this.dialogVideoRecommend = true
        },
        setForm (row) {
            this.form = {
                name: row.name,
                type: row.type,
                likenum: row.likenum,
                picurl: row.picurl,
                intro: row.intro,
                // date: '',
                // desc: '',
                imageUrl: row.picurl,
                courseId: row.guid
            }
        },
        // 设置虚拟点赞数
        vrZan(val) {
            console.log(val)
            var reg = /[0-9]/g
            if(!reg.test(val)){
                this.$message('请输入数字');
            }
        },
        //新增课程
        addCouse(){
            var reg = /[0-9]/g
            console.log(this.form.likenum)
            console.log('虚拟点赞')
            let isNumber = !reg.test(this.form.likenum)
            if(isNumber){
                console.log('虚拟点赞'+!reg.test(this.form.likenum))
                this.$message({
                    message: '虚拟点赞数请输入数字',
                    type: 'error'
                })
                return
            }
            // if(!this.isSend){
            //     return
            // }
            if(this.isEdit){
                var url = courseUpUrl
            }else{
                var url = courseAddUrl
            }
            console.log(this.teachers)
            let params = {
                token: this.token,
                type: this.activeName,
                name: this.form.name,
                likenum: this.form.likenum,
                picurl: this.form.imageUrl,
                guid: this.form.courseId,
                teachers: this.teachers.join(','),
                intro: this.form.intro
            }
            crudList(params, url)
                .then(res => {
                    this.fetchData()
                    console.log(res)
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    })
                    this.dialogFormVisible = false
                })
        },
        // 搜索数据
        search(val) {
          console.log(val)
          this.criteria = val
          this.fetchData()
        },
        // 刷新数据
        fetchData() {
          this.listLoading = true
          let params = {
            token: this.token,
            criteria: this.criteria || '',
            size: this.size,
            type: this.type,
            current: this.currentPage
          }
          getList(params, this.url).then(response => {
            console.log(response)
            this.tableData = response.data.records
            if(!this.tableData.length) return
            this.tableData.map((item, index) => {
                item.progress = 0
                item.index = index+1
                item.url = `pages/videoPlay/videoPlay?id=${item.guid}&courseType=${this.type}`
                this.tableData[index] = item
            })
            this.recommendno = this.tableData[0].recommendno
            this.totalCount = response.data.total
            this.size = response.data.size
            this.listLoading = false
          })
          .catch(res => {
            this.listLoading = false
          })
        },
        // 编辑课程
        handleEdit(index, row) {
            console.log(row);
            this.isEdit = true
            this.title = '修改课程信息'
            this.setForm(row)
             let params = {
                token: this.token,
                curriculumId: row.guid
            }
            crudList(params, '/hart/kss/admin/curriculum/getCurriculumTeacherList')
                    .then(res => {
                        console.log(res.data)
                        let array = []
                        res.data.map(item => {
                            console.log(typeof item.teacherId)
                            console.log(item)
                            array.push(item.teacherId)
                        })
                        // console.log('老师个数__'+array.length)
                        // console.log(array)
                        console.log(this.teachers)
                        this.teachers = array
                        console.log(this.teachers)
                    })
            // this.form.courseId = row.guid
            this.dialogFormVisible = true
        },
        // 删除课程
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm('此操作将删除该课程所有信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                let params = {
                    token: this.token,
                    guid: row.guid
                }
                crudList(params, courseDelUrl)
                    .then((res) => {
                        this.fetchData()
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
            this.$confirm(tip, '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                crudList(params, courseUpUrl)
                    .then(res => {
                        this.fetchData()
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
            this.$confirm(tip, '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                crudList(params, courseUpUrl)
                    .then(res => {
                        this.fetchData()
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
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.size = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.fetchData()
        },
        tableRowClassName() {
            return 'cell-class'
        },
        add(e){
            // 点击添加显示弹窗
            console.log(this.type)
            this.initForm()
            this.teachers = []
            this.form.type = this.type
            this.title = '新增课程'
            this.isEdit = false
            this.dialogFormVisible = e.isShow
        },
        // 编辑详情
        handleEditFormatText(index, row){
          this.$router.push({name: 'formatText', params:{
            content:{
              token: this.token,
              guid: row.guid,
            },
            type: 5,
            url: courseUpUrl
          }})
        },
        rowClick(row,cell,event){
          row.rowClass = 1
          console.log(event)
          console.log(row)
          switch (event.label) {
              case '操作':     
                  break
              case '是否置顶':
                  break  
              case '取消置顶':
                  break  
              case '是否发布':
                  break  
              case '上传视频':
                  break  
              case '传输进度':
                  break 
              case '查看评论': 
                  break  
              case '编辑':
                  break      
              default:
                  this.$router.push({name: 'courseDetail', params:{
                      curriculumId: row.guid
                  }})
                  break;
          }

        },
        handleRecommend(index, row) {
             console.log('去往评论')
             this.$router.push({name: 'recommend', params:{
                token: this.token,
                parentId: row.guid,
                type0: 3,
                type1: 1,
                type: 1
            }})
        },
        // 视频上传
        uploadVideo(index, row){
            this.upVideo = ''
            this.posterVideo = ''
            this.initForm()
            this.index = index
            console.log(this.index)
            this.videoCur = 0
            this.form.courseId = row.guid
            this.dialogVideoVisible = true
        },
        getSignature(callback){
            uploadFileGet(this.token)
                .then( res => {
                    console.log(res)
                    callback(res.data)
                })
        },
        addVideo(){
            $('#addVideo-file').click();
        },
        addCover(){
		      $('#addCover-file').click();
        },
        // 选取视频
        selectVideo(e){
            console.log(e.target.files[0])
            if(e.target.files[0].type !== "video/mp4"){
                this.$message('请选择视频文件')
            }
            var videoFile = e.target.files[0];
            console.log(videoFile)
            let url = URL.createObjectURL(videoFile)
            this.upVideo = url
            this.videoFileList[0] = videoFile;
		    $('#result').append(videoFile.name +　'\n');
        },
        // 选取封面图
        selectCover(e){
            var coverFile = e.target.files[0];
            this.posterVideo = URL.createObjectURL(coverFile)
            this.coverFileList[0] = coverFile;
            $('#result').append(coverFile.name +　'\n');
        },
        // 视频上传进度和状态
        startUploader(){
            console.log(this.videoFileList.length)
            if(this.videoFileList.length){
                // var num = this.addUploaderMsgBox();
                console.log(this.coverFileList)
                if(!this.coverFileList[0]){
                     this.$message({
                            message: '没有上传封面图',
                            type: 'warning'
                    });
                }
                var _this = this
                console.log('开始上传')
                var resultMsg = qcVideo.ugcUploader.start({
                    videoFile: this.videoFileList[0],
                    coverFile: this.coverFileList[0],
                    getSignature: this.getSignature,
                    allowAudio: 1,
                    success: function(result){
                        console.log(result)
                        if(result.type == 'video') {
                            console.log(result)
                            _this.$message({
                                    message: '视频上传成功',
                                    type: 'success'
                            });
                            // this.cosBox[num] = null;
                        } else if (result.type == 'cover') {
                            _this.$message({
                                message: '封面上传成功',
                                type: 'success'
                            });
                        }
                    },
                    error: function(result){
                        console.log(result)
                        if(result.type == 'video') {
                            _this.$message({
                                message: '视频上传失败',
                                type: 'error'
                            });
                        } else if (result.type == 'cover') {
                            _this.$message({
                                message: '封面图上传失败',
                                type: 'error'
                            });
                        }
                    },
                    progress: function(result){
                        console.log(_this.tableData);

                        if(result.type == 'video') {
                            console.log(`视频进度___${_this.index}`+Math.floor(result.curr*100))
                            console.log(_this.tableData[_this.index])
                            let array = _this.tableData[_this.index]
                            array.progress = Math.floor(result.curr*100)
                            _this.$set(_this.tableData, _this.index, array)
                        } 
                    },
                    finish: function(result){
                        console.log(result)
                        let videoTime = Math.floor(_this.$refs.video.duration)
                        let params = {
                            token: _this.token,
                            videoId: result.fileId,
                            curriculumId: _this.form.courseId,
                            name: _this.form.name,
                            videourl: result.videoUrl,
                            picurl: result.coverUrl,
                            intro: _this.form.intro,
                            duration: videoTime
                        }
                        crudList(params, videoSonAddUrl)
                            .then(res => {
                                console.log('上传完成————————')
                                _this.fetchData()
                                console.log(res)
                            })
                        
                    }
                });
                if(resultMsg){
                    $('[name=box'+num+']').text(resultMsg);
                }
            } else {
               this.$message({
                    message: '请提交视频',
                    type: 'warning'
               });
            }
        },
        // 确认提交视频信息
        UploadFile(){
            this.dialogVideoVisible = false
            console.log('啦啦啦啦')
            console.log(this.form)
            // if(!this.form.name){
            //     this.$message.error('请输入视频名称')
            // }
            console.log('提交视频')
            this.startUploader()
            $('#form2')[0].reset()
            this.videoFileList = []
            this.coverFileList = []
        },
        jumpCourseDetail(){
            this.$router.push('/courseDetail/index')
        }
    },
    watch: {
        teachers: (val) => {
            console.log(val)
        }
    }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";

.icon{
    margin-left: 30px;
}
.listBox{
    position: relative;
    padding-right: 20px;
}
.el-collapse-item__content{
    padding: 0;
}
.closeBtn{
    position: absolute;
    right: 0;
    cursor: pointer;
}
.dialog-footer{
    text-align: right;
}
.btnBox{
    display: flex;
    flex-direction: column;
}
.btnBox .el-button{
    margin: 0;
    margin-top: 10px;
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
// 图片上传
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
  }
  .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .up-avatar{
    // margin-left: 50px;
  }
  .avatar-tip{
    width: 178px;  
    text-align: center;
    line-height: 50px;
  }
  .avatar-tip>span{
    border: 1px solid #409EFF;
    background: #409EFF;
    padding: 5px 10px;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
