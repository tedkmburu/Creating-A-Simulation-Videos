let x = 100;

function setup() 
{
    console.log("Hello world!");
    createCanvas(800, 800);
}
  
function draw() {

    background(220);

    fill(0);
        stroke("red")
    rect(x, 100, 100, 150);

    fill(255);
    //ellipse(500, 100, 100, 150);
    ellipse(mouseX, mouseY, 100, 150);

    x++;


}