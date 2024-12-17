"use strict";

function smokescreen(spritesheet, locationX, locationY, spriteWidth, spriteHeight) {
    //source image
    this.spritesheet = spritesheet;

    //sprite width and height
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;

    //source image height and width
    this.cropWidth = 24;
    this.cropHeight = 24; 

    this.locationX = locationX;
    this.locationY = locationY;

    this.age = 100;
}

smokescreen.prototype = {
    update: function() {
        this.age -= 0.2;
    },

    draw: function() {   
        context.imageSmoothingEnabled = false;
        context.filter = "opacity(" + this.age + "%)";
        context.drawImage(this.spritesheet, 72, 80, this.cropWidth, this.cropHeight, this.locationX, this.locationY, this.spriteWidth, this.spriteHeight);
        context.filter = "opacity(100%)";   
    }
}