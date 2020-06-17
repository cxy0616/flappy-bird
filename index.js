//对象收编变量，变量和函数都以键值对的形式放在该对象中
//目的是为了减少全局变量的使用

//执行动画之前，拿到动画作用的dom元素
//动画 animate 去管理所有的动画函数，单一职责原则，一个函数管一件事情




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
    // init总函数的初始化函数
    init:function(){
        this.initData();
        this.animate();
        this.handle();
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

},
//点击函数
handle:function(){
    this.handleStart();
},
handleStart:function(){
    var self=this;
    this.oStart.onclick=function(){
        
        //点击开始游戏之后，开始游戏的按键消失，小鸟在也页面左侧，背景移动加快，得分显示
        self.oStart.style.display='none';
        self.oScore.style.display='block';
        self.skyStep=5;
        self.oBird.style.left='80px';
        //但此时字体喝小鸟上下蹦还在执行，所以加个锁
        self.startFlag=true;

    }
},
failGame:function(){
   clearInterval(this.timer);
   this.oMask.style.display='block';
   this.oEnd.style.display='block';
   //mask和end画面都得显示，小鸟和分数都得变没
   this.oBird.style.display='none';
   this.oScore.style.display='none';
},
};


