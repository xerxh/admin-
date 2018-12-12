<template>
  <div>
    <navbar/>
    <div class="flex-row-start mainBox">
      <div class="navBox">
        <navList />
      </div>
      <div class="tableBox">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"/>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, navList } from '@/components/layout'
export default {
  name: 'Layout',
  components: {
    Navbar,
    navList
  },
  data() {
    return {

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

.navBox{
  border-right: 1px solid #e6e6e6;
}
.mainBox{
  // height: 650px;
}
.tableBox{
  flex: 1;
}
</style>

