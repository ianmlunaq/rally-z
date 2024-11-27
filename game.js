"use strict";

// Global variables
const CU = 60;
const speed = 7;

let mykeyState=new keyState();
let pauseState = false;

let fullSpritemap = new Image();
fullSpritemap.src = "img\\rally-x-spritemap.png";

let carSpritemap = new Image();
carSpritemap.src = "img\\rally-x-car-spritemap.png";

// Map must be 38 car units wide (1 CU = width of car sprite) & 62 CUs long
let mapArray = [];

// individual sprite from sheet is 16 X 16 px
// sprite sheet, sprite x, sprite y, change of x, change of y, sprite width, sprite height, source location x, source location y, source width, source height, canvas width, canvas height          
var racecar = new sprite(carSpritemap,(canvas.width/2-(100/2)),(canvas.height/2)-(100/2), speed, CU, CU,16,16,canvas.width,canvas.height);

document.addEventListener('keydown', (event) => {
    if (event.code == 'Escape') {
        if (pauseState == false) {
            pauseState = true;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillText("GAME PAUSED", 5, 60);
        } else {
            pauseState = false;
        }        
    }
});

function draw_map() {
    context.imageSmoothingEnabled = false;
    for (let i = 0; i < 14; i++) {
        context.drawImage(fullSpritemap, 0, 184, 24, 24, 0, 0 + (CU * i), CU, CU);
        context.drawImage(fullSpritemap, 0, 184, 24, 24, 0 + (CU * i), 0, CU, CU);
        context.drawImage(fullSpritemap, 0, 184, 24, 24, canvas.width - CU, 0 + (CU * i), CU, CU);
        context.drawImage(fullSpritemap, 0, 184, 24, 24, 0 + (CU * i), canvas.height - CU, CU, CU);
        
    }
    //context.drawImage(fullSpritemap, 0, 184, 24, 24, 0, 0, CU, CU);
    //context.drawImage(fullSpritemap, 0, 184, 24, 24, 0, 0 + CU, CU, CU);
    context.save();
}

function draw() {
    context.clearRect(CU, CU, canvas.width - CU * 2, canvas.height - CU * 2);
    racecar.update(mykeyState);
    //context.save();
    racecar.draw();
    //context.restore();
};

//define callback function
/* window.requestAnimFrame = (function() {
  return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||
    function(callback)
    {
        window.setTimeout(callback, 1000 / 60);
    };
})(); */

async function gameloop() {

    // This checks if the game should be paused
    while (pauseState) {
        await sleep(100);
    }

    //draw_map();
    draw();
    //request next callback
    requestAnimationFrame(gameloop)
};

// Start the game

fullSpritemap.onload = draw_map;

gameloop();