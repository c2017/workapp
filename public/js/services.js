angular.module("service",[])
    // 便签
    .factory("TodoInfo",function($http,$q){
        return $http({url:"/todoData"});
    })
    // 提示信息
    .factory("Notice",function(){
        return {show:false,message:{text:"提示信息",num:1}}
    })
    .factory("Dragdel",function(){
        return function(){
            var listbox=$(".mui-table-view");
            var currentLeft=0;

            touch.on(".mui-table-view","dragstart",function(e){
                // console.log(e);
                // console.log($(e.target));
                var target=$(e.target);
                if(e.target.className.indexOf("ui-navigate-right")){
                    currentLeft= parseInt(target.css("left"))?parseInt(target.css("left")):0;
                }
            })
            touch.on(".mui-table-view","drag",function(e){
                var target=$(e.target);
                if(e.direction=="left") {
                    var left=currentLeft+e.x;

                    if(left<-50){
                        left=-50
                    }
                    // console.log(left);
                    target.css("left",left);
                }else if(e.direction=="right"){
                    var left=currentLeft+e.x;

                    if(left>0){
                        left=0
                    }
                    // console.log(left);
                    target.css("left",left);
                }
            })
        }
    })
  /*  // 获取所有的信息
    .factory("Msg",function($http,$q){
        return $http({url:"/showmsg"});
    })*/

