let x = 150; 

function setup() {
    createCanvas(800, 800);
}
  
function draw() {
    background("black")
    fill("white")
    rect(x, 100, 150, 100)


    fill("red")
    ellipse(mouseX, mouseY, 100, 100)

    // x = x + 1;
}

function mouseClicked() {
    x = 150;

}


function keyPressed() { 
    if (keyCode === LEFT_ARROW) 
    {
        x-= 10; 
    }
    if (keyCode === RIGHT_ARROW) 
    {
        x+= 10;
    }

    if (keyCode === 65) 
    {
        console.log("a");
    }
}