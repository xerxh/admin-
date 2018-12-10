<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">汉艺国际小程序-管理系统</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <div class="validatePicBox">
        <p>
          <el-form-item>
            <el-input
              v-model="loginForm.validatePic"
              type="text"
              name="validatePic"
              auto-complete="on"
              placeholder="请输入验证码"
              @keyup.enter.native="handleLogin" />
          </el-form-item>
        </p>
        <div>
          <span>点击刷新:</span>
          <img
            v-if="send"
            ref="pic"
            :src="baseUrl+api+'&&id='+randomNumber"
            class="validatePic"
            @click="refreshPic">
        </div>
      </div>
      <el-form-item>
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      // this.picUrl = `${this.api}${this.loginForm.username}`
      // this.send = true
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      send: true,
      loginForm: {
        username: '',
        password: '',
        validatePic: ''
      },
      randomNumber: 0,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      // baseUrl: 'http://h5h5h5.hartedu.com:8386',
      // baseUrl: 'http://h5h5.hartedu.com:8286',
      // baseUrl: 'http://10.0.192.55:8386',
      baseUrl: 'http://scxcx.hanyiguoji.com:8386',
      api: '/hart/admin/code?adminNo=1',
      picUrl: ''
    }
  },
  methods: {
    refreshPic() {
      this.randomNumber = Math.random()
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // md5加密
          this.loginForm.password = this.$md5(this.loginForm.password)
          this.$store.dispatch('Login', this.loginForm)
            .then(res => {
              console.log(res)
              this.loading = false
              console.log(res)
              this.loginForm.password = ''
              this.loginForm.validatePic = ''
              this.$router.push('/student/index')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.validatePic{
  height: 30px;
  width: 100px;
}
.validatePicBox{
  display: flex;
  justify-content: flex-start;
}
.validatePicBox p{
  flex: 1;
}
.validatePicBox span{
  color : #eee;
}
</style>
