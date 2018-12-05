<template>
    <div class="dashboard-container">
        <div class="title">系统管理</div>   
        <div class="flex-row-start">
            <el-button type="primary" size="mini" @click="add">添加</el-button>
            <Search @add="add" @search="search" placeholder="pdf名称" />  
            <!-- <el-button type="success" size="mini" @click="addCompany">公司简介</el-button>

            <el-button type="danger" size="mini" @click="addHelp">帮助中心</el-button> -->
            <!-- <div class="box">
                <el-cascader
                    size="mini"
                    change-on-select
                    expand-trigger="hover"
                    :options="options"
                    @change="handleChange">
                </el-cascader>
            </div> -->
            <!-- <el-button type="info" plain @click="system"  size="mini">搜索</el-button> -->
        </div>
        <!-- 老师管理 -->
        <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="我已经飙到极限啦！！！---->火箭加载中"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
                <el-table-column v-for="(item, index) in tableParams" :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width">
                </el-table-column>
                <!-- <el-table-column label="是否置顶" width="100">
                    <template slot-scope="scope">
                        <el-button
                        type="primary"
                        size="mini"
                        @click="handleTop(scope.$index, scope.row)"> {{scope.row.no > 0 ? '是' : '否'}}</el-button>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column label="取消置顶" width="120">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="delhandleTop(scope.$index, scope.row)">
                            取消置顶
                        </el-button>
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <!-- <span @click="handleEdit(scope.$index, scope.row)">
                            <i class="el-icon-edit-outline"></i>
                        </span> -->
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                    <el-form-item label="名称">
                            <el-input  v-model="form.val"></el-input>
                    </el-form-item>
                    <el-form-item label="请输入内容">
                        <el-upload
                            class="upload-demo"
                            drag
                            ref="upload"
                            :show-file-list="false"
                            :on-change="handlePreview"
                            :auto-upload="true"
                            limit:1
                            :on-progress="pdfProgressFunc"
                            :http-request="uploadPic"
                            action="/hart/kss/file/upload">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <!-- <div class="el-upload__tip" slot="tip">上传文件</div> -->
                        </el-upload>
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" status="success"></el-progress>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addsPdf">确 定</el-button>
            </div>
            </el-dialog>
    </div>
    <!-- // 分页 -->
</template>

<script>
import { mapGetters } from 'vuex'
import { pdfAddUrl, pdfDelUrl, pdfListUrl, crudList} from '@/api/util'
import Search from '@/components/search'
import { uploadFile } from '@/api/upload'

