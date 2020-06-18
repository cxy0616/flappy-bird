//对象收编变量，变量和函数都以键值对的形式放在该对象中
//目的是为了减少全局变量的使用

//执行动画之前，拿到动画作用的dom元素
//动画 animate 去管理所有的动画函数，单一职责原则，一个函数管一件事情


//当游戏快结束时，将local中的数据取出来，将新的数据存进去，排序，将排序后的结果展现出来

var bird={
    //天空背景图片的初始位置为0
    skyPosition:0,
    // 天空移动的快慢
    skyStep:2,
    birdTop:220,
    startColor:'blue',
    startFlag:false,
    birdStepY:0,
    minTop:0,
    maxTop:570,
    pipLength:7,
    pipeArr:[],
    score:0,
    pipeLastIndex:6,
    // init总函数的初始化函数
    init:function(){
        this.initData();
        this.animate();
        this.handle();
        if(sessionStorage.getItem('play')){
            this.start();
        }
    },
    initData:function(){
        this.el=document.getElementById('game');
        // initdata和skymove是两个作用域，可以通过公共的this来使用数据
        this.oBird=this.el.getElementsByClassName('bird')[0];
        //this.oBird=document.getElementsByClassName('bird')[0];
        //为了避免和整个文档中其他的bird冲突，在父元素下去找bird,父元素内的所有元素都是我们自己写得，是知道第是bird几个元素得
        this.oStart=this.el.getElementsByClassName('start')[0];
        // dom元素命名默认前面加个o

        this.oScore=this.el.getElementsByClassName('score')[0];
        this.oMask=this.el.getElementsByClassName('mask')[0];
        this.oEnd=this.el.getElementsByClassName('end')[0];
        // 最终结果显示的score
        this.oFinalScore=this.oEnd.getElementsByClassName('final-score')[0];
        this.oRankList=this.oEnd.getElementsByClassName('rank-list')[0];
        this.oRestart=this.oEnd.getElementsByClassName('restart')[0];
        this.scoreArr=this.getScore();
    }, 
//读取local中的数据
getScore:function(){
      var scoreArr=getLocal('score');//当键值不存在时，得到的值为null
      return scoreArr?scoreArr:[];
    },

// 当游戏结束时存入数据
setScore:function()
{
 this.scoreArr.push({
     score:this.score,
     time:this.getData(),
 })
 this.scoreArr.sort(function(a,b){
     //a,b都是scoreArr中的数组的元素
     return b.score-a.score;
 })
 setLocal('score',this.scoreArr);
},
    //获取时间
getData:function(){
    var d=new Date();
    var year=d.getFullYear();
    var month=formatNum(d.getMonth()+1);
    var day=formatNum(d.getDay());
    var hour=formatNum(d.getHours());
    var minute=formatNum(d.getMinutes());
    var second=formatNum(d.getSeconds());
    return `${ year}.${month}.${day}.${hour}.${minute}.${second}`
},
animate:function(){
    var count=0;
    // bird.skyMove();
    // bird.birdJump();
    // bird.birdFly();
    // bird.startBound();
    var self=this;
   this.timer= setInterval(function(){
        self.skyMove();
        if(self.startFlag){
            self.birdDrop();
            // 游戏开始时管子移动
            self.pipeMove();
        }
        ++count;
        // 注意count的初始复制在外面，里面的每次定时器执行都会初始化一次
        if(count%10===0){//===严格等于，避免后面出错
            // 实现小鸟每300ms上下跳，再使用动画使动作更连贯
            if(!self.startFlag){
                //点击开始游戏之后，小鸟上下蹦和文字的显示效果就去掉了
                self.birdJump();
                //每300ms实现开始游戏文字的放大缩小，再使用动画使动作更连贯
                self.startBound();
            }
            
            self.birdFly(count);
        }
    },30);
    
    
   
    
},
// 天空背景图片移动
skyMove:function(){
    // var self=this;
    // 当定时器合并后，skyMove里面的This就是bird对象
    // setInterval回调函数中的this是window
    // setInterval(function(){
      this.skyPosition-= this.skyStep;
      //图片往左移，视觉上小鸟往右走
      //内层函数找不到self，就去外层找，找到了外层的self，指向的是this
      this.el.style.backgroundPositionX= this.skyPosition+'px';
    // }, 30);
    
},
// 小鸟上下蹦
birdJump:function(){
    // var self=this;
    // setInterval(function(){
        this.birdTop= this.birdTop===220 ? 260 : 220;
        // 使用过渡效果渐变
        this.oBird.style.top= this.birdTop+'px';
    //   }, 300);
},
birdFly:function(count){

    var count=count%3;
    //console.log(count);//120120
    // 三张小鸟，一个小鸟的宽度是30
    this.oBird.style.backgroundPositionX=-30*count+'px';
    //此时动画效果是由过渡的，这个时候就取消掉背景图片的过渡
},
birdDrop:function(){
//小鸟坠下
this.birdTop+= ++this.birdStepY;
this.oBird.style.top= this.birdTop+'px';
//碰撞检测
this.judgeKnock();
//碰撞检测过了就会执行加分，否则在碰撞检测中就是游戏失败
this.addScore();
},
pipeMove:function(){
    // 让所有的柱子一起移动，移动的频率和天空一样快

    //在创建柱子时保存一个数组对象，保存上主子和下主子dom,不用去找
    for(var i=0;i<this.pipLength;i++){
        var oUpPipe=this.pipeArr[i].up;
        var oDownPipe=this.pipeArr[i].down;
        var x=oUpPipe.offsetLeft-this.skyStep;//this.skyStep:5
        if(x<-52){
            var lastPipeLeft=this.pipeArr[this.pipeLastIndex].up.offsetLeft;
            //获取最后一个柱子的left
            oUpPipe.style.left=lastPipeLeft+300+'px';
            oDownPipe.style.left=lastPipeLeft+300+'px';
            this.pipeLastIndex=(++this.pipeLastIndex)%this.pipLength;
            //01234560:下一个柱子的0是上一次的最后一个索引+1，再对7%
           
            // oUpPipe.style.height=getPipeHeight().up+'px';
            // oDownPipe.style.height=getPipeHeight().down+'px';
            continue;

        }
        oUpPipe.style.left=x+'px';
        oDownPipe.style.left=x+'px';
    }
},
//避免每一组7个柱子的高度的重复
getPipeHeight:function(){
    var upHeight=Math.floor(Math.random()*175)+50;//50-225的整数
    var downHeight=600-150-upHeight;
    return{
        up: upHeight,
        down:downHeight,
    }
},
// 文字放大缩小--切换类名
startBound:function(){
    // var color;
    // color=this.startColor==='blue'?'white':'blue';
    // classList.remove('start'+this.startColor);
    // //把类名移除掉
    // classList.add('start'+this.color);
    // this.startColor=this.color;

    var prevColor=this.startColor;
    this.startColor=prevColor==='blue'?'white':'blue';
    this.oStart.classList.remove('start-'+prevColor);
    this.oStart.classList.add('start-'+this.startColor);

},
// 碰撞检测
judgeKnock:function(){
    this.judgeBoundary();
    this.judgePipe();
},
//边界碰撞检测
judgeBoundary:function(){
    if(this.birdTop<this.minTop||this.birdTop>this.maxTop){
        
        this.failGame();
    }
},
//柱子碰撞检测
judgePipe:function(){
    //当后面将第7个柱子用第0个柱子替代是，此时score=7,但是从数组中找不到score=7的元素
     var index=(this.score)%(this.pipLength);
     //拿的柱子的索引和得分是对应得
     var pipeX=this.pipeArr[index].up.offsetLeft;//从数组中拿到上、下柱子的left值
     var pipeY=this.pipeArr[index].y;//pipeArr[index].y存的是第index对柱子的高度和高度+150的值
     var birdY=this.birdTop;
     if((pipeX<=95&&pipeX>=13)&&(birdY<=pipeY[0]||birdY>=pipeY[1])){
         this.failGame();
     }

},
addScore:function(){
    var index=(this.score)%(this.pipLength);
     //拿的柱子的索引和得分是对应得
     var pipeX=this.pipeArr[index].up.offsetLeft;
     if(pipeX<13){
         //小鸟已经经历过一遍柱子了，加分
         this.oScore.innerText=++this.score;
     }
},
//点击函数
handle:function(){
    this.handleStart();
    this.handleClick();
    this.handleRestart();
},
handleStart:function(){
    var self=this;
    this.oStart.onclick=this.start.bind(this);
    //call和apply
},
start:function(){
    //console.log(this);因为点击函数中的this是ostart元素
    var self=this;
     //点击开始游戏之后，开始游戏的按键消失，小鸟在也页面左侧，背景移动加快，得分显示
    self.oStart.style.display='none';
    self.oScore.style.display='block';
    self.skyStep=5;
    self.oBird.style.left='80px';
    //但此时字体和小鸟上下蹦还在执行，所以加个锁
    
    self.startFlag=true;
    self.oBird.style.transition='none';
    //因为小鸟的每一次top值的改变都需呀300ms，而top值是一下子改变的，小鸟落地时由于动画效果还在空中
    
    for(var i=0;i<self.pipLength;i++){
         //游戏开始的时候创建柱子,一次创建一对,但此时所有的柱子叠在一起
           self.createPipe(300*(i+1)); 
    }
},
handleClick:function(){
   var self=this;
   // 只有当页面点击时，小鸟有一个向上的操作
   this.el.onclick=function(event){
       //因为点击开始游戏会冒泡给父元素el，游戏一开始小鸟会向上，这不是我们要的效果
       //判断点击的不是开始游戏时，点击el小鸟就会上升
       //如果用self.startFlag为(true)作为判断条件，上面的点击事件和下面的点击事件一起执行，会有一个向上的效果
    //    if(self.startFlag){
    //     self.birdStepY=-10;
    //    }
       if(!event.target.classList.contains('start')){
           self.birdStepY=-10;
       }
        
   }

},
//重新开始游戏
handleRestart:function(){
    this.oRestart.onclick=function(){
        sessionStorage.setItem('play',true);
        window.location.reload();
        
    }
},

createPipe:function(x){
    //生成上下柱子的高
    // Math.random()是0-1的小数
    //柱子的最小值是50
    var upHeight=Math.floor(Math.random()*175)+50;//50-225的整数
    var downHeight=600-150-upHeight;
    // var oDiv=document.createElement('div');
    // oDiv.classList.add('pipe');
    // oDiv.classList.add('pipe-up');
    // oDiv.style.height=upHeight+'px';
    // this.el.appendChild(oDiv);
    var oUpPipe=createEle('div',['pipe','pipe-up'],{
        'height':upHeight+'px',
        'left':x+'px'
    });
    var oDownPipe=createEle('div',['pipe','pipe-bottom'],{
        'height':downHeight+'px',
        'left':x+'px'
    });
    this.el.appendChild(oUpPipe);
    this.el.appendChild(oDownPipe);
    this.pipeArr.push({
        up:oUpPipe,
        down:oDownPipe,
        y:[upHeight,upHeight+150],
    })
},

failGame:function(){
   clearInterval(this.timer);
   this.setScore();
   this.oMask.style.display='block';
   this.oEnd.style.display='block';
   //mask和end画面都得显示，小鸟和分数都得变没
   this.oBird.style.display='none';
   this.oScore.style.display='none';
   this.oFinalScore.innerText=this.score;
   //把localstorage中的数据以列表的形式渲染出来
   this.renderRankList();
},
renderRankList:function(){
    var template='';
    console.log(this.scoreArr.length);
   for(var i=0;i<8;i++){
       //只显示前8名
       var degreeClass='';
       switch(i){
        case 0:
            degreeClass='first';
            break;
        case 1:
            degreeClass='second';
            break;
        case 2:
            degreeClass='third';
             break;

       }
     template +=`
     <li class="rank-item">
     <span class="rank-degree ${degreeClass}">${i+1}</span>
     <span class="rank-score">${this.scoreArr[i].score}</span>
     <span class="rank-time">${this.scoreArr[i].time}</span>
   </li>
     `
 }
 //console.log(template);
 this.oRankList.innerHTML=template;
},
};


