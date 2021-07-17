
let x1 = 100; 
let y1 = 200; 
let charge1 = "+5"

let x2 = 300; 
let y2 = 200; 
let charge2 = "-5"

let diameter = 40;



function setup()
{
    console.log("Hello World!");
    createCanvas(800, 500)
}

function draw()
{
    background("black");


    // fill("white");
    // text("Hello World!", 200, 200)

    
    fill("blue")
    x2 = mouseX;
    y2 = mouseY;

    ellipse(x2, y2, diameter, diameter)
    fill("white")
    text(charge2, x2 - 5, y2 + 5)


    fill("red")
    ellipse(x1, y1, diameter, diameter)
    fill("white")
    text(charge1, x1 - 5, y1 + 5)

    // x = x + 1;
    // y--;

    x1++;
}