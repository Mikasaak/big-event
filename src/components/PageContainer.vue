<script setup>
defineProps({
  title: {
    type: String,
    default: 'card title'
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span class="title">{{ title }}</span>
        <div class="extra">
          <slot name="extra">
            <el-button type="primary" size="mini">添加</el-button>
          </slot>
        </div>
      </div>
    </template>
    <slot>
      <div v-for="index in 3" :key="index">请输入内容</div>
    </slot>
  </el-card>
</template>

<style scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
