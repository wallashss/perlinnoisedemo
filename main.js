"use strict";

let perlinNoiseMaker = new PerlinNoise();

let canvasController=  {canvas: null, context: null };
let updateButton = null;
let textureDimension = {width: 256, height: 256};

let seed = 
{
    offsetx : 0,
    offsety : 0,
    scalex : 0.05,
    scaley : 0.05,
    persistence: 0.5
};

let octaves = [0, 1, 2, 3];

function init()
{
    canvasController.canvas = document.getElementById("canvas");
    canvasController.context = canvasController.canvas.getContext("2d");

    let updateButton = document.getElementById("update-button");
    updateButton.addEventListener("click", ()=>
    {
        updateParameters();
        update();
    });

}

function updateParameters()
{
    // Not a problem to get each input
    textureDimension.width = parseFloat(document.getElementById("texture-width-input").value);
    textureDimension.height = parseFloat(document.getElementById("texture-height-input").value);
    seed.persistence = parseFloat(document.getElementById("persistence-input").value);
    seed.offsetx = parseFloat(document.getElementById("offsetx-input").value);
    seed.offsety = parseFloat(document.getElementById("offsety-input").value);
    seed.scalex = parseFloat(document.getElementById("scalex-input").value);
    seed.scaley = parseFloat(document.getElementById("scaley-input").value);
    
    // Octaves
    let newOctaves = [];
    if(document.getElementById("octave0-checkbox").checked)
    {
        newOctaves.push(0);
    }
    if(document.getElementById("octave1-checkbox").checked)
    {
        newOctaves.push(1);
    }
    if(document.getElementById("octave2-checkbox").checked)
    {
        newOctaves.push(2);
    }
    if(document.getElementById("octave3-checkbox").checked)
    {
        newOctaves.push(3);
    }

    octaves = newOctaves;
}

function update()
{
    let c = canvasController.canvas;
    let ctx = canvasController.context;

    let w = textureDimension.width;
    let h = textureDimension.height;

    c.width = w;
    c.height = h;

    let imgData = ctx.createImageData(w, h);
    
    perlinNoiseMaker.getNoiseTexture(imgData, w, h, false, seed, octaves);

    ctx.putImageData(imgData,0,0);
}


window.addEventListener("load", function()
{
	 init();
});