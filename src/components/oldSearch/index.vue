<template>
    <div class="flex-row-start">
        <div class="add-box">
           <el-button v-if="isShow" type="primary" @click="add" size="mini">添加</el-button>
        </div>
        <slot></slot>
        <div class="searchInput">
            <i class="el-icon-search search"></i>
            <input  v-model="inputVal" @keyup.enter="search" type="text" :placeholder="placeholder">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Search', 
    components: {

    },
    props:['isShow', 'placeholder'],
    data() {
        return {
            inputVal: ''
        }
    },
    methods: {
        add() {
            this.$emit('add', {isShow: true})
        },
        search() {
            this.$emit('search', this.inputVal)
        }
    }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/mixin.scss";


</style>
