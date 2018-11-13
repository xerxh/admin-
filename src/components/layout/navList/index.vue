<template>
  <el-col>
    <el-menu
      :default-active="routeUrl"
      router>
      <el-menu-item
        v-for="(item, position) in navList"
        :index="item.path"
        :key="position">
        <i :class="item.icon" />
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      routeUrl: '/student/index',
      navList: [
        { icon: 'el-icon-location', title: '学生管理', path: '/student/index' },
        { icon: 'el-icon-location', title: '老师管理', path: '/teacher/index' },
        // { icon: 'el-icon-location', title: '商品管理', path: '/commodity/index' },
        { icon: 'el-icon-location', title: '首页管理', path: '/index/index' },
        { icon: 'el-icon-location', title: '课程管理', path: '/course/index' },
        { icon: 'el-icon-location', title: '订单管理', path: '/order/index' },
        { icon: 'el-icon-location', title: '运营管理', path: '/operation/index' }
      ]
    }
  },
  created() {
    console.log('列表')
    console.log(this.$route.path)
    this.routeUrl = this.$route.path
  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";
.el-menu{
  border: 0;
}
</style>