export default {
    components:{
        Search
    },
    computed: {
      ...mapGetters([
        'name',
        'roles',
        'token',
        'progress'
      ])
    },  
    data() {
        return {
        dialogFormVisible: false,
        selectedOptions2: '',
        title: '',
        // 搜索条件
        criteria: '',
        // 是否是修改操作
        isEdit: false,
        // 置顶位置
        no: 0,
        // editID
        editId: '',
        // 是否显示列表加载条
        listLoading: true,
        // 当前页是第几页
        currentPage: 1,
        // 当前也显示多少条数据
        size: 10,
        // 总数据量
        totalCount: 0,
        // 上传进度条
        pdfProgress: 0,
        // 搜索条件
        type0: '',
        type1: '',
        form: {
            val: '',
            type: '',
            info: '',
            FileUrl: ''
        },
        // 没有指定的属性为默认值
        tableParams : [
            {prop: 'index', label : '编号', width: 50},
            {prop: 'name', label : '名称', width: 100},
            // {prop: 'typeName1', label : '搜索类型', width: 100},
            {prop: 'createUserName', label : '上传人', width: 100},
            // {prop: 'age', label : '年龄', width: 80, sort: true},
            // {prop: 'recommendno', label : '置顶', width:120, sort: true},
            {prop: 'fileurl', label : '文件地址'}
        ],
        formOptions:[
            {
                value: '2', 
                label: '文章',
                // children:[
                //     {value: '2', label: '热门搜索'},
                //     {value: '1', label: '展示搜索'}
                // ]
            }
            //{
                // value: '1', 
                // label: '课程',
                // children:[
                //     {value: '2', label: '热门搜索'},
                //     {value: '1', label: '展示搜索'}
                // ]
            //}
        ],
        tableData: []
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
          let params = {
            token: this.token,
            criteria: this.criteria || '',
            size: this.size,
            // type0: this.type0,
            // type1: this.type1,
            current: this.currentPage
          }
          crudList(params, pdfListUrl).then(response => {
            console.log(response)
            this.tableData = response.data.records
            this.tableData.map((item, index) => {
                item.index = index+1
                this.tableData[index] = item
            })
            // this.recommendno = this.tableData[0].recommendno
            this.totalCount = response.data.total
            this.size = response.data.size
            this.listLoading = false
          })
        },
        uploadPic(){
            console.log('开始上传文件')
            let formData = new FormData()
            let file = this.file
            console.log(this.file)
            // if(file.type !== 'application/pdf'){
            //     this.$message({
            //         message: '请选择PDF格式',

            //     })
            //     return
            // }
            formData.append('file', file)
            formData.append('token', this.token)
            formData.append('type0', 4)
            formData.append('type1', 1)
            // 上传文件
            console.log(this.progress)
            uploadFile(formData)
                .then(res => {
                    console.log(res)
                    console.log('上传成功')
                    if(res.code == 1){
                        this.$message(res.msg)
                        this.form.FileUrl = res.data
                    }
            })
        },
        pdfProgressFunc(event, file, fileList) {
            console.log(event)
        },
        handlePreview(file, fileList) {
            console.log(file);
            console.log(fileList)
            this.file = file.raw
            // this.picImg = file.url
            // console.log(this.picImg)
        },
        search(val) {
            console.log(val)
            this.criteria = val
            this.fetchData()
        },
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm('此操作将删除该PDF信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                let params = {
                    token: this.token,
                    guid: row.guid
                }
                console.log('发送请求')
                crudList(params, pdfDelUrl)
                        .then(res => {
                            this.fetchData()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        })
            }).catch((error) => {
              console.log('错误')  
              this.$message({
                type: 'info',
                message: '已取消删除'
            }) 
          }) 
        },
        delhandleTop(index, row) {
            this.$confirm('是否确认取消置顶', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消'
                }).then(() => {
                    let params = {
                        token: this.token,
                        guid: row.guid,
                        no: 0
                    }
                    crudList(params, systemUpUrl)
                        .then(res => {
                            console.log('取消置顶成功')
                            this.fetchData()
                            this.$message({
                                type: 'success',
                                message: '取消置顶成功!'
                            });
                        })
                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消置顶'
                }) 
            }) 
        },
        // 置顶
        handleTop(index, row) {
            console.log('是否置顶');
            var params = {
                token: this.token,
                guid: row.guid
            }
            console.log(row.no)
            if(row.no > 0){ // 已经是置顶状态
                var tip = '是否取消置顶'
                var successTip = '取消置顶成功!'
                var errorTip = '已取消操作!'
                params.no = 0
            }else{ 
                params.no = ++this.no
                var tip = '是否确认进行置顶'
                var successTip = '置顶成功!'
                var errorTip = '已取消操作!'
            }
            this.$confirm(tip, '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                crudList(params, systemUpUrl)
                    .then(res => {
                        console.log(res)
                        this.fetchData()
                        this.$message({
                            type: 'success',
                            message: successTip
                        })
                    });
            }).catch(() => {
                console.log('取消')
                this.$message({
                    type: 'info',
                    message: errorTip
                }) 
            }) 
        },
        handleEdit(index, row) {
            console.log(index, row);
            this.isEdit = true
            this.form.val = row.name
            this.title = '修改PDF内容'
            this.dialogFormVisible = true
        },
        swichSelect() {
            this.isEdit = false
        },
        handleSizeChange(val) {
            this.size = val
            this.fetchData()
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.fetchData()
            console.log(`当前页: ${val}`);
        },
        tableRowClassName() {
            return 'cell-class'
        },
        handleChange (e) {
            console.log(e)
            this.form.type = e[0]
        },
        // 搜索
        system() { 
            this.fetchData()
        },
        addsPdf() {
            if(!this.form.FileUrl){
                this.$message({
                    message: '请上传完成PDF'
                })
                return
            }
            if(!this.form.val){
                this.$message({
                    message: '请填写pdf名称'
                })
                return
            }
            let params = {
                token: this.token,
                name: this.form.val,
                fileurl: this.form.FileUrl
            }
            let url = pdfAddUrl
            crudList(params, url)
                    .then(res => {
                        console.log(res)
                        this.fetchData()
                    })
            console.log(this.form)
            this.dialogFormVisible = false
        },
        initForm () {
            this.form.val = ''
            this.currentPage = 1
        },
        add(){
            this.initForm()
            this.$store.dispatch('getProgress', 0)
            this.title = '添加PDF文件'
            this.dialogFormVisible = true
        }

    }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";

.box{
    margin: 0 30px 0 150px;
}
.icon{
    margin-left: 30px;
}
.dialog-footer{
    text-align: right;
}
</style>
