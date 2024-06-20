<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {ref, toRaw, watch} from 'vue'
import {
  articleCategoryListService,
  articleListService,
  articleAddService,
  articleDeleteService, articleUpdateService, articleDetailService,
  allArticleListService
} from '@/api/article.js'


//文章分类数据模型
const categorys = ref([
  {
    "id": 3,
    "categoryName": "美食",
    "categoryAlias": "my",
    "createTime": "2023-09-02 12:06:59",
    "updateTime": "2023-09-02 12:06:59"
  },
  {
    "id": 4,
    "categoryName": "娱乐",
    "categoryAlias": "yl",
    "createTime": "2023-09-02 12:08:16",
    "updateTime": "2023-09-02 12:08:16"
  },
  {
    "id": 5,
    "categoryName": "军事",
    "categoryAlias": "js",
    "createTime": "2023-09-02 12:08:33",
    "updateTime": "2023-09-02 12:08:33"
  }
])

//用户搜索时选中的分类id
const categoryId = ref('')

//用户搜索时选中的发布状态
const state = ref('')

//文章列表数据模型
const articles = ref([
  // {
  //   "id": 5,
  //   "title": "陕西旅游攻略",
  //   "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
  //   "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
  //   "state": "草稿",
  //   "categoryId": 2,
  //   "createTime": "2023-09-03 11:55:30",
  //   "updateTime": "2023-09-03 11:55:30"
  // },
  // {
  //   "id": 5,
  //   "title": "陕西旅游攻略",
  //   "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
  //   "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
  //   "state": "草稿",
  //   "categoryId": 2,
  //   "createTime": "2023-09-03 11:55:30",
  //   "updateTime": "2023-09-03 11:55:30"
  // },
  // {
  //   "id": 5,
  //   "title": "陕西旅游攻略",
  //   "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
  //   "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
  //   "state": "草稿",
  //   "categoryId": 2,
  //   "createTime": "2023-09-03 11:55:30",
  //   "updateTime": "2023-09-03 11:55:30"
  // },
])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  articleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  articleList()
}
//回显文章分类
const articleCategoryList = async () => {
  let result = await articleCategoryListService();

  categorys.value = result.data;
}

//获取文章列表数据
const articleList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null
  }
  let result = await allArticleListService(params);

  //渲染视图
  total.value = result.data.total;
  articles.value = result.data.items;

  //处理数据,给数据模型扩展一个属性categoryName,分类名称
  for (let i = 0; i < articles.value.length; i++) {
    let article = articles.value[i];
    for (let j = 0; j < categorys.value.length; j++) {
      if (article.categoryId == categorys.value[j].id) {
        article.categoryName = categorys.value[j].categoryName;
      }
    }
  }
}


articleCategoryList()
articleList();

//添加表单数据模型
const articleModel = ref({
  title: '',
  categoryId: '',
  coverImg: '',
  content: '',
  state: ''
})
const defaultArticleModel = {
  title: '',
  categoryId: '',
  coverImg: '',
  content: '',
  state: ''
}


//导入token
import {useTokenStore} from '@/stores';
import router from "@/router";

const tokenStore = useTokenStore();

//上传成功的回调函数
const uploadSuccess = (result) => {
  articleModel.value.coverImg = result.data;
  console.log(result.data);
}

//添加文章


const addArticle = async (clickState) => {
  //把发布状态赋值给数据模型
  isArticleUpdate.value = false;

  articleModel.value = {
    ...defaultArticleModel,
    state: clickState
  }
  //调用接口
  let result = await articleAddService(articleModel.value);

  ElMessage.success(result.msg ? result.msg : '添加成功');

  //让抽屉消失
  visibleDrawer.value = false;

  //刷新当前列表
  articleList()
}
const deleteArticle = (id) => {
  //提示用户  确认框

  ElMessageBox.confirm(
      '你确认要删除该分类信息吗?',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //调用接口
        let result = await articleDeleteService(id);
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        //刷新列表
        articleList()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '用户取消了删除',
        })
      })
}

//编辑文章
const editorArticle = async () => {
  //调用接口
  isArticleUpdate.value = false;

  let result = await articleUpdateService(articleModel.value);
  ElMessage.success(result.msg ? result.msg : '修改成功');
  //让抽屉消失
  visibleDrawer.value = false;

  //刷新当前列表
  articleList()
}

const getArticleDetail = async (id) => {
  //调用接口
  isArticleUpdate.value = true;

  let result = await articleDetailService(id);
  console.log(result.data)
  articleModel.value = result.data;

  visibleDrawer.value = true;

}

// const quillEditor = ref(null)

const handleClickArticle = (row) => {
  console.log(row)
  console.log(row.categoryName)
  router.push('/article/detail/' + row.id)
}


</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章浏览</span>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId">
          <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="articleList">搜索</el-button>
        <el-button @click="categoryId = ''; state = ''">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%" @row-click="handleClickArticle">
      <el-table-column label="封面" width="300">
        <template #default="{row}">
          <img :src="row.coverImg" alt="" style="width: 100px; height: 100px;"/>
        </template>
      </el-table-column>
      <el-table-column label="文章标题" width="300" prop="title"></el-table-column>
      //文章封面

      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"></el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <template #empty>
        <el-empty description="没有数据"/>
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total"
                   @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end"/>

    <!-- 抽屉 -->
  </el-card>
</template>

<style scoped lang="scss">

</style>
