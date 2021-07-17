let x = 200; 

let y = 200; 

function setup()
{
    console.log("Hello World!");
    createCanvas(400, 400)
}

function draw()
{
    background("black");


    fill("white");
    text("Hello World!", 200, 200)

    
    
    ellipse(100, 100, 50, 50)


    fill("red")
    ellipse(x, y, 50, 50)

    x = x + 1;
    y--;
}