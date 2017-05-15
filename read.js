var nodegrass=require("nodegrass")
var async=require("async");
var cheerio=require("cheerio");

//读栏目的

module.exports.readCategory=function(url,callback){
    var categoryArr=[];
    nodegrass.get(url,function(body,info,head){
        var $=cheerio.load(body);

        var categorys=$("#smnav").find("li a");
        categorys.each(function(index,obj){
            var newobj={};
            var catname=unescape($(obj).html().replace(/&#x/g,"%u").replace(/;/g,""));
            if(catname=="专题"||catname=="图片站"||catname=="科技频道"){
                return;
            }
            newobj.catname=catname;
            newobj.caturl=obj.attribs.href;
            newobj.catid=index+1;
            categoryArr.push(newobj);
        })
        callback(categoryArr);
    },"gbk")
}

//读内容
module.exports.readList=function(url,callback){
    var listArr=[];
    nodegrass.get(url,function(body,info,head){

        var $=cheerio.load(body);
        var lists=$("#listZone .Q-tpList");

        lists.each(function(index,obj){
          var newobj={};
          var title=unescape($(obj).find("h3 a").html().replace(/&#x/g,"%u").replace(/;/g,""));
          newobj.title=title;
          newobj.url=$(obj).find("h3 a")[0].attribs.href;
          var info=unescape($(obj).find("p").html().replace(/&#x/g,"%u").replace(/;/g,""));
          newobj.info=info;
          newobj.img=$(obj).find(".pic img")[0].attribs.src;

          listArr.push(newobj);
        })
        callback(listArr);
    },"gbk")
}
