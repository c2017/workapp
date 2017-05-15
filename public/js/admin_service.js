/**
 * Created by lenovo on 2017/5/11.
 */
angular.module("adminService",[])
    .factory("Notice",function(){
        return {show:false,message:{text:"提示信息",num:1}}
    })

