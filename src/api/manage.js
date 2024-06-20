import request from '@/utils/request.js'
//用户列表查询
export const userListService = (params)=>{
    return  request.get('/user/list',{params:params})
}
//用户添加
export const userAddService = (registerData)=>{
    //借助于UrlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
    return request.post('/user/register',params);
}
//用户删除
export const userDeleteService = (id)=>{
    return request.delete(`/user/delete?id=${id}`);

}


export const userUpdateService = (articleData)=>{
    return request.put('/user',articleData);
}

