<template>
  <div class="flex-row-start">
    <div class="add-box">
      <slot name="btnForm"/>
    </div>
    <slot />
    <div class="searchInput">
      <i class="el-icon-search search" />
      <input
        v-model="inputVal"
        :placeholder="placeholder"
        type="text"
        @keyup.enter="search">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  components: {

  },
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputVal: ''
    }
  },
  methods: {
    search() {
      this.$emit('search', this.inputVal)
    }
  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";

</style>
