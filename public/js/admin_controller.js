/**
 * Created by lenovo on 2017/5/11.
 */


angular.module("adminControllers",[])

    // 提示信息
    .controller("notice",["$scope","Notice","$timeout",function($scope,Notice,$timeout){
        $scope.notice=Notice;

        $scope.hiddenFun=function(){
            Notice.show=false;
        }

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
    * 用户
    * */

    // 添加用户
    .controller("addUser",["$scope","$http","Notice",function($scope,$http,notice){


        $scope.uname="";
        $scope.upass="";
        $scope.uroot="";
        $scope.tel="";

        $scope.role=[
            {
                role:"后台管理员",
                fun:function(){
                    $scope.uroot=0;
                }
            },{
                role:"普通员工",
                fun:function(){
                    $scope.uroot=1;
                }
            },{
                role:"组长",
                fun:function(){
                    $scope.uroot=3;
                }
            }
        ];

    //  添加用户
        $scope.addUserInfo=function(){

            if($scope.uname&&$scope.upass&&typeof($scope.uroot)=='number'){
                $http({url:"/admin/addUserInfo",params:{uname:$scope.uname,upass:$scope.upass,uroot:$scope.uroot,tel:$scope.tel}}).then(function(e){
                    if(e.data=="false"){
                        notice.message.text="添加失败";
                        notice.message.num++;
                    }else if(e.data=='existed'){
                        notice.message.text="用户已存在";
                        notice.message.num++;
                    }else{
                        notice.message.text="添加成功";
                        notice.message.num++;
                        $scope.uname="";
                        $scope.upass="";
                        $scope.uroot="";
                        $scope.tel="";
                    }
                })
            }else{
                if(!$scope.uname){
                    notice.message.text="请输入用户名";
                    notice.message.num++;
                }else if(!$scope.upass){
                    notice.message.text="请输入密码";
                    notice.message.num++;
                }else if(typeof($scope.uroot)!='number'){
                    notice.message.text="请选择角色";
                    notice.message.num++;
                }else{
                    notice.message.text="未知错误";
                    notice.message.num++;
                }
            }

            console.log("addUserInfo:",notice.message.text);

        }
    }])

    // 查看用户
    .controller("showUser",["$scope","$http","Notice",function($scope,$http,Notice){
        $scope.data=[];
        $http({url:"/admin/showUser"})
            .then(function(e){
                $scope.data=e.data;
                console.log(typeof $scope.data[0].uroot);
            })

        // 删除用户
        $scope.del=function(uid){
            $http({url:"/admin/delUser",params:{uid:uid}})
                .then(function(e){
                    if(e.data=="false"){
                        Notice.message.text="删除失败";
                        Notice.message.num++;
                    }else{
                        Notice.message.text="删除成功";
                        Notice.message.num++;
                        $scope.data.forEach(function(obj,index){
                            if(obj.uid==uid){
                                $scope.data.splice(index,1);
                            }
                        })
                    }
                })
        }
    }])

    // 编辑用户
    .controller("editUser",["$scope","$http","Notice","$routeParams",function($scope,$http,Notice,$routeParams){

        var uid=$routeParams.id;

        $scope.data={
            uname:"",
            tel:"",
            uroot:""
        }

        $scope.role=[
            {
                role:"后台管理员",
                fun:function(){
                    $scope.data.uroot=0;
                }
            },{
                role:"普通员工",
                fun:function(){
                    $scope.data.uroot=1;
                }
            },{
                role:"组长",
                fun:function(){
                    $scope.data.uroot=3;
                }
            }
        ];

        // 查看待改用户信息
        $http({url:"/admin/editUser",params:{uid:uid}})
            .then(function(e){
                if(e.data=="false"){
                    Notice.message.text="获取数据失败";
                    Notice.message.num++;
                }else{
                    $scope.data=e.data[0];
                }
            })

        $scope.edit=function(){

            $scope.tel=parseInt($scope.tel);
            if(!$scope.data.uname){
                Notice.message.text="请输入用户名";
                Notice.message.num++;
            }else if(!$scope.data.tel){
                Notice.message.text="请输入号码";
                Notice.message.num++;
            }else if((""+$scope.data.tel).length<6){
                Notice.message.text="号码长度不得小于6位";
                Notice.message.num++;
            }else if(!$scope.data.uroot){
                Notice.message.text="请选择角色";
                Notice.message.num++;
            }else{
                $http({url:"/admin/editUserInfo",params:{uid:uid,uname:$scope.data.uname,tel:$scope.data.tel,uroot:$scope.data.uroot}})
                    .then(function(e){
                        if(e.data=="ok"){
                            Notice.message.text="修改成功";
                            Notice.message.num++;
                        }else if(e.data=="existed_uname"){
                            Notice.message.text="帐号重复";
                            Notice.message.num++;
                        }else{
                            Notice.message.text="修改失败";
                            Notice.message.num++;
                        }
                    })
            }


        }
    }])
    /*
    * 内容
    * */
    // 显示内容
    .controller("showCon",["$scope","$http","Notice","$routeParams",
        function($scope,$http,Notice,$routeParams){

        $scope.page=$routeParams.id;
        $scope.data=[];
        $scope.nextPage=0;
        $scope.lastPage=0;

        $http({url:"/admin/showCon",params:{page:$scope.page}}).then(function(e){
            $scope.data=e.data;
            $scope.nextPage=e.data[0].nextPage;
            $scope.lastPage=e.data[0].lastPage;
        })



        $scope.del=function(sid){
            $http({url:"/admin/delCon",params:{sid:sid}})
                .then(function(e){
                    if(e.data=="ok"){
                        Notice.message.text="删除成功";
                        Notice.message.num++;
                        $scope.data.forEach(function(obj,index){
                            if(obj.sid==sid){
                                $scope.data.splice(index,1);
                            }
                        })
                    }else{
                        Notice.message.text="删除失败";
                        Notice.message.num++;
                    }
                })
        }

    }])
    // 更新内容
    .controller("updateCon",["$scope","$http","Notice",function($scope,$http,Notice){

        $scope.data="";
        var flag=true;

        $scope.update=function(){

            Notice.message.text="更新中";
            Notice.message.num++;
            if(flag){
                flag=false;
                $http({url:"/admin/updateCon"}).then(function(e){
                    if(e.data=="ok"){
                        Notice.message.text="更新完成";
                        Notice.message.num++;
                        flag=true;
                    }
                })
            }

        }

    }])









