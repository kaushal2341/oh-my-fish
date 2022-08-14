//canvas setup
const canvas = document.getElementById('fishPop');
const ctx = canvas.getContext("2d");
canvas.width=800;
canvas.height=500;
let score =0;
let gameFrame=0;
let gameSpeed=1;
let gameOver=false;
ctx.font='50 px Georgia'
const mouse ={
    x:canvas.width/2,
    y:canvas.height/2,
    click:false
}
let canvasPosition = canvas.getBoundingClientRect();
//mouse interactive
canvas.addEventListener('mousedown',function(event){
mouse.click=true;
mouse.x=event.x-canvasPosition.left;
mouse.y=event.y-canvasPosition.top;
});

canvas.addEventListener('mouseup',function(event){
    mouse.click=false;
});

//Player
const playerLeft = new Image();
playerLeft.src = 'cartoon_fish_purple.png';
const playerRight=new Image();
playerRight.src='cartoon_fish_purple_right.png'
class Player{
    constructor(){
        this.x = canvas.width;
        this.y=canvas.height/2;
        this.radius=50;
        this.angle=20;
        this.frameX=0;
        this.frameY=0;
        this.frame=0;
        this.spriteWidth=498;
        this.spriteHeight=327;
        this.direction="left";
        this.prevDirection="left"
    }
    update(){
        const dx = this.x -mouse.x;
        const dy =this.y-mouse.y
        let theta = Math.atan2(dy,dx)
        this.angle=theta;
        if(mouse.x!=this.x){
            this.x -=dx/20;

        }
        if(mouse.y!=this.y){
            this.y -=dy/20;
        }
        if(gameFrame%5===0){
         if(this.direction!==this.prevDirection){
             this.frameX=0;
             this.frameY=0;
             this.frame=0;
             this.prevDirection=this.direction;
         }
            this.frame++;
            if(this.frame>=12) this.frame=0;
          //   if(this.frame ===3 || this.frame===7 ||this.frame===11||this.frame===15){
          //     this.frameX=0;
          //   }else{
          //     this.frameX++
          //   }
            this.frameX = this.frame===3||this.frame===7||this.frame===11?0:this.frameX+1;
            this.frameY = this.frame<3?0:this.frame<7?1:this.frame<11?2:0;
          }
    }
    draw(){
        if(mouse.click){
            // ctx.lineWidth=0.5;
            // ctx.beginPath();
            // ctx.moveTo(this.x,this.y);
            // ctx.lineTo(mouse.x,mouse.y);
            // ctx.stroke();

        }
        // ctx.fillStyle='red';
        // ctx.beginPath();
        // ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        //  ctx.fill();
        // ctx.closePath();        
        ctx.fillRect(this.x,this.y,this.radius,10)
        ctx.save();
        ctx.translate(this.x,this.y)
        ctx.rotate(this.angle)
        if(this.x>=mouse.x){
        ctx.drawImage(playerLeft,this.frameX* this.spriteWidth,this.frameY* this.spriteHeight,this.spriteWidth,this.spriteHeight,0-60,-45,this.spriteWidth/4,this.spriteHeight/4);
         this.direction='left'
        }
        else{
         this.direction='right';   
        ctx.drawImage(playerRight,this.frameX* this.spriteWidth,this.frameY* this.spriteHeight,this.spriteWidth,this.spriteHeight,0-60,0-45,this.spriteWidth/4,this.spriteHeight/4);
       }
       ctx.restore();
    }

}
const player= new Player();
//Bubbles
const bubblesArray=[];
const bubbleImage =new Image();
bubbleImage.src="bubble_pop_frame_01.png";
class Bubble{
    constructor(){
     this.x = Math.random()*canvas.width;
     this.y=canvas.height+Math.random()*canvas.height;
     this.radius=50;
     this.speed=Math.random()*5+1;
     this.distance;
     this.counted=false;
     this.sound=Math.random()<=0.5?'sound1':'sound2'
    }
    update(){
        this.y -=this.speed;
        const dx =this.x-player.x;
        const dy=this.y-player.y;
        this.distance = Math.sqrt(dx*dx+dy*dy)
  
    }
    draw(){
       // ctx.fillStyle='blue';
        // ctx.beginPath();
        // ctx.arc(this.x,this.y,this.radius, 0,Math.PI*2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(bubbleImage,this.x-65,this.y-65,this.radius*2.6,this.radius*2.6);
    }

}
const bubblePop1 = document.getElementById('audio1');
const bubblePop2 = document.getElementById('audio2');
bubblePop1.muted = "";
bubblePop2.muted="";

