<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

let id = ref('undefined')
onMounted(() => {
  console.log()
  console.log(router.currentRoute.value.params.id)
  id.value = router.currentRoute.value.params.id
})


</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章浏览</span>
      </div>
    </template>
  </el-card>
</template>

<style scoped lang="scss">

</style>
