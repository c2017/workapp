/**
 * Created by lenovo on 2017/5/13.
 */
    // 显示删除按钮
var list=$(".mui-navigate-right");
var currentLeft=0;
touch.on(".mui-navigate-right","dragstart",function(e){

    currentLeft= parseInt($(this).css("left"))?parseInt($(this).css("left")):0;
})
touch.on(".mui-navigate-right","drag",function(e){

    if(e.direction=="left") {
        var left=currentLeft+e.x;

        if(left<-50){
            left=-50
        }
        // console.log(left);
        $(this).css("left",left);
    }else if(e.direction=="right"){
        var left=currentLeft+e.x;

        if(left>0){
            left=0
        }
        // console.log(left);
        $(this).css("left",left);
    }
})


var listbox=$(".mui-table-view");
touch.on(".mui-table-view","dragstart",function(e){
    console.log(e);
})