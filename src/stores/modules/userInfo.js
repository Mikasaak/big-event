import {defineStore} from 'pinia'
import {ref} from 'vue'
export const useUserInfoStore = defineStore('userInfo',()=>{
    //定义状态相关的内容

    const info = ref({})
    const isAdmin = ref(false)

    const setInfo = (newInfo)=>{
        info.value = newInfo
    }


    const removeInfo = ()=>{
        info.value = {}
    }

    return {info,isAdmin,setInfo,removeInfo}

},{persist:true})
