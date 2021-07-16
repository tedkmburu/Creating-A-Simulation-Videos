let x = 150; 

function setup() 
{
    createCanvas(800, 800);
}
  
function draw() 
{
    background("black")
    fill("white")
    rect(100, 100, 150, 100)


    fill("red")
    ellipse(x, 400, 100, 100)

    x = x + 1;
}