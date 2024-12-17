"use strict";

//todo: make enemy chase you

// Global variables
const CU = 60;
const speed = 6;
let paused = false;
let crashed = false;
let smoked = false;
const music = new sound("rally-x-area-1.webm");
const crash_sfx = new sound("crash.webm");
let gameStart = new Date();

let mykeyState = new keyState();
let enemyKeyState = new keyState();

const fullSpritemap = new Image();
fullSpritemap.src = "img\\rally-x-spritemap.png";

const carSpritemap = new Image();
carSpritemap.src = "img\\rally-x-car-spritemap.png";

let smokescreenArray = [];

// Map must be 38 car units wide (1 CU = width of car sprite) & 62 CUs long
const mapArray = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,,1,0,0,0,0,1,1],
    [1,1,0,0,0,1,0,0,0,1,0,0,0,1,1],
    [1,1,0,0,1,0,0,0,0,0,1,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,1,0,0,0,0,0,1,0,0,1,1],
    [1,1,0,0,0,1,0,0,0,1,0,0,0,1,1],
    [1,1,0,0,0,0,1,0,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
let grid = new PF.Grid(mapArray);

// individual sprite from sheet is 16 X 16 px
// sprite sheet, sprite x, sprite y, change of x, change of y, sprite width, sprite height, source location x, source location y, source width, source height, canvas width, canvas height          
let racecar = new sprite(carSpritemap, (canvas.width / 2) - (CU / 2), (canvas.height / 2) + CU, 6, CU, CU, 16, 16, 0);
let enemyCar = new enemy(carSpritemap, (canvas.width / 2) - (CU / 2), (canvas.height / 2) + CU * 4, 0, CU, CU, 16, 16, 1);

document.addEventListener('keydown', (event) => {
    if (event.code == 'Escape') {
        if (paused == false) {
            paused = true;
            context.filter = "blur(5px)"
            draw();
            context.filter = "blur(0px)"
            context.font='60pt Tiny5';
            context.fillText("GAME PAUSED", canvas.width / 2 - 260, canvas.height / 2);
            context.font = "20pt Tiny5";
            context.fillText("Press [ESC] to resume", canvas.width / 2 - 140, canvas.height / 2 + 60);
        } else {
            paused = false;
        }        
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code == 'Space') {
        if (racecar.fuel > 0) {
            let locationX = racecar.x;
            let locationY = racecar.y;

            switch (racecar.currentSpritesheetColumn) {
                case 0:
                    locationY += 30;
                    break;

                case 3:
                    locationX -= 30;
                    break;

                case 6:
                    locationY -= 30;
                    break;

                case 9:
                    locationX += 30;
                    break;
            
                default:
                    break;
            }

            smokescreenArray.push(new smokescreen(fullSpritemap, locationX, locationY, CU, CU));
            racecar.fuel -= 50;
        }
        
    }
});

function crash() {
    music.stop();
    crash_sfx.play();
    // Use midpoint formula to determine crash location
    let crashX = (racecar.getLocationRange()[0][2] + enemyCar.getLocationRange()[0][2]) / 2;
    let crashY = (racecar.getLocationRange()[1][2] + enemyCar.getLocationRange()[1][2]) / 2;

    context.drawImage(fullSpritemap, 0, 80, 24, 24, crashX - CU / 2, crashY - CU / 2, CU, CU);}

function draw_map() {
    let mapArrayIter = mapArray.entries();
    for (let y of mapArrayIter) {
        let mapArrayIterIter = y[1].entries();
        for (let x of mapArrayIterIter) {
            let locationX = CU * x[0];
            let locationY = CU * y[0];

            if (x[1] == 1) {
                context.drawImage(fullSpritemap, 0, 184, 24, 24, locationX, locationY, CU, CU);
            } /* else if (x[1] == 2) {
                //context.drawImage(fullSpritemap, 72, 80, 24, 24, locationX, locationY, CU, CU);
            } */
        }
    }
    context.save();
}

/* function draw_map_2() {
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
} */

function fuelLevelDraw(gasTank) {
    // Fuel meter background
    context.fillStyle = "grey";
    context.fillRect(150, 30, 600, 60);

    context.fillStyle = 'Black';
    context.font = '35pt Tiny5';
    context.fillText("FUEL", 170, 75);

    if (gasTank <= 0) {
        context.strokeStyle = "Red" 
    }

    context.rect(300, 45, 420, 30);
    context.stroke();
    if (gasTank > 0) {
        if (gasTank < 50) {
            context.fillStyle = "Red";
        } else if (gasTank < 100) {
            context.fillStyle = "Yellow";
        }
        context.fillRect(305, 50, gasTank, 20);
    }
    
}

function collisionDetect(car1, car2) {
    let car1XRange = car1.getLocationRange()[0];
    let car1YRange = car1.getLocationRange()[1];
    let car2XRange = car2.getLocationRange()[0];
    let car2YRange = car2.getLocationRange()[1];
    
    if (((car1XRange[0] >= car2XRange[0] && car1XRange[0] <= car2XRange[1]) ||
        (car1XRange[1] >= car2XRange[0] && car1XRange[1] <= car2XRange[1]))
        &&
        ((car1YRange[0] >= car2YRange[0] && car1YRange[0] <= car2YRange[1]) ||
        (car1YRange[1] >= car2YRange[0] && car1YRange[1] <= car2YRange[1]))) {
        crashed = true;
    }
}

function draw() {
    context.clearRect(CU, CU, canvas.width - CU * 2, canvas.height - CU * 2);
    draw_map();

    racecar.update(mykeyState, mapArray);    
    enemyCar.update(racecar.getLocationRange(), grid, mapArray);

    fuelLevelDraw(racecar.fuel);

    collisionDetect(racecar, enemyCar);

    racecar.draw();
    enemyCar.draw();

    if (smokescreenArray[0]) {
        if (smokescreenArray[0].age < 1) {
            smokescreenArray.shift();
        }
        smokescreenArray.forEach((element) => {
            element.update(enemyCar.getLocationRange());
            element.draw();
        });        
    }
}

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
    if (!crashed) {
        while (paused) {
            await sleep(100);
        }

        if (smoked) {
            smoked = false;
            enemyCar.x = (canvas.width / 2) - (CU / 2);
            enemyCar.y = (canvas.height / 2) - (CU / 2);
        }

        let now = new Date();
        
        if (now - gameStart < 4000) {
            racecar.speed = 0;
            draw();
            context.font='60pt Tiny5';
            if (now - gameStart < 1000) {
                context.fillText("3..", canvas.width / 2 - 30, canvas.height / 2);
            } else if (now - gameStart < 2000) {
                context.fillText("2..", canvas.width / 2 - 30, canvas.height / 2);
            } else if (now - gameStart < 3000) {
                context.fillText("1..", canvas.width / 2 - 30, canvas.height / 2);
            } else {
                context.fillText("GO!", canvas.width / 2 - 40, canvas.height / 2);
                racecar.speed = speed;
            } 
        } else {
            //racecar.speed = speed;
            enemyCar.speed = 5;
            draw();
        }  

        //request next callback
        requestAnimationFrame(gameloop)
    } else {
        crash();
    }
};

// Start the game

music.play();
gameloop();