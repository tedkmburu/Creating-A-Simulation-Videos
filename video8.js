let diameter = 40;
let chargeRadius = diameter / 2; 

let charges = [];

function setup()
{
    createCanvas(800, 500)

    charges.push(new Charge(50, 150, 5))
    // charges.push(new Charge(150, 150, 4))
    // charges.push(new Charge(250, 150, 3))
    // charges.push(new Charge(350, 150, 2))
    // charges.push(new Charge(150, 350, 1))
}

function draw()
{
    background("black");
  
    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].display()
    }

    // charges[0].x = mouseX;
    // charges[0].y = mouseY;
}

function doubleClicked() 
{
    charges.push(new Charge(mouseX, mouseY, 0))
}

function mouseClicked()
{
    deselectCharges()

    for (let i = 0; i < charges.length; i++) 
    {
        let mousePosition = createVector(mouseX, mouseY)
        let chargePosition = createVector(charges[i].x, charges[i].y)

        let distance = p5.Vector.dist(mousePosition, chargePosition)

        if (distance < chargeRadius) 
        {
            charges[i].selected = true;
        }
        
    }
}

function deselectCharges()
{
    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].selected = false;
        
    }

    console.log("asdf");
}

class Charge
{
    constructor(x, y, charge)
    {
        this.x = x;
        this.y = y;
        this.charge = charge;

        this.selected = false; 

        this.slider = createSlider(-5, 5, 0, 1)
        this.slider.position(this.x - 60, this.y + 30);
        this.slider.style("visibility", "hidden")
    }

    display()
    {
        if (this.selected) 
        {
            this.slider.position(this.x - 60, this.y + 30);
            this.slider.style("visibility", "visible")
            stroke("white")
        }
        else
        {
            this.slider.style("visibility", "hidden")
            noStroke()
        }
        
        
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
        noStroke()
        text(this.charge, this.x - 5, this.y + 5)   
    }
}