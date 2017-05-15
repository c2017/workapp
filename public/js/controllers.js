angular.module("Controllers",["service"])
.controller("main",["$scope","$http",function($scope,$http){

    var swiper = new Swiper('.swiper-container',{
        pagination : '.swiper-pagination',
        scrollbar:'.swiper-scrollbar',
        effect : 'coverflow',
        onTransitionEnd:function(){

        }
    });

    $scope.data=[];

    $http({url:"/indexData"}).then(function(data){
        $scope.data=data.data;
        // console.log(data.data);
    })

}])
    .controller("notice",["$scope","$http","$timeout","Notice",function($scope,$http,$timeout,Notice){
        $scope.notice=Notice;

        $scope.hiddenFun=function(){
            $scope.notice.show=false;
        };

        // 监听message属性的变化
        var firstflag=false; // 第一次监听不执行
        $scope.$watch("notice.message.num",function(){
            if(firstflag){
                Notice.show=true;
            }
            firstflag=true;
            $timeout(function(){
                Notice.show=false;
            },2000)
        },false)

    }])
    /*
    * msg
    * */
    // 打开 信息页面
    .controller("msg",["$scope","$http",function($scope,$http){

}])
    // 写信息
    .controller("msgWrite",["$scope","$http","Notice",function($scope,$http,Notice){

        // 联系人用户信息
        $scope.user=[];
        $scope.msg={
            jieshouid:"",
            title:"",
            con:""
        }

        // 获取可联系人
        $http({url:"/msgWrite/user"})
            .then(function(e){
                if(e=="false"){
                    Notice.message.text='获取联系人信息失败';
                    Notice.message.num++;
                }else{
                    $scope.user=e.data;
                }
            })

        // 发送消息
        $scope.send=function(){
            if(!$scope.msg.jieshouid){
                Notice.message.text="请选择目标用户";
                Notice.message.num++;
            }else if(!$scope.msg.title){
                Notice.message.text="请选择目标用户";
                Notice.message.num++;
            }else{
                $http({url:"/msgWriteInfo",params:{jieshouid:$scope.msg.jieshouid,title:$scope.msg.title,con:$scope.msg.con}})
                    .then(function(e){
                        if(e.data==false){
                            Notice.message.text="发送失败";
                            Notice.message.num++;
                        }else if(e.data=="ok"){
                            Notice.message.text="发送成功";
                            Notice.message.num++;
                        }else{
                            Notice.message.text="发送异常";
                            Notice.message.num++;
                        }
                    })
            }

        }


}])
    // 查看发送过的消息
    .controller("msgSendList",["$scope","$http","Notice","Dragdel",function($scope,$http,Notice,Dragdel){
        $scope.data=[];
        $http({url:"/msgSendList"})
            .then(function(e){
                if(e.data=='false'){
                    Notice.message.text="查询失败";
                    Notice.message.num++;
                }else{
                    $scope.data=e.data;
                }
            })

        Dragdel();

        $scope.del=function(msid){
            $http({url:"/msgSend/del",params:{msid:msid}})
                .then(function(e){
                    if(e.data="ok"){
                        Notice.message.text="删除成功";
                        Notice.message.num++;

                            angular.forEach($scope.data,function(obj,index){
                                if(obj.msid==msid){
                                    $scope.data.splice(index,1);
                                    return;
                                }
                            })

                    }else{
                        Notice.message.text="删除失败";
                        Notice.message.num++;
                    }
                })
        }
    }])
    // 显示指定mid的消息详情
    .controller("showmsg",function($scope,$http,Notice,$routeParams){
        var mid=$routeParams.id;
        $scope.msg={};
        $http({url:"/msgshow",params:{mid:mid}})
            .then(function(e){
                if(e.data=="false"){
                    Notice.message.text="获取信息失败";
                    Notice.message.num++;
                }else{
                    $scope.msg=e.data[0];
                }
            });
    })
    .controller("msgReceive",function($scope,$http,Notice,Dragdel){
        $scope.read=[];
        $scope.unread=[];
        $http({url:"/msgReceive/read"})
            .then(function(e){
                if(e.data=="false"){
                    Notice.message.text="获取数据失败";
                    Notice.message.num++;
                }else{
                    $scope.read=e.data;
                }
            })

        $http({url:"/msgReceive/unread"})
            .then(function(e){
                if(e.data=="false"){
                    Notice.message.text="获取数据失败";
                    Notice.message.num++;
                }else{
                    $scope.unread=e.data;
                }
            })

        // 读取全部
        $scope.showall=function(){
            $http({url:"/msgReceive/read"})
                .then(function(e){
                    if(e.data=="false"){
                        Notice.message.text="获取数据失败";
                        Notice.message.num++;
                    }else{
                        $scope.read=e.data;
                    }
                })

            $http({url:"/msgReceive/unread"})
                .then(function(e){
                    if(e.data=="false"){
                        Notice.message.text="获取数据失败";
                        Notice.message.num++;
                    }else{
                        $scope.unread=e.data;
                    }
                })
        }
        // 已读
        $scope.showread=function(){
            $http({url:"/msgReceive/read"})
                .then(function(e){
                    if(e.data=="false"){
                        Notice.message.text="获取数据失败";
                        Notice.message.num++;
                    }else{
                        $scope.read=e.data;
                        $scope.unread=[];
                    }
                })
        }
        // 未读
        $scope.showunread=function(){
            $http({url:"/msgReceive/unread"})
                .then(function(e){
                    if(e.data=="false"){
                        Notice.message.text="获取数据失败";
                        Notice.message.num++;
                    }else{
                        $scope.read=[];
                        $scope.unread=e.data;
                    }
                })
        }

        Dragdel();

        $scope.del=function(mrid,type){
            $http({url:"/msgReceive/del",params:{mrid:mrid}})
                .then(function(e){
                    if(e.data="ok"){
                        Notice.message.text="删除成功";
                        Notice.message.num++;
                        if(type=='read'){
                            angular.forEach($scope.read,function(obj,index){
                                if(obj.mrid==mrid){
                                    $scope.read.splice(index,1);
                                    return;
                                }
                            })
                        }else if(type=='unread'){
                            angular.forEach($scope.unread,function(obj,index){
                                if(obj.mrid==mrid){
                                    $scope.unread.splice(index,1);
                                    return;
                                }
                            })
                        }

                    }else{
                        Notice.message.text="删除失败";
                        Notice.message.num++;
                    }
                })
        }

    })


    // 底部导航条
    .controller("index",["$scope",function($scope){

    $scope.active="one";
    $scope.change=function(name){
        $scope.active=name;
    }


}])
    .controller("todo",["$scope","$http","TodoInfo","Dragdel","Notice",function($scope,$http,TodoInfo,Dragdel,Notice){

    // 获取内容
    TodoInfo.then(function(data){
        TodoInfo.data=data.data;
        $scope.data=TodoInfo.data;
    })

    // 删除
    $scope.delTodo=function(id){
        $http({url:"/delTodo",params:{id:id}}).then(function(e){
            if(e.data=="ok"){
                Notice.message.text="删除成功";
                Notice.message.num++;
                angular.forEach(TodoInfo.data,function(obj,index){
                    if(obj.id==id){
                        TodoInfo.data.splice(index,1);
                    }
                })
            }else{
                Notice.message.text="删除失败";
                Notice.message.num++;
            }
        })
    }

        Dragdel();

}])
    // 添加内容
    .controller("todocon",["$scope","$http","TodoInfo",function($scope,$http,TodoInfo){
    $scope.data={};
    $scope.data.todo="";
    $scope.add=function(){
        $http({url:"/addTodo",params:{todo:$scope.data.todo}}).then(function(data){
            var obj={};
            obj.todo=$scope.data.todo;
            obj.id=data.data;
            TodoInfo.data.push(obj);
        })
    }
}])
    .controller("todoinfo",["$scope","$location","$http","TodoInfo","Notice",function($scope,$location,$http,TodoInfo,Notice){

        var url=$location.url();
        var id=parseInt(url.slice(url.lastIndexOf("/")+1));


        $scope.data="";
        angular.forEach(TodoInfo.data,function(obj,index){
            if(obj.id==id){
                $scope.data=obj.todo;
                $scope.index=index;
            }
        })

        $scope.edit=function(){
            $http({url:"/editTodo",params:{id:id,todo:$scope.data}}).then(function(data){
                if(data.data>0){
                    Notice.message.text="修改成功";
                    Notice.message.num++;
                    TodoInfo.data[$scope.index].todo=$scope.data;
                }
            })
        }



}])
    .controller("list",["$scope","$location","$http",function($scope,$location,$http){

    $http({url:"/getCon",params:{url:Object.keys($location.$$search)[0]},responseType:"text"}).then(function(e){

        $scope.data=e.data;
         // console.log($scope.data);
        document.querySelector(".con").innerHTML=($scope.data);
    })
}])

        /*
        * 设置
        * */
