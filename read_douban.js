/**
 * Created by lenovo on 2017/5/6.
 */
var nodegrass=require("nodegrass");
var async=require("async");
var cheerio=require("cheerio");

module.exports.readCategory=function(url,callback){
    var categoryArr=[];
    nodegrass.get(url,function(body,info,head){
        var $=cheerio.load(body);

        var category=$(".nav-items").contents().find("li");
        console.log(category.length);
        category.each(function(index,obj){
            var newObj={};
            newObj.catname=unescape($(obj).find("a").html().replace(/&#x/g,"%u").replace(/;/g,""));
            newObj.caturl=$(obj).find("a").get(0).attribs.href;
            newObj.catid=index+1;
            categoryArr.push(newObj);
        })
        // console.log(categoryArr);
        callback(categoryArr);
    },"utf-8");
}

module.exports.readList=function(url,callback){
    var listArr=[];
    nodegrass.get(url,function(body,info,head){
        var $=cheerio.load(body);
        // console.log(body);
        var lists=$(".review-item");

        lists.each(function(index,obj){
            var newObj={};
            newObj.img=$(obj).find(".subject-img").find("img").get(0).attribs.src;
            newObj.title=unescape($(obj).contents().find(".title-link").html().replace(/&#x/g,"%u").replace(/;/g,""));
            newObj.url=$(obj).contents().find(".title-link").get(0).attribs.href;
            newObj.info=unescape($(obj).contents().find(".short-content").html().replace(/&#x/g,"%u").replace(/;/g,""));
            listArr.push(newObj);
        })
        callback(listArr);
    })
};
