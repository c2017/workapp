/*
* 定义用户路由
* */
var express=require("express");
var path=require("path");
var nodegrass=require("nodegrass");
var async=require("async");
var mysql=require("../mysql");
var router=express.Router();

// 检查登录状态的中间件
function checkLogin(req,res,next){
    if(req.session.index!=undefined){
        if(req.session.index.login!="login"){
            res.redirect("/login");
            res.end();
        }else{
            next();
        }
    }else{
        res.redirect("/login");
        res.end();
    }
}

// 跳转到首页
router.get("/",checkLogin,function(req,res){
   res.render("index")
})

// 获取首页信息
router.get("/indexData",checkLogin,function(req,res){
    mysql.query("select * from shows where catid=6 limit 0,10",function(error,result){
        res.send(result);
    });
})

// 跳转到欢迎页面
router.get("/welcome",function(req,res){
    res.render("welcome")
})

router.get("/tpl/:name",checkLogin,function(req,res){
   res.sendFile(path.join(process.argv[1].slice(0,process.argv[1].lastIndexOf("\\")),"public/tpl/"+req.params.name))
})

router.get("/getCon",checkLogin,function(req,res){
    var url=req.query.url;
    // console.log(url);
    nodegrass.get(url,function(body){
        //console.log(body);
        res.send(body);
    },"utf-8");

})

/*tudolist start*/
router.get("/todoData",checkLogin,function(req,res){
    mysql.query("select * from todo",function(err,result){
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})
router.get("/addTodo",checkLogin,function(req,res){
    var todo=req.query.todo;
    mysql.query(`insert into todo (todo) values ('${todo}')`,function(err,result){
        if(err){
            console.log(err);
        }else{
            if(result.affectedRows>0){
                res.send(result.insertId.toString())
            }
        }
    })
})

router.get("/editTodo",checkLogin,function(req,res){
    var todo=req.query.todo;
    var id=req.query.id;
    mysql.query(`update todo set todo='${todo}' where id=${id}`,function(err,result){
        if(err){
            console.log(err);
        }else{
            res.send(result.affectedRows.toString());
        }
    })
})

router.get("/delTodo",checkLogin,function(req,res){
    mysql.query("delete from todo where id="+req.query.id,function(error,result){
        if(result.affectedRows>0){
            res.send("ok");
        }else{
            console.log(error);
            res.send("false");
        }
    });
})
/***todolist end***/

/*****消息 start******/

// 搜索可发送的用户
router.get("/msgWrite/user",checkLogin,function(req,res){
    var uid=req.session.index.uid;
    mysql.query(`select * from user where uid<>${uid}`,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
        }else{
            res.send(JSON.stringify(result));
        }
    })
})

// 发送消息
router.get("/msgWriteInfo",checkLogin,function(req,res){
    var uid=req.session.index.uid;
    var jieshouid=req.query.jieshouid;
    var title=req.query.title;
    var con=req.query.con;

    var msgsql=`insert into msgInfo (con,title) values ('${con}','${title}')`;
    mysql.query(msgsql,function(error,result){

        if(result.affectedRows>0){
            var mid=result.insertId;

            var sendsql=`insert into msgSend (uid,mid) values (${uid},${mid})`;
            mysql.query(sendsql,function(error,result){
                if(result.affectedRows>0){
                    var rsql=`insert into msgreceive (uid,mid) values (${jieshouid},${mid})`;

                    mysql.query(rsql,function(error,result){
                        if(result.affectedRows>0){
                            res.send('ok');
                        }else{
                            console.log('rsql',error);
                            res.send('false');
                        }
                    })

                }else{
                    console.log('sendsql',error);
                    res.send('false');
                }
            })
        }else{
            console.log('msgsql',error);
            res.send('false');
        }
    })

})

