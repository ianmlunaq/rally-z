"use strict";

function keyState() {
    this.value = 0;
}

function doKeyDown(e) {   
    if (e.code == 'Space') {
        mykeyState.value = mykeyState.value|16;
    }			
    
    if (e.code == 'KeyS') {
        mykeyState.value = mykeyState.value|8;
    }			
    
    if (e.code == 'KeyW') {
        mykeyState.value = mykeyState.value|4;
    }		
    
    if (e.code == 'KeyA') {
        mykeyState.value = mykeyState.value|2;
    }			
    
    if (e.code == 'KeyD') {
        mykeyState.value = mykeyState.value|1;
    }		
}

function doKeyUp(e) {	    
    if (e.code == 'Space') {
        mykeyState.value=mykeyState.value&~16;
    }			
    
    if (e.code == 'KeyS') {
        mykeyState.value=mykeyState.value&~8;
    }					
    
    if (e.code == 'KeyW') {
        mykeyState.value=mykeyState.value&~4;
    }		
    
    if (e.code == 'KeyA') {
        mykeyState.value=mykeyState.value&~2;
    }			
    
    if (e.code == 'KeyD') {
        mykeyState.value=mykeyState.value&~1;        
    }		
}

document.addEventListener('keydown', doKeyDown, true);
document.addEventListener('keyup', doKeyUp, true);