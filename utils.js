//在utils工具文件放的函数，可以方便不同的人有相同的需求时共同使用


// eleName:创建元素的名称
// classArr要添加类名的数组
//styleObj:要设置的样式,样式为键值对
function createEle(eleName,classArr,styleObj){
   var dom=document.createElement(eleName);
   for(var i=0;i<classArr.length;i++){
    dom.classList.add(classArr[i]);
   }
   for(var key in styleObj){
    // styleObj：['xxx':'yyy']
   // dom.style.key为style为Key的样式，key是个变量，用中括号
    dom.style[key]= styleObj[key];
   }
   return dom;
}

function setLocal(key,value){
    if(typeof value==='object'&&value!==null){
        // typeof返回的是个字符串
        value=JSON.stringify(value);
    }
    localStorage.setItem(key,value)

}
function getLocal(key){
    var value= localStorage.getItem(key);
    if(value===null){return value};
    if(value[0]==='['||value[0]==='{')
    {
        return  JSON.parse(value);
    }
     return value;

}
function formatNum(num){
    if(num<10){
        return '0'+num;
    }
    return num;
}