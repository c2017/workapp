/*
*   link
*   script
*
*   a
*
*   img src
*
*   ajax({
*   url:"/tpl/main.html"})
*
* */
angular.module("Route",["ngRoute"])
.config(["$routeProvider",function(route){
        route.when("/",{
            templateUrl:"/tpl/main.html",
            controller:"main"
        })
            // todo
            .when("/todo",{
            templateUrl:"/tpl/todo.html",
            controller:"todo"
        }).when("/todocon",{
            templateUrl:"/tpl/todocon.html",
            controller:"todocon"
        }).when("/todoinfo/:id",{
            templateUrl:"/tpl/todoinfo.html",
            controller:"todoinfo"
        })
            // list
            .when("/list",{
            templateUrl:"/tpl/list.html",
            controller:"list"
        })

        // 消息
            // msg
            .when("/msg",{
                templateUrl:"/tpl/msg.html",
                controller:"msg"
            })
            //写消息
            .when("/msgWrite",{
            templateUrl:"/tpl/msgWrite.html",
            controller:"msgWrite"
        })
            // 查看已发送消息列表
            .when("/msgSendList",{
                templateUrl:"/tpl/msgSendList.html",
                controller:"msgSendList"
            })
            // 查看消息内容
            .when("/showmsg/:id",{
                templateUrl:"/tpl/showmsg.html",
                controller:"showmsg"
            })
            // 查看接收消息列表
            .when("/msgReceive",{
                templateUrl:"/tpl/msgReceive.html",
                controller:"msgReceive"
            })

    // 查看个人信息
            .when("/config",{
                templateUrl:"/tpl/config.html",
                controller:"config"
            })
            .when("/userInfo",{
                templateUrl:"/tpl/userInfo.html",
                controller:"userInfo"
            })


}])