"use strict";

let particles = [];
let rows, cols;
let angles_avoid = [],angles_field=[],angles_changed = [];
let obstacle;
let obstacles=[];
let obsSize = 30;

let pattern = 0;
let params = {
  // showField:false,
  fluctSpeed: 0.7,
  randomness:0.015,
  RESOLUTION: 10,
  obStacleSize: 20,
  particleColor: "#FFFFFF",
  obstacleColor:"#456789",
}

let gui = new dat.GUI();
// gui.add(params,'showField',false,true);
gui.add(params,'fluctSpeed',0.1,1).listen();
gui.add(params,'randomness',0.001,0.1).listen();
gui.add(params,'RESOLUTION',10,60,10).listen();
gui.add(params,'obStacleSize',1,60,1).listen();
gui.addColor(params, "particleColor");
gui.addColor(params, "obstacleColor");

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  background(0);

  rows = ceil(width / params.RESOLUTION);
  cols = ceil(height / params.RESOLUTION);

  // obstacles.push(new Obstacle(width/2,height/2,30 ));
  // obstacle = new Obstacle(width/2,height/2,30 );
  
    for(let i=0;i<2000;i++){
      let x=random(width),y=random(height);
        for(let j=0;j<obstacles.length;j++){
          while((x<=obstacles[j].pos.x+obstacles[j].rad*1.5)&&(x>=obstacles[j].pos.x-obstacles[j].rad*1.5)&&(y<=obstacles[j].pos.y+obstacles[j].rad*1.5)&&(y>=obstacles[j].pos.y-obstacles[j].rad*1.5)){
              x = random(width);
              y = random(height);
          }
        }
      particles.push(new particle(x, y));
    }
}


function draw() {
  background(0,10);

  // draw obstacles
  obsSize = params.obStacleSize;
  stroke(params.obstacleColor);
  strokeWeight(2);
  if (mouseIsPressed === true) {
    line(mouseX, mouseY, pmouseX, pmouseY);
    if (dist(mouseX, mouseY, pmouseX, pmouseY)<=obsSize){
      obstacles.push(new Obstacle(mouseX,mouseY,obsSize));
    }
  }

  strokeWeight(1);
  for(let i=0;i<obstacles.length;i++){
    obstacles[i].color = params.obstacleColor;
  }
  particles.splice(0,10);
  for(let i=0;i<10;i++){
    let x=random(width),y=random(height);
    for(let j=0;j<obstacles.length;j++){
      while((x<=obstacles[j].pos.x+obstacles[j].rad*1.5)&&(x>=obstacles[j].pos.x-obstacles[j].rad*1.5)&&(y<=obstacles[j].pos.y+obstacles[j].rad*1.5)&&(y>=obstacles[j].pos.y-obstacles[j].rad*1.5)){
          x = random(width);
          y = random(height);
      }
    }
    particles.push(new particle(x, y));
  }

// Flowfiled
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      let index = r + c * rows;
      let x = r * params.RESOLUTION;
      let y = c * params.RESOLUTION;

      // Pattern
      let freqX = (x+params.fluctSpeed*frameCount)*params.randomness;
      let freqY = (y+params.fluctSpeed*frameCount)*params.randomness;
      let value, angle;
      let noiseVal = noise(freqX,freqY);
      value = sin(freqY);
      angle = map(value, -1, 1, 0, PI/4);

      let vecGrid = createVector(x,y);

      angles_field[index] = angle;
      
      //<------showField------>
      if(params.showField){
        showField(x,y,angles_field[index],angles_avoid[index],angles_changed[index],index);
      }
    }
  }


// particles
  for (let i = 0; i < particles.length; i++) {
    let v = particles[i];
    let r = floor(v.pos.x / params.RESOLUTION);
    let c = floor(v.pos.y / params.RESOLUTION);
    let angleIndex = r + c * rows;

    noStroke();
    fill(255);
    v.flow(angles_field[angleIndex]);

    // particle
    v.color = params.particleColor;
    for(let i=0;i<obstacles.length;i++){
      v.avoidObstacle(obstacles[i]);
    }
    v.update();
    v.reappear();
    v.display();
  }

  for(let i=0;i<obstacles.length;i++){
    obstacles[i].display();
  }
}

// Draw field
function showField(x,y,angleA,angleF,angleC,index){
  push();
  translate(x,y);
  noFill();
  stroke(200,10);
  rect(0, 0, params.RESOLUTION, params.RESOLUTION);
  pop();
  // FlowField with/out mouse
  push();
  translate(x,y);
  stroke(255,0,0,20);
  translate(params.RESOLUTION/2,params.RESOLUTION/2);
  rotate(angleA);
  line(0, 0, params.RESOLUTION/2, 0);
  pop();
}
