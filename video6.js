let diameter = 40;

let charges = [];

function setup()
{
    createCanvas(800, 500)

    charges.push(new Charge(50, 150, 5))
    charges.push(new Charge(150, 150, 4))
    charges.push(new Charge(250, 150, 3))
    charges.push(new Charge(350, 150, 2))
    charges.push(new Charge(150, 350, 1))
}

function draw()
{
    background("black");
  
    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].display()
    }
}

class Charge
{
    constructor(x, y, charge)
    {
        this.x = x;
        this.y = y;
        this.charge = charge;
    }

    display()
    {

        fill("red")
        ellipse(this.x, this.y, diameter, diameter)
        fill("white")
        text(this.charge, this.x - 5, this.y + 5)   
    }
}