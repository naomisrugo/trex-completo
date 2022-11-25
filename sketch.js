var trex, trex_running, edges;
var groundImage;
var trex_quieto;
var ground;
var lasnubes;
var nube;
var todoslosobstaculos;
var todaslasnubes;
var gamestate= "play";
var puntuacion=0;
var vidas=3;

// esta funcion es para precargar las imagenes o las animaciones
function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_quieto=loadAnimation("trex1.png");
  groundImage = loadImage("ground2.png");
  lasnubes = loadImage("cloud.png");
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  imggameover= loadImage("gameOver.png");
  imgrestart= loadImage("restart.png");
  brinco=loadSound("jump.mp3");
  cadacien=loadSound("checkpoint.mp3");
  perder=loadSound("die.mp3");
}

//setup para configurar los sprites
function setup(){
  //para que se acople a la pantalla
  createCanvas(windowWidth,windowHeight);
  todoslosobstaculos=createGroup();
  todaslasnubes=createGroup();

  //crear sprite de Trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("quieto", trex_quieto);
  edges = createEdgeSprites();

  gameover=createSprite(300,80,150,50);
  reset=createSprite(300,130,30,30);

  //creamos un piso invisible para que el personaje pueda 
  // pisar al medio del piso y parezca mas real
  pisoinvisible= createSprite(width/2,height-10,width,25);
  pisoinvisible.visible= false;

  //crear sprite del piso
  ground=createSprite(200,180,400,20);
  ground.addImage("imagen", groundImage);

  //agregar la imagen de game over y restar
  gameover.addImage("perdiste",imggameover);
  reset.addImage("empezardenuevo",imgrestart);

  gameover.visible = false;
  reset.visible= false;

  reset.scale=0.5;
  
  //agregar tamaño y posición al Trex
  trex.scale = 0.5;
  trex.x = 50;
  trex.y= 50;

  //para que el trex salte solo
 // trex.setCollider("rectangle", 0,0,trex.width+300, trex.height);
  //debug es para que se vea porque el setcollider hace que no se vea
 //trex.debug= false;

}


function draw(){
  //establecer color de fondo.
  background("white");
  textSize(13);

  //para poner el color siempre tiene que estar arriba y pegado al texto
  fill("grey");
  text("tu puntuacion: "+puntuacion, 480,25);

  fill("grey");
  text("vidas: " + vidas, 480,40);
  
  //darle velocidad al piso
  if(gamestate=="play"){
    puntuacion += Math.round(getFrameRate()/60);
    ground.velocityX= -(6+3* puntuacion/100); 
    if(puntuacion%100==0){
      cadacien.play();
    }
   
     //hacer que el Trex salte al presionar la barra espaciadora
  if(keyDown("space")|| touches.lenght>0 && trex.y>=150){
    trex.velocityY = -10;
    brinco.play();
    touches=[];
  }

   //para que el piso llegue al 0 y empiece otra vez y se mueva siempre
   if(ground.x<0){
    ground.x=ground.width/2;
  }
  nubes();
  obstaculos();
  
  //fuerza de gravedad
  trex.velocityY = trex.velocityY + 0.5;

  if(trex.isTouching(todoslosobstaculos)){
    gamestate="end";
    perder.play();
    //trex.velocityY=-10;
    //brinco.play();
    }

  if(vidas==0){
    text("perdiste!!" , 300, 250);
    gamestate="end";
    reset.visible= false;
   }

  }



else if(gamestate=="end"){
   //se usa setvelocityEach cuando es grupo para que la veocidad pare
   todaslasnubes.setVelocityXEach(0);
   todoslosobstaculos.setVelocityXEach(0);
   //se uan velocityx porque no es un grupo 
   ground.velocityX= 0;
   //cuando es un grupo empieza con set y acaba con Each - para que no desaparezcan los objetos ni las nubes cuando perdimos
   todoslosobstaculos.setLifetimeEach(-1);
   todaslasnubes.setLifetimeEach(-1);
   trex.changeAnimation("quieto",trex_quieto);

   gameover.visible = true;
   reset.visible= true;

   if(vidas==0){
    reset.visible=false;
   }

   if(mousePressedOver(reset)){
    restablecer();
   }
   
   
  }

  //evitar que el Trex caiga
  trex.collide(pisoinvisible);
  drawSprites();
}

//framecount es para contar los cuadros que etsamos pasando
function nubes(){
  if(frameCount%30==0){ //va a contar 60 y el modeulo va a regresar a 60
    nube=createSprite(600,100,40,15);
    nube.addImage("cloud", lasnubes);
    nube.velocityX = -(6+3* puntuacion/100);
    nube.scale=0.5;
    nube.y=Math.round(random(10,60));
    nube.lifetime=130;
    nube.depth=trex.depth;
    trex.depth+=1;
    todaslasnubes.add(nube);
  }
}

function obstaculos(){
  if(frameCount%85==0){
  var losobstaculos=createSprite(600,167,15,40);
  losobstaculos.velocityX= -(6+3* puntuacion/100);
  var a=Math.round(random(1,6));
  switch(a){
    case 1: losobstaculos.addImage("obstaculo1", obstaculo1);
    break;
    case 2: losobstaculos.addImage("obstaculo2", obstaculo2);
    break;
    case 3: losobstaculos.addImage("obstaculo3", obstaculo3);
    break;
    case 4: losobstaculos.addImage("obstaculo4", obstaculo4);
    break;
    case 5: losobstaculos.addImage("obstaculo5", obstaculo5);
    break;
    case 6: losobstaculos.addImage("obstaculo6", obstaculo6);
    break;
  }
  losobstaculos.scale=0.5;
  losobstaculos.lifetime=130;
  todoslosobstaculos.add(losobstaculos);
 }
}

function restablecer(){
puntuacion=0;
gamestate= "play";
gameover.visible = false;
reset.visible= false;
//para destruir todos los obstaculos
todoslosobstaculos.destroyEach();
todaslasnubes.destroyEach();
trex.changeAnimation("running", trex_running);
//vidas=3;
if(vidas>0){
  vidas= vidas-1;
 }
}

