<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {articleCategoryDetailService, articleDetailService} from "@/api/article";

//文章分类管理

const router = useRouter()

const articleInfo = ref({})
onMounted(async () => {
  let id = router.currentRoute.value.params.id
  //调用获取文章详情接口
  let result = await articleDetailService(id);
  articleInfo.value = result.data;

  //获取文章分类名字
  let categoryId = result.data.categoryId
  let CategoryResult = await articleCategoryDetailService(categoryId);
  articleInfo.value.categoryName = CategoryResult.data.categoryName;

})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章浏览</span>
      </div>
    </template>

    <div class="article-container">
      <div class="article-header">
        <img :src="articleInfo.coverImg" alt="文章封面" class="article-cover">
        <div class="article-title-category">
          <h1 class="article-title">{{articleInfo.title}}</h1>
          <p class="article-category">{{articleInfo.categoryName}}</p>
        </div>
      </div>
      <div class="article-content" v-html="articleInfo.content">
      </div>
    </div>

  </el-card>
</template>

<style scoped lang="scss">
.test {
  width: 100%;
  height: 3000px;
  background-color: #fff;
}
.article-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 90%;
  margin: 20px;
  overflow: hidden;
}

.article-header {
  position: relative;
}

.article-cover {
  width: 100%;
  height: auto;
  display: block;
}

.article-title-category {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 10px;
  border-radius: 5px;
}

.article-title {
  margin: 0;
  font-size: 4em;
}

.article-category {
  margin: 0;
  font-size: 2em;
  opacity: 0.8;
}

.article-content {
  padding: 20px;
  line-height: 1.6;
  color: #333;
}

.article-content p {
  margin-bottom: 1em;
}


</style>
