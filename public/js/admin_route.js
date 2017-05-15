/**
 * Created by lenovo on 2017/5/11.
 */
angular.module("adminRoute",["ngRoute"])
    .config(["$routeProvider","$httpProvider",function(route,http){
        if(!http.defaults.headers.get){
            http.defaults.headers.get={}
        }
        http.defaults.headers.common["X-Requested-With"]='XMLHttpRequest';
        http.defaults.headers.get["Cache-Control"]='no-cache';
        http.defaults.headers.get["Pragma"]='no-cache';

        route
        // 管理用户
            // 添加
            .when("/admin/addUser",{
            templateUrl:"/tpl/admin/addUser.html",
            controller:"addUser"
        })
            // 显示
            .when("/admin/showUser",{
                templateUrl:"/tpl/admin/showUser.html",
                controller:"showUser"
            })
            // 编辑
            .when("/admin/editUser/:id",{
                templateUrl:"/tpl/admin/editUser.html",
                controller:"editUser"
            })
        // 管理内容
            .when("/admin/showCon/:id",{
                templateUrl:"/tpl/admin/showCon.html",
                controller:"showCon"
            })
            .when("/admin/updateCon",{
                templateUrl:"/tpl/admin/updateCon.html",
                controller:"updateCon"
            })
    }])