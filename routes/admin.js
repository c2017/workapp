/*
* 定义后台路由
* */
var express=require("express");
var router=express.Router();
var mysql=require("../mysql");
var md5=require("../md5");
var client=require("../client");

// 检测用户名和密码
router.get("/checkLogin",function(req,res,next){

    if(!(req.query.uname&&req.query.upass)){
        res.redirect("/admin/");
    }else{
        var uname=req.query.uname;
        var upass=md5(req.query.upass);
        // console.log("uname:",uname);
        // console.log("upass:",upass);
        mysql.query(`select * from user where uname='${uname}'`,function(error,result){
            if(error){
                console.log("error:",error);
                res.end();
            }else if(result.length>0){
                var row=result[0];
                if(row.uname==uname){
                    // console.log("name ok");
                    if(row.upass==upass){
                        // console.log("upass ok");
                        if(row.uroot==0){
                            // console.log("uroot ok");
                            req.session.admin={
                                login:"login",
                                admin:"uname"
                            };
                            res.redirect("/admin/");
                        }else{
                            // console.log("uroot: none : ",row.uroot);
                            res.end("登录失败");
                        }
                    }else{
                        res.redirect("/admin/");
                    }
                }else{
                    res.render("/admin/login");
                    res.end();
                }
            }else{
                res.render("/admin/login");
                res.end();
            }
        })
    }

})

// 检测登录状态 作为中间件
var checkLogin=function(req,res,next){
    if(req.session.admin){
        if(req.session.admin.login!="login"){
            res.render("admin/login");
            res.end();
        }else{
            next();
        }
    }else{
        res.render("admin/login");
        res.end();
    }

}

// 进入首页
router.get("/",checkLogin,function(req,res){
    res.setHeader("content-type","text/html;charset=utf-8");
    res.render("admin/admin",{user:req.session.admin.uname});
})

/******用户管理 start*******/
// 搜索所有用户
router.get("/showUser",checkLogin,function(req,res){
    var sql="select * from user";
    mysql.query(sql,function(error,result){
        if(error){
            console.log(error);
            res.send("no");
        }else{
            res.send(JSON.stringify(result));
        }
    })
})

// 进入添加用户页
router.get("/addUser",checkLogin,function(req,res){
    res.render("admin/addUser");
})

// 添加用户信息
router.get("/addUserInfo",checkLogin,function(req,res){
    var uname=req.query.uname;


    mysql.query(`select * from user where uname='${uname}'`,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
            res.end();
        }else if(result.length>0){
            res.send("existed");
            res.end();
        }else{
            var uroot=req.query.uroot;
            var upass=md5(req.query.upass);
            var tel=req.query.tel;
            var sql=`insert into user (uname,upass,uroot,tel) values ('${uname}','${upass}',${uroot},'${tel}')`;
            mysql.query(sql,function(error,result){
                if(error){
                    console.log(error);
                    res.send("false");
                }else if(result.affectedRows>0){
                    res.send("添加成功");
                }else{
                    res.send("false")
                }
            })
        }
    })

})

// 查看待改用户信息
router.get("/editUser",checkLogin,function(req,res){
    var uid=req.query.uid;
    mysql.query(`select * from user where uid=${uid}`,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
        }else{
            res.send(JSON.stringify(result));
        }
    })
})

// 编辑用户信息
router.get("/editUserInfo",checkLogin,function(req,res){
    var uname=req.query.uname;
    var uid=req.query.uid;
    var tel=req.query.tel;
    var uroot=req.query.uroot;

    console.log(`select * from user where uid<>${uid} and uname='${uname}'`);
    mysql.query(`select * from user where uid<>${uid} and uname='${uname}'`,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
        }else{
            if(result.length>0){
                res.send("existed_uname");
            }else{
                mysql.query(`update user set uname='${uname}',tel='${tel}',uroot=${uroot} where uid=${uid}`,function(error,result){
                    console.log("result:",result);
                    if(error){
                        console.log(error);
                        res.send("false");
                    }else if(result.affectedRows>0){
                        res.send("ok");
                    }else{
                        res.send("false");
                    }
                })
            }

        }
    })

})
// 删除用户
router.get("/delUser",checkLogin,function(req,res){
    var uid=req.query.uid;
    var sql=`delete from user where uid=${uid}`;
    mysql.query(sql,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
        }else if(result.affectedRows>0){
            res.send("ok");
        }else{
            res.send('false');
        }
    })

})
/******用户管理 end*******/

/*****内容管理 start*****/
// 进入列表页
router.get("/list",checkLogin,function(req,res){
    res.setHeader("content-type","text/html;charset=utf-8");
    res.end("后台首页列表")
})

// 通过ajax获取到数据 返回给后台
router.get("/showCon/",checkLogin,function(req,res){
    var page=req.query.page||0;
    var num=10;
    var sql=`select * from shows,category where shows.catid=category.catid limit ${page*num},${num}`;

    page=parseInt(page);
    var lastPage=page-1<0?0:page-1;
    var nextPage=page+1;

    mysql.query("select * from shows,category where shows.catid=category.catid",function(error,result){

        if(error){
            console.log(error);
        }else{
            let all=Math.ceil(result.length/num);
            if(nextPage>=all){
                nextPage=all-1;
            }

            mysql.query(sql,function(error,result){
                if(error){
                    console.log(error);
                }else{
                    result[0].nextPage=nextPage;
                    result[0].lastPage=lastPage;
                    res.send(JSON.stringify(result));
                }
            })
        }


    })



})

// 删除文章
router.get("/delCon",checkLogin,function(req,res){
    var sid=req.query.sid;
    var sql=`delete from shows where sid=${sid}`;
    mysql.query(sql,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
        }else if(result.affectedRows>0){
            res.send("ok");
        }else{
            res.send('false');
        }
    })
});

// 更新文章数据
router.get("/updateCon",checkLogin,function(req,res){
    client(function(result){
        if(result=="done");
        res.send("ok");
    });

})
/*****内容管理 end*****/


module.exports=router;