<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {reactive, ref} from 'vue'
import {
  userListService,
  userDeleteService, userAddService,
} from '@/api/manage.js'


//文章列表数据模型
const users = ref([])
const searchUserName = ref('')
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  userList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  userList()
}


//获取用户列表数据
const userList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    search: searchUserName.value
  }



  let result = await userListService(params);

  //渲染视图
  total.value = result.data.total;
  users.value = result.data.items;
}

userList();


//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型

//导入token
import {useTokenStore} from '@/stores';

const tokenStore = useTokenStore();

//上传成功的回调函数

const deleteArticle = async (id) => {
  ElMessageBox.confirm(
      '您确认要删除吗?',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //调用接口
        let result = await userDeleteService(id);
        ElMessage.success(result.msg ? result.msg : '删除成功')
        userList();
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '用户取消了删除',
        })
      })
}

const userAddData = ref({
  username: '',
  password: '',
  rePassword: ''
})
const FormRef = ref(null)

const checkRePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次确认密码'))
  } else if (value !== userAddData.value.password) {
    callback(new Error('请确保两次输入的密码一样'))
  } else {
    callback()
  }
}

const formRules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur'}
  ],
  rePassword: [
    {validator: checkRePassword, trigger: 'blur'}
  ]
}




const handleAddUser = () => {
  userAddData.value = {
    username: '',
    password: '',
    rePassword: ''
  }
  visibleDrawer.value = true
}

const confirmAddUser = async () => {

  await FormRef.value.validate()
  const res = await userAddService(userAddData.value)
  if (res.code === 0) {
    ElMessage.success(res.msg ? res.msg : '添加成功')
    userList()
    visibleDrawer.value = false
  } else {
    ElMessage.error(res.msg ? res.msg : '添加失败')
  }
}

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户管理</span>
        <div class="extra">
          <el-button type="primary" @click="handleAddUser">添加用户</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="用户名：">
        <el-input v-model="searchUserName" placeholder="请输入要搜索的用户名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="userList">搜索</el-button>
        <el-button @click="searchUserName = '';">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 用户列表 -->
    <el-table :data="users" style="width: 100%">
      <el-table-column label="头像" prop="userPic">
        <template #default="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.userPic" :fit="fit"/>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickname"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="是否为管理员" prop="status">
        <template #default="{row}">
          <el-tag v-if="row.status === 2" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <!--          <el-button :icon="Edit" circle plain type="primary" @click="getArticleDetail(row.id)"></el-button>-->
          <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row.id)"></el-button>
        </template>
      </el-table-column>
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
    <el-drawer v-model="visibleDrawer" title="添加用户" direction="rtl" size="50%">
      <!-- 添加文章表单 -->
      <el-form :model="userAddData" label-width="100px" :rules="formRules" ref="FormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userAddData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userAddData.password" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" v-model="userAddData.rePassword" placeholder="请再次输入用户密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmAddUser">确认添加</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-card>
</template>
<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
