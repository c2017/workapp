function fontSize(originw,type){
    var type=type||"x";
    let bili;

    if(type=="x"){
        let cw=document.documentElement.clientWidth;
        bili=parseInt(cw/originw*100)+"px";
    }else if(type=="y"){
        let ch=document.documentElement.clientHeight;
        bili=parseInt(ch/originw*100)+"px";
    }

    document.querySelector(":root").style.fontSize=bili;
}
fontSize();