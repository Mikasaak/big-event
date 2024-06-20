import {createRouter, createWebHistory} from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import ArticleCategoryVue from '@/views/article/ArticleCategory.vue'
import ArticleManageVue from '@/views/article/ArticleManage.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import ArticleBrowseVue from "@/views/article/ArticleBrowse.vue";
import ArticleDetailVue from "@/views/article/ArticleItem.vue";
import userManageVue from "@/views/manage/UserManage.vue";
import {useTokenStore, useUserInfoStore} from "@/stores";

//定义路由关系
const routes = [
    {path: '/login', component: LoginVue},
    {
        path: '/', component: LayoutVue, redirect: '/article/manage', children: [
            {path: '/article/category', component: ArticleCategoryVue},
            {path: '/article/manage', component: ArticleManageVue},
            {path: '/user/manage', component: userManageVue},
            {path: '/article/check', component: ArticleBrowseVue},
            {path: '/article/detail/:id', component: ArticleDetailVue},
            {path: '/user/info', component: UserInfoVue},
            {path: '/user/avatar', component: UserAvatarVue},
            {path: '/user/resetPassword', component: UserResetPasswordVue}
        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})


router.beforeEach((to, from, next) => {
    //获取token
    const userInfoStore = useUserInfoStore()
    const tokenStore = useTokenStore()

    const token = tokenStore.token
    //判断是否登录
    if (to.path === '/login') {
        next()
    } else {
        if (token) {
            next()
        } else {
            next('/login')
        }
    }
    //判断是否为管理员
    const isAdmin = userInfoStore.isAdmin
    if (to.path === '/article/category') {
        if (isAdmin) {
            next()
        } else {
            next('/user/info')
        }
    }
})
//导出路由
export default router
