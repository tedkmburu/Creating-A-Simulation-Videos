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

    charges[0].x = mouseX;
    charges[0].y = mouseY;
}

function doubleClicked() 
{
    charges.push(new Charge(mouseX, mouseY, 0))
}

class Charge
{
    constructor(x, y, charge)
    {
        this.x = x;
        this.y = y;
        this.charge = charge;

        this.slider = createSlider(-5, 5, 0, 1)
        this.slider.position(this.x - 60, this.y + 30);
    }

    display()
    {
        this.slider.position(this.x - 60, this.y + 30);
        
        if (this.charge > 0) 
        {
            fill("red") 
        }
        else if (this.charge < 0) 
        {
            fill("blue") 
        }
        else
        {
            fill("grey") 
        }

           
        ellipse(this.x, this.y, diameter, diameter)
        fill("white")
        text(this.charge, this.x - 5, this.y + 5)   
    }
}