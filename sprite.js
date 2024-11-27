"use strict";

//sprite sheet, sprite x, sprite y, change of x, change of y, sprite width, sprite height, source location x, source location y, source width, source height, canvas width, canvas height
function sprite(spritesheet, locationX, locationY, speed, spriteWidth, spriteHeight, swidth, sheight, parentwidth, parentheight) //object definition for sprite
{
    this.spritesheet=spritesheet;//source image
    this.x = locationX;//location x and y
    this.y = locationY;	
    this.speed = speed;
    this.spriteWidth = spriteWidth;//sprite width and height
    this.spriteHeight = spriteHeight;
    /* this.sx = sx;//source image location x and y
    this.sy = sy; */
    this.cropWidth = swidth//source image height and width
    this.cropHeight = sheight;
    this.parentwidth = parentwidth;//canvas heigth and width
    this.parentheight = parentheight;
        
    // currentSpritesheetColumn is used to draw the racecar on the screen
    // Acceptable values are 0 - 11.75
    // This can also be used to determine the racecar's heading
    //          0 = North
    
    // 9 = West             3 = East
    //
    //          6 = South; 
    this.currentSpritesheetColumn = 0;

    // currentRow is used to select the car type from rally-x-car-spritemap.png
    // Acceptable values are 0 - 3
    this.currentRow = 0;

    this.turnSpeed = .5;

    this.doneTurning = true;
    this.oldKeystate = 0;
    this.oldSpeed = this.speed;
};

//functions for sprite below
sprite.prototype = 
{   
    update: function(keystate) {
        //sprite sheet is 192 X 64
        //sprite height is 16
        //sprite width is 16
        //4 rows of 12 columns in sheet

        // Determines which direction the car moves in
        if (this.currentSpritesheetColumn == 0) {
            this.y -= this.speed;
        } else if (this.currentSpritesheetColumn > 0 && this.currentSpritesheetColumn < 3) {
            this.y -= this.speed;
            this.x += this.speed;
        } else if (this.currentSpritesheetColumn == 3) {
            this.x += this.speed;
        } else if (this.currentSpritesheetColumn > 3 && this.currentSpritesheetColumn < 6) {
            this.y += this.speed;
            this.x += this.speed;
        } else if (this.currentSpritesheetColumn == 6) {
            this.y += this.speed;
        } else if (this.currentSpritesheetColumn > 6 && this.currentSpritesheetColumn < 9) {
            this.x -= this.speed;
            this.y += this.speed;
        } else if (this.currentSpritesheetColumn == 9) {
            this.x -= this.speed;
        } else if (this.currentSpritesheetColumn > 9) {
            this.x -= this.speed;
            this.y -= this.speed;
        }

        // Ensures car makes a complete turn
        if (!this.doneTurning) {
            keystate.value = this.oldKeystate;
        }

        if (keystate.value > 0) {
            this.speed = 0;

            // Space Key
            if (keystate.value & 16) {
                console.log("Space!");
            }  
            
            // D Key
            if (keystate.value == 1) {
                if (this.currentSpritesheetColumn != 3) {
                    if (this.currentSpritesheetColumn < 3) {
                        this.currentSpritesheetColumn += this.turnSpeed;
                    } else {
                        this.currentSpritesheetColumn -= this.turnSpeed;
                    }
                    this.doneTurning = false;
                } else {
                    this.doneTurning = true;
                }
            }

            //A key
            if (keystate.value == 2) {
                if (this.currentSpritesheetColumn != 9) {
                    if (this.currentSpritesheetColumn < 3 || this.currentSpritesheetColumn > 9) {
                        this.currentSpritesheetColumn -= this.turnSpeed;
                    } else {
                        this.currentSpritesheetColumn += this.turnSpeed;
                    }                    
                    this.doneTurning = false;
                } else {
                    this.doneTurning = true;
                }
            }

            //W key
            if (keystate.value == 4) {
                if (this.currentSpritesheetColumn != 0) {
                    if (this.currentSpritesheetColumn > 6) {
                        this.currentSpritesheetColumn += this.turnSpeed;
                    } else {
                        this.currentSpritesheetColumn -= this.turnSpeed;
                    }
                    this.doneTurning = false;
                } else {
                    this.doneTurning = true;
                }
            }

            //S key
            if (keystate.value == 8)
            { 
                if (this.currentSpritesheetColumn != 6) {
                    if (this.currentSpritesheetColumn < 6) {
                        this.currentSpritesheetColumn += this.turnSpeed;
                    } else {
                        this.currentSpritesheetColumn -= this.turnSpeed;
                    }
                    this.doneTurning = false;
                } else {
                    this.doneTurning = true;
                }
            } 

            if (!this.doneTurning) {
                this.oldKeystate = keystate.value;
            } else {
                keystate.value = 0;
                this.speed = this.oldSpeed;
                this.oldSpeed = this.speed;
            }
       
            if (this.currentSpritesheetColumn > 11 + this.turnSpeed) {
                this.currentSpritesheetColumn = 0;
            } else if (this.currentSpritesheetColumn < 0) {
                this.currentSpritesheetColumn = 11 + this.turnSpeed;
            }
        }
                
        this.checkEdges();
    },

    checkEdges: function() {
        let lowerBound = this.parentheight - this.spriteHeight * 2;
        let upperBound = this.spriteHeight;
        let rightBound = this.parentwidth - this.spriteWidth * 2;
        let leftBound = this.spriteWidth;
        let hitWall = false;

        // These 2 if..else if stmts prevent the player from going out of bounds
        // The nested if stmts determine whether the player hit the wall head-on
        // in order to change direction
        if (this.x > rightBound) {
            this.x = rightBound;
            if (this.currentSpritesheetColumn == 3) {
                hitWall = true;
            }
        } else if (this.x < leftBound) {
            this.x = leftBound;
            if (this.currentSpritesheetColumn == 9) {
                hitWall = true;
            }
        }

        if (this.y > lowerBound) {
            this.y = lowerBound;
            if (this.currentSpritesheetColumn == 6) {
                hitWall = true;
            }
        } else if (this.y < upperBound) {
            this.y = upperBound;
            if (this.currentSpritesheetColumn == 0) {
                hitWall = true;
            }
        }

        if (hitWall) {
            switch (this.currentSpritesheetColumn) {
                case 0:
                    this.doneTurning = false;
                    this.oldKeystate = 1;
                    break;

                case 3:
                    this.doneTurning = false;
                    this.oldKeystate = 8;
                    break;
            
                case 6:
                    this.doneTurning = false;
                    this.oldKeystate = 2;
                    break;
                
                case 9:
                    this.doneTurning = false;
                    this.oldKeystate = 4;
                    break;

                default:
                    break;
            }
        }

        hitWall = false;
    },

    draw: function() {   
        context.imageSmoothingEnabled = false;
        let cropX = Math.floor(this.currentSpritesheetColumn)*this.cropWidth;
        let cropY = this.currentRow*this.cropHeight;
        
        context.drawImage(this.spritesheet, cropX, cropY,this.cropWidth,this.cropHeight,this.x,this.y,this.spriteWidth,this.spriteHeight);       
    }
};