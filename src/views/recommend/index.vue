<template>
    <div class="dashboard-container">
        <div class="title course-title">评论列表展示</div>
        <Search 
          :isShow="true" 
          @add="add"  
          @search="search" 
          placeholder="用户昵称/评论内容"/>
        <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="我已经飙到极限啦！！！---->火箭加载中"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
            <el-table-column v-for="(item, index) in tableParams" :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width">
            </el-table-column>
            <el-table-column label="审核是否通过" width="110">
                <template slot-scope="scope">
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleRelease(scope.$index, scope.row)">
                            {{scope.row.status ==  -1 ? '待审批' : '已通过'}}
                        </el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <!-- <template slot-scope="scope">
                    <span @click="handleEdit(scope.$index, scope.row)">
                        <i class="el-icon-edit-outline"></i>
                    </span>
                    <span class="icon" @click="handleDelete(scope.$index, scope.row)">
                        <i class="el-icon-close"></i>
                    </span>
                </template> -->
                <template slot-scope="scope">                    
                    <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">回复评论</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除评论</el-button>
                </template>
            </el-table-column>
            <el-table-column label="数据类型" width="100">
                <template slot-scope="scope">
                    <div>{{scope.row.istrueName}}</div>
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

        <el-dialog title="回复评论" 
        width="40%"
        center
        :visible.sync="dialogFormVisible"> 
          <div>
            <p> 
                <img :src="form.user.imgUrl" class="avatar" alt="">
                <span>用户名：{{form.user.recommendName}}</span>
                <span>{{form.user.recommendTime}}</span>
            </p>
            <p class="titleBox">评论内容:</p>
            <div class="recommentBox">
                {{form.user.recommendContent}}
            </div>
            <p class="titleBox">
                回复评论:
            </p>
            <div>
                <el-input  
                    v-model="form.admin.recommendContent"
                    :autosize="{ minRows: 5, maxRows: 5}"
                    type="textarea"/>
            </div> 
          </div>  
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateRecommend">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="添加评论" 
        width="40%"
        center
        :visible.sync="dialogaddFormVisible"> 
            <el-form  status-icon  ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="头像:">
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
                            <img v-if="form.user.imgUrl" :src="form.user.imgUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div slot="tip" class="avatar-tip">
                            <!-- <span @click="submitUpload">用户头像上传</span> -->
                            </div>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="用户名昵称">
                    <el-input v-model="form.user.recommendName"></el-input>
                </el-form-item>
                <el-form-item label="用户评论">
                    <el-input  
                    v-model="form.user.recommendContent"
                    :autosize="{ minRows: 5, maxRows: 5}"
                    type="textarea"/>
                </el-form-item>
                <el-form-item label="回复评论">
                     <el-input  
                     
                    v-model="form.admin.recommendContent"
                    :autosize="{ minRows: 5, maxRows: 5}"
                    type="textarea"/>
                </el-form-item>
          </el-form>  
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRecommend">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import Search from '@/components/oldSearch'
import { 
  recommendAddUrl, 
  recommendDelUrl, 
  recommendUpUrl, 
  recommendUrl, 
  crudList 
  } from '@/api/util'
