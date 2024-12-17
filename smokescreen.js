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
    update: function(locationRange) {
        this.age -= 0.2;

        let carXRange = locationRange[0];
        let carYRange = locationRange[1];
        let smokescreenXRange = this.getLocationRange()[0];
        let smokescreenYRange = this.getLocationRange()[1];
        
        if (((carXRange[0] >= smokescreenXRange[0] && carXRange[0] <= smokescreenXRange[1]) ||
            (carXRange[1] >= smokescreenXRange[0] && carXRange[1] <= smokescreenXRange[1]))
            &&
            ((carYRange[0] >= smokescreenYRange[0] && carYRange[0] <= smokescreenYRange[1]) ||
            (carYRange[1] >= smokescreenYRange[0] && carYRange[1] <= smokescreenYRange[1]))) {
            smoked = true;
            this.age = 0;            
        }
    },

    draw: function() {   
        context.imageSmoothingEnabled = false;
        context.filter = "opacity(" + this.age + "%)";
        context.drawImage(this.spritesheet, 72, 80, this.cropWidth, this.cropHeight, this.locationX, this.locationY, this.spriteWidth, this.spriteHeight);
        context.filter = "opacity(100%)";   
    },

    getLocationRange: function() {
        let spriteX = [this.locationX, this.locationX + CU, this.locationX + (CU / 2)];
        let spriteY = [this.locationY, this.locationY + CU, this.locationY + (CU / 2)];

        return [spriteX, spriteY];
    }
}