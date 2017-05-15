/*
 * 定义用户路由
 * */
var express=require("express");
var mysql=require("../mysql");
var router=express.Router();
var md5=require("../md5");


router.get("/",function(req,res,next){

    // console.log("req.url:",req.url);
    if(req.session.index!=undefined){
        if(req.session.index.login=="login"){
            res.redirect("/");
            res.end();
        }else{
            req.session.posx=100+parseInt(Math.random()*150);
            // console.log(req.session.posx);
            res.render("login",{posx:req.session.posx});
        }
    }else{
        req.session.posx=100+parseInt(Math.random()*150);
        // console.log(req.session.posx);
        res.render("login",{posx:req.session.posx});
    }

    // req.session.posx=100+parseInt(Math.random()*150);
    // console.log(req.session.posx);
    // res.render("login",{posx:req.session.posx});
})

router.get("/checkLogin",function(req,res,next){
    if(req.query.posx!="ok"){
        console.log("验证码有误");
        res.redirect("/");
        res.end();
        return;
    }
    var uname=req.query.uname;
    var upass=md5(req.query.upass);
/*    console.log("uname:",uname);
    console.log("upass:",upass);*/
    mysql.query(`select * from user where uname='${uname}'`,function(error,result){
        if(error){
            console.log("error:",error);
            res.end();
        }else if(result.length>0){
            var row=result[0];
            if(row.uname==uname){
                console.log("name ok");
                if(row.upass==upass){
                    console.log("upass ok");
                    var obj={uname:uname,login:"login",uid:row.uid};
                    req.session.index=obj;
                    res.redirect("/");
                    res.end();
                }else{
                    res.redirect("/login");
                    res.end();
                }
            }else{
                res.redirect("/login");
                res.end();
            }
        }else{
            res.redirect("/login");
            res.end();
        }
    })

})

module.exports=router;