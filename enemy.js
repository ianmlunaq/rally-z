"use strict";

//sprite sheet, sprite x, sprite y, change of x, change of y, sprite width, sprite height, source location x, source location y, source width, source height, canvas width, canvas height
function enemy(spritesheet, locationX, locationY, speed, spriteWidth, spriteHeight, swidth, sheight, carType) //object definition for sprite
{
    this.spritesheet=spritesheet;//source image
    this.x = locationX;//location x and y
    this.y = locationY;	
    this.speed = speed;
    this.spriteWidth = spriteWidth;//sprite width and height
    this.spriteHeight = spriteHeight;
    this.cropWidth = swidth//source image height and width
    this.cropHeight = sheight;
        
    // currentSpritesheetColumn is used to draw the racecar on the screen
    // Acceptable values are 0 - 11.75
    // This can also be used to determine the racecar's heading
    //          0 = North
    
    // 9 = West             3 = East
    //
    //          6 = South; 
    this.currentSpritesheetColumn = 0;

    // spritesheetRow is used to select the car type from rally-x-car-spritemap.png
    // Acceptable values are 0 - 3
    this.spritesheetRow = carType;

    this.turnSpeed = .5;

    this.doneTurning = true;
    this.oldKeystate = 0;
    this.oldSpeed = this.speed;
};

//functions for sprite below
enemy.prototype = 
{   
    update: function(playerLocations, PFGrid, mapArray) {
        //sprite sheet is 192 X 64
        //sprite height is 16
        //sprite width is 16
        //4 rows of 12 columns in sheet

        let keystate = 0;
        let location = [];
        
        
        // Ensures car makes a complete turn
        if (!this.doneTurning) {
            keystate = this.oldKeystate;
        } else {
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

            let gridBck = PFGrid.clone();
            let finder = new PF.AStarFinder();
            let myX = Math.floor(this.x / CU);
            let myY = Math.floor(this.y / CU);
            let playerX = Math.floor(playerLocations[0][0] / CU);
            let playerY = Math.floor(playerLocations[1][0] / CU)
            
            let path = finder.findPath(myX, myY, playerX, playerY, gridBck);
            location = path;

            /* if (path) {
                console.log("Path found!");
                console.log(path);
                
            } else {
                console.log("No path found!");
            } */
            
            try {
                let distanceX = Math.abs(myX - path[1][0]);
                let distanceY = Math.abs(myY - path[1][1]);

                if (distanceX > distanceY) {
                    if (path[1][0] > myX) {
                        keystate = 1;
                    } else {
                        keystate = 2;
                    }
                } else {
                    if (path[1][1] > myY) {
                        keystate = 8;
                    } else {
                        keystate = 4;
                    }
                }
            } catch (error) {
                console.log(error);
                
            }
        }

        

        if (keystate > 0) {
            this.speed = 0;  
            
            // D Key
            if (keystate == 1) {
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
            if (keystate == 2) {
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
            if (keystate == 4) {
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
            if (keystate == 8)
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
                this.oldKeystate = keystate;
            } else {
                keystate = 0;
                this.speed = this.oldSpeed;
                this.oldSpeed = this.speed;
            }
       
            if (this.currentSpritesheetColumn > 11 + this.turnSpeed) {
                this.currentSpritesheetColumn = 0;
            } else if (this.currentSpritesheetColumn < 0) {
                this.currentSpritesheetColumn = 11 + this.turnSpeed;
            }
        }
                
        this.checkEdges(mapArray, location);
    },

    checkEdges: function(mapArray, location) {
        let hitWall = false;
        
        let spriteX = Math.floor(this.x / CU);
        let spriteY = Math.floor(this.y / CU);

        //console.log(spriteX, spriteY);

        // This determines whether the sprite hit a wall
        if (true) {            
            switch (this.currentSpritesheetColumn) {
                case 0:
                    if (mapArray[spriteY][spriteX] == 1) {
                        hitWall = true;
                    } else if (this.x > spriteX * CU) {
                        if (mapArray[spriteY][spriteX + 1] == 1) {
                            hitWall = true;
                        }
                    }

                    if (hitWall) {
                        this.y = (spriteY + 1) * CU;
                    }
                    break;

                case 3:
                    if (mapArray[spriteY][spriteX + 1] == 1) {
                        hitWall = true;
                    } else if (this.y > spriteY * CU) {
                        if (mapArray[spriteY + 1][spriteX + 1] == 1) {
                            hitWall = true;
                        }
                    }

                    if (hitWall) {
                        this.x = spriteX * CU;
                    }
                    break;

                case 6:
                    if (mapArray[spriteY + 1][spriteX] == 1) {
                        hitWall = true;
                    }  else if (this.x > spriteX * CU) {
                        if (mapArray[spriteY + 1][spriteX + 1] == 1) {
                            hitWall = true;
                        }
                    }

                    if (hitWall) {
                        this.y = spriteY * CU;
                    }
                    break;

                case 9:
                    if (mapArray[spriteY][spriteX] == 1) {
                        hitWall = true;
                    } else if (this.y > spriteY * CU) {
                        if (mapArray[spriteY + 1][spriteX] == 1) {
                            hitWall = true;
                        }
                    }

                    if (hitWall) {
                        this.x = (spriteX + 1) * CU;
                    }
                    break;
            
                default:
                    break;
            }
        }

        //console.log(location[0]);

        //Recalculate sprite's position on the grid
        spriteX = Math.floor(this.x / CU);
        spriteY = Math.floor(this.y / CU);

        // This determines which way the car should turn after hitting a wall
        if (hitWall) {
            /* this.doneTurning = false;

            switch (this.currentSpritesheetColumn) {
                case 0:
                    if (mapArray[spriteY][spriteX + 1] == 0) {
                        this.oldKeystate = 1;
                    } else if (mapArray[spriteY][spriteX - 1] == 0) {
                        this.oldKeystate = 2;
                    } else {
                        this.oldKeystate = 8;
                    }
                    break;
                    
                case 6:
                    if (mapArray[spriteY][spriteX + 1] == 0) {
                        this.oldKeystate = 1;
                    } else if (mapArray[spriteY][spriteX - 1] == 0) {
                        this.oldKeystate = 2;
                    } else {
                        this.oldKeystate = 4;
                    }
                    break;

                case 3:
                    if (mapArray[spriteY + 1][spriteX] == 0) {
                        this.oldKeystate = 8;
                    } else if (mapArray[spriteY - 1][spriteX] == 0) {
                        this.oldKeystate = 4;
                    } else {
                        this.oldKeystate = 2;
                    }
                    break;

                case 9:
                    if (mapArray[spriteY + 1][spriteX] == 0) {
                        this.oldKeystate = 8;
                    } else if (mapArray[spriteY - 1][spriteX] == 0) {
                        this.oldKeystate = 4;
                    } else {
                        this.oldKeystate = 1;
                    }
                    break;

                default:
                    break;
            } */
        }
    },

    draw: function() {   
        context.imageSmoothingEnabled = false;
        let cropX = Math.floor(this.currentSpritesheetColumn) * this.cropWidth;
        let cropY = this.spritesheetRow * this.cropHeight;
        
        context.drawImage(this.spritesheet, cropX, cropY,this.cropWidth,this.cropHeight,this.x,this.y,this.spriteWidth,this.spriteHeight);       
    },

    getLocationRange: function() {
        let spriteX = [this.x, this.x + CU, this.x + (CU / 2)];
        let spriteY = [this.y, this.y + CU, this.y + (CU / 2)];

        return [spriteX, spriteY];
    }
};