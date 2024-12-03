"use strict";

// Global variables
const CU = 60;
const speed = 6;

let mykeyState=new keyState();
let pauseState = false;

const fullSpritemap = new Image();
fullSpritemap.src = "img\\rally-x-spritemap.png";

const carSpritemap = new Image();
carSpritemap.src = "img\\rally-x-car-spritemap.png";

const music = new sound("rally-x-area-1.webm")

let gameStart = new Date();

// Map must be 38 car units wide (1 CU = width of car sprite) & 62 CUs long
const mapArray = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// individual sprite from sheet is 16 X 16 px
// sprite sheet, sprite x, sprite y, change of x, change of y, sprite width, sprite height, source location x, source location y, source width, source height, canvas width, canvas height          
let racecar = new sprite(carSpritemap, CU * 2, CU * 2, speed, CU, CU,16,16, 0);
let racecar2 = new sprite(carSpritemap, (canvas.width / 2) - CU / 2, (canvas.height / 2) - (CU / 2), 0, CU, CU,16,16, 1);

document.addEventListener('keydown', (event) => {
    if (event.code == 'Escape') {
        if (pauseState == false) {
            pauseState = true;
            context.filter = "blur(5px)"
            draw();
            context.filter = "blur(0px)"
            context.font='60pt Tiny5';
            context.fillText("GAME PAUSED", canvas.width / 2 - 260, canvas.height / 2);
            context.font = "20pt Tiny5";
            context.fillText("Press [ESC] to resume", canvas.width / 2 - 140, canvas.height / 2 + 60);
        } else {
            pauseState = false;
        }        
    }
});

function draw_map() {
    let mapArrayIter = mapArray.entries();
    for (let y of mapArrayIter) {
        let mapArrayIterIter = y[1].entries();
        for (let x of mapArrayIterIter) {
            if (x[1] == 1) {
                let locationX = CU * x[0];
                let locationY = CU * y[0];
                context.drawImage(fullSpritemap, 0, 184, 24, 24, locationX, locationY, CU, CU);
            }   
        }
    }
    context.save();
}

function draw_map_2() {
    context.imageSmoothingEnabled = false;
    context.lineWidth = 5;
    context.lineJoin = "round";
    context.fillStyle = "#53B814";
    context.strokeStyle = "#B24C10"
    context.beginPath();
    //context.roundRect(120, 120, 60, 120, 5);
    context.moveTo(120, 120);
    context.lineTo(180, 120);
    context.lineTo(180, 180);
    context.lineTo(120, 180)
    context.lineTo(120, 120);
    //context.fill();
    context.stroke();
}

function draw() {
    context.clearRect(CU, CU, canvas.width - CU * 2, canvas.height - CU * 2);
    draw_map();
    racecar.update(mykeyState, mapArray);
    racecar.draw();
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

    let now = new Date();
    
    if (now - gameStart < 4000) {
        racecar.speed = 0;
        draw();
        if (now - gameStart < 1000) {
            context.fillText("3..", canvas.width / 2 - 30, canvas.height / 2);
        } else if (now - gameStart < 2000) {
            context.fillText("2..", canvas.width / 2 - 30, canvas.height / 2);
        } else if (now - gameStart < 3000) {
            context.fillText("1..", canvas.width / 2 - 30, canvas.height / 2);
        } else {
            context.fillText("GO!", canvas.width / 2 - 40, canvas.height / 2);
        } 
    } else {
        racecar.speed = 6;
        draw();
    }  

    //request next callback
    requestAnimationFrame(gameloop)
};

// Start the game

//music.play();
gameloop();