// 进入设置页
    .controller("config",function($scope,$http,Notice){
        $scope.user={};
        $http({url:"/userInfo"})
            .then(function(e){
                if(e.data=="false"){
                    Notice.message.text="查询失败";
                    Notice.message.num++;
                }else{
                    $scope.user=e.data[0];
                }
            })

    })
//用户个人信息
    .controller("userInfo",function($scope,$http,Notice){
        $scope.user={};
        $scope.uroot="";
        $http({url:"/userInfo"})
            .then(function(e){
                if(e.data=="false"){
                    Notice.message.text="查询失败";
                    Notice.message.num++;
                }else{
                    $scope.user=e.data[0];
                    angular.forEach($scope.role,function(obj,index){
                        if(obj.uroot==$scope.user.uroot){
                            $scope.uroot=obj.role;
                        }
                    })
                }
            })

        $scope.role=[
            {
                role:"后台管理员",
                uroot:0
            },{
                role:"普通员工",
                uroot:1
            },{
                role:"组长",
                uroot:3
            }
        ];

        $scope.edit=function(){
            console.log($scope.user);
            $scope.user.tel=parseInt($scope.user.tel);
            if(!$scope.user.uname){
                Notice.message.text="请输入用户名";
                Notice.message.num++;
            }else if($scope.user.upass.length>20&&$scope.user.upass.length!=32){
                Notice.message.text="密码过长";
                Notice.message.num++;
            }else if($scope.user.upass.length<6){
                Notice.message.text="密码长度不得小于6位";
                Notice.message.num++;
            }else if(!!$scope.user.tel&&(""+$scope.user.tel).length<6){
                Notice.message.text="号码长度不得小于6位";
                Notice.message.num++;
            }else{
                if((""+$scope.user.tel).length==3){
                    $scope.user.tel="";
                }
                $http({url:"/editUserInfo",params:{uname:$scope.user.uname,upass:$scope.user.upass,tel:$scope.user.tel}})
                    .then(function(e){
                        if(e.data=="ok"){
                            Notice.message.text="修改成功";
                            Notice.message.num++;
                        }else{
                            Notice.message.text="修改失败";
                            Notice.message.num++;
                        }
                    });
            }
        }

    })