function handleBubbles(){
    if(gameFrame%50===0){
        bubblesArray.push(new Bubble())
    }
    for (let i =bubblesArray.length-1;i>=0;i--){
       
        bubblesArray[i].update();
        bubblesArray[i].draw();

        if(bubblesArray[i].y< 0 - bubblesArray[i].radius*2){
            bubblesArray.splice(i,1)
        }
        if(bubblesArray[i]){
        if(bubblesArray[i].distance<bubblesArray[i].radius+player.radius){
           
            if(!bubblesArray[i].counted){
                if(bubblesArray[i].sound==='sound1')
                //console.log("poper")
                 bubblePop1.play();
               else
                 bubblePop2.play();
                score++;
                bubblesArray[i].counted=true;
                bubblesArray.splice(i,1)
            }
          }
        }
       
    }
}
//Enemies
const enemiesBackground = new Image();
enemiesBackground.src = 'enemy-fish.png';
class Enemy {
    constructor(){
        this.x = canvas.width+200;
        this.y=Math.random()*(canvas.height-150)+90;
        this.radius=60;
        this.speed=Math.random()*2+2;
        this.frameX=0;
        this.frameY=0;
        this.frame=0;
        this.spriteWidth=418;
        this.spriteHeight=397;
    }
    update(){
    this.x-=this.speed;
    if(this.x<0-this.radius*2){
        this.x=canvas.width+200;
        this.y=Math.random()*(canvas.height-100)+90;
        this.speed=Math.random()*2+2
    }
    if(gameFrame%5===0){
      this.frame++;
      if(this.frame>=16) this.frame=0;
    //   if(this.frame ===3 || this.frame===7 ||this.frame===11||this.frame===15){
    //     this.frameX=0;
    //   }else{
    //     this.frameX++
    //   }
      this.frameX = this.frame===3||this.frame===7||this.frame===11||this.frame===15?0:this.frameX+1;
      this.frameY = this.frame<3?0:this.frame<7?1:this.frame<11?2:this.frame<15?3:0;
    }
   }
    draw(){
    //  ctx.fillStyle='red';
    //  ctx.beginPath();
    //  ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
    //  ctx.fill();
     ctx.drawImage(enemiesBackground,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.x-50,this.y-70,this.spriteWidth/3,this.spriteHeight/3)
    const dx = this.x-player.x;
    const dy = this.y -player.y;
    const distance= Math.sqrt(dx*dx+dy*dy);
    if(distance+18<this.radius+player.radius){
     handleGameOver();
    }
    }
}
function handleGameOver(){
    ctx.fillStyle='white';
    ctx.fillText('You Hit Enemy. Game Over!!.'+score,120,120);
    gameOver=true;
}
const enemy = new Enemy();
function handleEnemies(){
    enemy.update();
    enemy.draw();
}
//Repeating Background
const background = new Image();
background.src= 'background1.png';
const BG={
    x1:0,
    x2:canvas.width,
    y:0,
    width:canvas.width,
    height:canvas.height
}
function handleBackground(){
    BG.x1-=gameSpeed;
    if(BG.x1 < -BG.width) BG.x1=BG.width
    BG.x2-=gameSpeed;
    if(BG.x2 < -BG.width) BG.x2=BG.width

    ctx.drawImage(background,BG.x1,BG.y,BG.width,BG.height);
    ctx.drawImage(background,BG.x2,BG.y,BG.width,BG.height);
}
//Animation loop

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    handleBackground();
    handleBubbles();

    player.update();
    player.draw();
    handleEnemies();
    ctx.fillStyle='black';
    ctx.fillText('Score:'+score,10,50)
    gameFrame++;
    if(!gameOver) requestAnimationFrame(animate)
}
animate();
window.addEventListener("resize",()=>{
   canvasPosition =canvas.getBoundingClientRect(); 
})

