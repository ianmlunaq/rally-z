"use strict";

const canvas = document.getElementById('canvas');//your paper that you draw on this is a global
const context = canvas.getContext('2d');//your pen that you use to draw this is a global
    context.font='60pt Tiny5';
    context.fillStyle='Black';
    context.strokeStyle='Black';

// Random floating point
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Random int
function getRandomInt(min,max) {
  return Math.floor((Math.random() * max) + min);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}