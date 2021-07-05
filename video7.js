let charges = [];
let chargeDiameter = 40;
let chargeRadius = chargeDiameter / 2;

function setup() 
{
    createCanvas(innerWidth, innerHeight);
}
  
function draw() {
    background("black")

    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].display();
        
    }
}


function mouseClicked()
{
    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].selected = false;
    }
    
    if (!selectACharge()) 
    {
        charges.push(new Charge(mouseX, mouseY, +5))
    }
}


function mouseDragged()
{
    selectACharge();
    for (let i = 0; i < charges.length; i++) 
    {
        if (charges[i].selected) 
        {
            charges[i].x = mouseX;
            charges[i].y = mouseY;   
        }
        
    }
}


function selectACharge()
{
    for (let i = 0; i < charges.length; i++) 
    {
        let chargePosition = createVector(charges[i].x, charges[i].y)
        let mousePosition = createVector(mouseX, mouseY)
        let distance = p5.Vector.dist(chargePosition, mousePosition)

        if (distance < chargeRadius) 
        {
            charges[i].selected = true;
            return true;
        }
    }

    return false;
}


class Charge
{
    constructor (x, y, charge)
    {
        this.x = x;
        this.y = y;
        this.charge = charge || 0; 

        this.selected = true; 

        this.slider = createSlider(-5, 5, 0, 1);
        this.slider.position(this.x - 75, this.y + 20);
        this.slider.style("visibility", "visible");
    }

    display()
    {
        if (this.selected) 
        {
            stroke("white")  
            this.slider.position(this.x - 75, this.y + 20);
            this.slider.style("visibility", "visible");
        }
        else
        {
            noStroke()
            this.slider.style("visibility", "hidden");
        }

        let color;
        if (this.charge < 0)
        {
            color = "blue";
        }
        else if (this.charge > 0)
        {
            color = "red";
        }
        else 
        {
            color = "grey";
        }

        fill(color);
        ellipse(this.x, this.y, chargeDiameter, chargeDiameter);

        noStroke()
        fill("white");
        textSize(16);
        let chargeToShow = (this.charge > 0) ?  ("+" + this.charge) : this.charge;
        text(chargeToShow, this.x - 9, this.y + 7);
    }
}