import { uploadFile } from '@/api/upload'
import { mapGetters } from 'vuex'

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
            dialogFormVisible: false,
            dialogaddFormVisible: false,
            title: '',
            isCanUpload: false,
            // 搜索条件
            criteria: '',
            // 是否显示列表加载条
            listLoading: false,
            // 当前页是第几页
            currentPage: 1,
            // 当前也显示多少条数据
            size: 10,
            // 总数据量
            totalCount: 0,
            params: {},
            form:{
                guid: '',
                user: {
                    imgUrl: '',
                    recommendName: '',
                    recommendTime: '',
                    recommendContent: '222'
                },
                admin: {
                    content: '回复'
                }
            },
            // 没有指定的属性为默认值
            tableParams : [
                {prop: 'index', label : '编号', width: 70},
                {prop: 'userName', label : '用户昵称', width: 100},
                {prop: 'content', label : '评论内容'},
                // {prop: 'age', label : '年龄', width: 80, sort: true},
                // {prop: 'recommendno', label : '置顶', width:120, sort: true},
                {prop: 'replyerName', label : '回复人名称', width: 100},
                {prop: 'replyMsg', label : '回复内容'},
                {prop: 'replyTime', label : '回复时间', width: 170}
            ],
            tableData: []
        }
    },
    created() {
        this.params = this.$route.params
        console.log(this.params)
        this.fetchData()
    },
    methods:{
        fetchData() {
          this.listLoading = true
          let params = {
            token: this.token,
            criteria: this.criteria || '',
            size: this.size,
            parentId: this.params.parentId,
            current: this.currentPage
          }
          crudList(params, recommendUrl).then(response => {
            console.log(response)
            this.tableData = response.data.records
            this.tableData.map((item, index) => {
              item.index = ++index + (this.currentPage - 1) * this.size
              item.progress = 0
              return item
            })
            this.totalCount = response.data.total
            this.size = response.data.size
            console.log(this.tableData)
            this.listLoading = false
          })
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
        setForm(row) {
           let form = {
                guid: row.guid,
                user: {
                    imgUrl: row.picurl,
                    recommendName: row.userName,
                    recommendTime: row.createDate,
                    recommendContent: row.content
                },
                admin: {
                    recommendContent: row.replyMsg
                }
            }
            this.form = form 
        },
        initForm() {
           let form = {
                guid: '',
                user: {
                    imgUrl: '',
                    recommendName: '',
                    recommendTime: '',
                    recommendContent: ''
                },
                admin: {
                    recommendContent: ''
                }
            }
            this.form = form 
        },
        // 修改
        handleEdit(index, row) {
            console.log(row);
            this.setForm(row)
            this.dialogFormVisible = true
        },
        // 搜索数据
        search(val) {
          console.log(val)
          this.criteria = val
          this.fetchData()
        },
        // 上传用户头像
        submitUpload(){
          if(this.isCanUpload){
              this.$refs.upload.submit()
              this.$refs.upload.clearFiles()
              this.isCanUpload = false
          }          
          // let formData = new FormData()
          // formData.append('MultipartFile', file)
          // uploadFile()
        },
        addFile(file){
          console.log('添加文件')
          console.log(file)
          this.form.imageUrl = URL.createObjectURL(file.raw);
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
          console.log('开始上传图片')
          let formData = new FormData()
          let file = this.file
          formData.append('file', file)
          formData.append('token', this.token)
          formData.append('type0', this.params.type0)
          formData.append('type1', this.params.type1)
          console.log('22_'+this.form.articleId)
          formData.append('parentId', this.params.guid)
          // 上传文件
          uploadFile(formData)
              .then(res => {
                console.log(res)
                this.$message({
                    message: '图片上传成功',
                    type: 'success'
                })
                this.form.user.imgUrl = res.data
          })
        },
        // 新增
        add() {
            this.initForm()
            this.dialogaddFormVisible = true
        },
        addRecommend() {
            let params = {
                token: this.token,
                userName: this.form.user.recommendName,
                picurl: this.form.user.imgUrl,
                parentId: this.params.parentId,
                content: this.form.user.recommendContent,
                replyMsg: this.form.admin.recommendContent,
                // type: this.params.type
            }
            crudList(params, recommendAddUrl)
                .then(res => {
                    console.log(res)
                    this.fetchData()
                    this.$message({
                        message: '评论发布成功',
                        type: 'success'
                    })
                    this.dialogaddFormVisible = false
                })
        },
        // 删除
        handleDelete(index, row) {
          console.log(row);
          this.$confirm('此操作将删除该评论所有信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let params = {
                guid : row.guid,
                token : this.token
              }
              crudList(params, recommendDelUrl)
                .then(res => {
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
        // 评审
        handleRelease(index, row) {
            if(row.status == -1){
                var status = 0
                var tip = '确认通过审批'
                var successTip = '审批通过!'
                var errorTip = '已取消操作!'
            }else if(row.status == 0){
                var  status = -1
                var tip = '取消审批状态'
                var successTip = '取消审批状态成功!'
                var errorTip = '已取消操作!'
            }else{
                return
            }
            let params = {
                token: this.token,
                guid: row.guid,
                status: status
            }
            this.$confirm(tip, '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                crudList(params, recommendUpUrl)
                    .then(res => {
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
        updateRecommend(){
            let params = {
                token: this.token,
                guid: this.form.guid,
                replyMsg: this.form.admin.recommendContent
            }
            crudList(params, recommendUpUrl)
                .then(res => {
                    console.log(res)
                    this.fetchData()
                    this.$message({
                        type: 'success',
                        message: '回复评论成功'
                    })
                    this.dialogFormVisible = false
                })
        }
    }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";

.dialog-footer{
    text-align: right;
}
.course-title{
    margin-left: 25px;
}
.icon{
    margin-left: 30px;
}
.recommentBox{
    margin: 20px 0;
    // border: 1px solid gray;
}
.avatar{
    width: 100px;
    border-radius: 50%;
    height: 100px;
}
.titleBox{
    margin: 10px 0;
}
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
