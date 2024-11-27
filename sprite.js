"use strict";

//sprite sheet, sprite x, sprite y, change of x, change of y, sprite width, sprite height, source location x, source location y, source width, source height, canvas width, canvas height
function sprite(spritesheet, locationX, locationY, speed, spriteWidth, spriteHeight, swidth, sheight, parentwidth, parentheight) //object definition for sprite
{
    this.spritesheet=spritesheet;//source image
    this.x = locationX;//location x and y
    this.y = locationY;	
    this.speed = speed;
    this.width = spriteWidth;//sprite width and height
    this.height = spriteHeight;
    /* this.sx = sx;//source image location x and y
    this.sy = sy; */
    this.swidth = swidth//source image height and width
    this.sheight = sheight;
    this.parentwidth = parentwidth;//canvas heigth and width
    this.parentheight = parentheight;
        
    this.currentSpritesheetColumn = 0;//current column and row of spritesheet
    this.currentRow = 0;
    this.turnSpeed = .25;

    this.doneTurning = true;
    this.oldKeystate = 0;
};

//functions for sprite below
sprite.prototype = 
{   
    update: function(keystate) {
        //sprite sheet is 192 X 64
        //sprite height is 16
        //sprite width is 16
        //4 rows of 12 columns in sheet

        this.checkEdges();

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
            }
       
            if (this.currentSpritesheetColumn > 11.75) {
                this.currentSpritesheetColumn = 0;
            } else if (this.currentSpritesheetColumn < 0) {
                this.currentSpritesheetColumn = 11.75;
            }
        }  
    },

    checkEdges: function() {
        if (this.x > this.parentwidth - this.width * 2 - 7) {
            this.x = this.parentwidth - this.width * 2 - 7;
        } else if (this.x < 7) {
            this.x = 7;
        }

        if (this.y > this.parentheight - this.height - 7) {
            this.y = this.parentheight - this.height - 7;            
        } else if (this.y < 7) {
            this.y = 7;
        }
        
    },

    draw: function() 
    {   
       context.imageSmoothingEnabled = false;
       context.drawImage(this.spritesheet,Math.floor(this.currentSpritesheetColumn)*this.swidth,this.currentRow*this.sheight,this.swidth,this.sheight,this.x,this.y,this.width,this.height);       
    }
};