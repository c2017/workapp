var crypto=require("crypto");


// md5加密
function reuslt(str){
    var hash=crypto.createHash("md5");
    hash.update(str);
    return hash.digest('hex');
}
module.exports=reuslt;