// 获取已发送的消息列表
router.get("/msgSendList",checkLogin,function(req,res){
    var uid=req.session.index.uid;
    var sql=`select * from msgInfo,msgSend,msgreceive,user where msgSend.uid=${uid} and msgSend.mid=msgInfo.mid and msgSend.mid=msgreceive.mid and user.uid=msgreceive.uid and msgSend.cancal=0`;
    mysql.query(sql,function(error,result){
        if(error){
            res.send("false");
        }else{
            // console.log(result);
            res.send(JSON.stringify(result));
        }
    })
})

// 根据mid获取消息 详情
router.get("/msgshow",checkLogin,function(req,res){
    var mid=req.query.mid;
    var sql=`select * from msgInfo,msgreceive,user where msgInfo.mid=${mid} and msgreceive.mid=${mid} and user.uid=msgreceive.uid and msgreceive.cancal=0`;
    mysql.query(sql,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
        }else{
            if(result[0].uname=req.session.index.uname){
                var mrid=result[0].mrid;
                var sql="update msgreceive set `read`=1 where mrid="+mrid;
                mysql.query(sql,function(error,result){
                    if(error){
                        console.log(error);
                    }else{
                        // console.log(result);
                    }
                })
            }
            res.send(JSON.stringify(result));
        }
    })

})

// 删除发送的消息
router.get("/msgSend/del",checkLogin,function(req,res){
    var msid=req.query.msid;
    var sql=`update msgSend set cancal=1 where msid=${msid}`;
    mysql.query(sql,function(error,result){
        if(result.affectedRows>0){
            res.send("ok");
        }else{
            console.log(error);
            res.send("false");
        }
    })
})

// 获取接收消息 已读列表
router.get("/msgReceive/read",checkLogin,function(req,res){

    var uid=req.session.index.uid;
    var sql=`select * from user,msgInfo,msgSend,msgreceive where msgreceive.uid=${uid} and user.uid=msgSend.uid and msgreceive.mid=msgInfo.mid and msgreceive.mid=msgSend.mid and msgreceive.read=1 and msgreceive.cancal=0`;
    mysql.query(sql,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
        }else{
            res.send(JSON.stringify(result));
        }
    })

})
// 获取接收消息 未读列表
router.get("/msgReceive/unread",checkLogin,function(req,res){

    var uid=req.session.index.uid;
    var sql=`select * from user,msgInfo,msgSend,msgreceive where msgreceive.uid=${uid} and user.uid=msgSend.uid and msgreceive.mid=msgInfo.mid and msgreceive.mid=msgSend.mid and msgreceive.read=0 and msgreceive.cancal=0`;
    mysql.query(sql,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
        }else{
            res.send(JSON.stringify(result));
        }
    })

})
// 删除接收消息
router.get("/msgReceive/del",checkLogin,function (req,res) {
    var mrid=req.query.mrid;
    var sql=`update msgreceive set cancal=1 where mrid=${mrid}`;
    mysql.query(sql,function(error,result){
        if(result.affectedRows>0){
            res.send("ok");
        }else{
            console.log(error);
            res.send("false");
        }
    })
})

/*****消息 end******/

/****用户信息 start*****/

// 获取用户信息
router.get("/userInfo",checkLogin,function(req,res){
    var uid=req.session.index.uid;
    var sql=`select * from user where uid=${uid}`;
    mysql.query(sql,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
        }else{
            res.send(JSON.stringify(result));
        }
    })
})

// 修改用户信息
router.get("/editUserInfo",checkLogin,function(req,res){
    var uid=req.session.index.uid;
    var uname=req.query.uname;
    var upass=req.query.upass;
    var tel=req.query.tel;
    if(upass.length!=32){
        upass=md5(upass);
    }
    var sql=`update user set uname='${uname}',upass='${upass}', tel='${tel}' where uid=${uid}`;
    mysql.query(sql,function(error,result){
        if(error){
            console.log(error);
            res.send("false");
        }else if(result.affectedRows>0){
            res.send("ok");
        }else{
            res.send("false");
        }
    })

})

// 退出登录
router.get("/unlogin",function(req,res){
    req.session.index=null;
    res.redirect("/");
})
/****用户信息 end*****/

module.exports=router;