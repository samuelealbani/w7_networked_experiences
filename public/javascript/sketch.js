

// Create connection to Node.JS Server
const socket = io();

let canvas;
let roll = 0;
let pitch = 0;
let yaw = 0;

let speedRoll = 0;
let speedPitch = 0;
let speedYaw = 0;

let editR = false;
let editG = false;
let editB = false;

let r, g, b;

let newChanVal = 0;

let pos;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
 
  createEasyCam();
  pos= createVector(0, 0);
}

function draw() {
  background(200);

  roll += speedRoll;
  pitch += speedPitch;
  yaw += speedYaw;

  noStroke();
  lights();
  ambientMaterial(r, g, b);

  translate(pos);
  rotateZ(pitch);
  rotateX(roll);
  rotateY(yaw);
  box(100);

}

//process the incoming OSC message and use them for our sketch
function unpackOSC(message){

  /*-------------

  This sketch is set up to work with the gryosc app on the apple store.
  Use either the gyro OR the rrate to see the two different behaviors
  TASK: 
  Change the gyro address to whatever OSC app you are using to send data via OSC
  ---------------*/

  //maps phone rotation directly 
  // if(message.address == "/gyrosc/gyro"){
  //   roll = message.args[0]; 
  //   pitch = message.args[1];
  //   yaw = message.args[2];
  // }

  //uses the rotation rate to keep rotating in a certain direction
  if(message.address == "/oscControl/slider1"){
    speedRoll = map(message.args[0],0,1,0,0.5);
  }
  if(message.address == "/oscControl/slider2"){
    speedPitch = map(message.args[0],0,1,0,0.5);
  }
  if(message.address == "/oscControl/slider3"){
    speedYaw = map(message.args[0],0,1,0,0.5);
  }

  if(message.address == "/oscControl/slider4"){
    newChanVal = int(map(message.args[0],0,1,0,255));

    //edit color channel according toggles' status
    if(editR){
      r = newChanVal;
    } 
    if(editG){
      g = newChanVal;
    }
    if(editB){
      b = newChanVal;
    }
  }

  if(message.address == "/oscControl/slider2Dx"){
    pos.x = map(message.args[0],0,1,-width/2,width/2);
  }
  if(message.address == "/oscControl/slider2Dy"){
    pos.y = map(message.args[0],0,1,height/2,-height/2);
  }

  if(message.address == "/oscControl/toggle1"){
    editR = message.args[0];
  }
  if(message.address == "/oscControl/toggle2"){
    editG = message.args[0];
  }
  if(message.address == "/oscControl/toggle3"){
    editB = message.args[0];
  }
}

//Events we are listening for
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

// Callback function to recieve message from Node.JS
socket.on("message", (_message) => {

  console.log(_message);

  unpackOSC(_message);

});