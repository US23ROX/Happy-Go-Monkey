var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey , monkey_running;
var banana ,bananaImage, obstacle, obstacleImage;
var foodGroup, obstaclesGroup;
var invisibleGround; 

var score;

function preload() {
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
 }


function setup() {
  createCanvas(400,400);
  
  monkey = createSprite(75,300,20,20);
  monkey.addAnimation("running", monkey_running);
  monkey.scale = 0.15;
  
  invisibleGround = createSprite(400,350,800,20);
  invisibleGround.visible = true;
  invisibleGround.x = invisibleGround.width/2;  
  
  foodGroup = createGroup();
  obstaclesGroup = createGroup();
  
  monkey.setCollider("circle", 0,0,260);
  monkey.debug = false;
  
  score = 0;
}


function draw() {
  background("white");
  
  stroke("black");
  textSize(20);
  fill("red");
  text("Score: "+score, 300, 25);
  
  
  if(gameState === PLAY){
    invisibleGround.velocityX = -(4 + 3*score/100);
    
    score = score+Math.round(getFrameRate()/60);
    
    if(invisibleGround.x < 0){
      invisibleGround.x = invisibleGround.width/2;
    }
    
    if(keyDown("space") && monkey.y >= 250){
      monkey.velocityY = -12;
    }
    
    monkey.velocityY = monkey.velocityY + 0.8;
    
    spawnFood();
    
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(monkey)){
      gameState = END;
    }
  }
  else if(gameState === END){
    invisibleGround.velocityX = 0;
    monkey.velocityY = 0;
    
    if(mousePressedOver(monkey)){
      reset();
    }
    
    obstaclesGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);
    
    obstaclesGroup.setVelocityXEach(0);
    foodGroup.setVelocityXEach(0); 
  }
  
  monkey.collide(invisibleGround);
    
  drawSprites();
}

function spawnFood(){
  if(frameCount%80===0){
    banana = createSprite(400,Math.round(random(120,200)),20,20);
    banana.addImage("food", bananaImage);
    banana.velocityX = -(6 + score/100);
    banana.lifetime = 300;
    banana.scale = 0.15;
    foodGroup.add(banana);
    
  } 
}


function spawnObstacles(){
  if(frameCount%300===0){
    obstacle = createSprite(400,310,20,20);
    obstacle.addImage("rock", obstacleImage);
    obstacle.velocityX = -(6 + score/100);
    obstacle.scale = 0.15;
    obstacle.lifetime = 300;
    obstacle.setCollider("circle", 0,0,200);
    obstacle.collide(invisibleGround);
    obstacle.debug = false;
    obstaclesGroup.add(obstacle);
    
  }
}

function reset(){
  gameState = PLAY;
  
  foodGroup.destroyEach();
  obstaclesGroup.destroyEach();
  
  score = 0;
}