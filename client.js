var nodegrass=require("nodegrass");
var mysql=require("./mysql.js");
var async=require("async");
var cheerio=require("cheerio");
var read=require("./read_douban");

//写入到数据库里面   首先先获取到分类   ->李彪
module.exports=function(callback){
    async.waterfall([
        //获取分类
        function(callback) {
            read.readCategory("https://movie.douban.com/review/best/",function(data){

                async.each(data,function(item,cb){
                    mysql.query(`insert into category (catname,catid,caturl) values ('${item.catname}',${item.catid},'${item.caturl}')`,function(){
                        cb(null);
                    })
                });
                callback(null,data)
            })
        },
        function(data,callback) {
            async.eachSeries(data,function(item,cb){

                read.readList(item.caturl,function(data1){
                    async.each(data1,function(item1,cb1){
                        item1.catid=item.catid;
                        mysql.query(`insert into shows (title,info,url,img,catid) values ('${item1.title}','${item1.info}','${item1.url}','${item1.img}',${item1.catid})`,function(){
                            cb1(null);
                        })
                    });

                    cb(null,"done");
                })

            });
            callback(null,"done");
        }
    ], function (err, result) {
        console.log(result);
        callback(result);
    });
}

