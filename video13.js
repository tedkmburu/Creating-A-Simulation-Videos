let diameter = 40;
let chargeRadius = diameter / 2; 

let charges = [];

function setup()
{
    createCanvas(800, 500)

    charges.push(new Charge(createVector(50, 150), 5))
    charges.push(new Charge(createVector(350, 150), -4))
}

function draw()
{
    background("black");
  
    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].display()
    }

    displayFieldVectors();
}

function netForceAtPosition(point)
{
    let k = 1; 
    let finalForce = createVector(0, 0); 

    for (let i = 0; i < charges.length; i++) 
    {
        let charge = charges[i];
        let radius = p5.Vector.dist(charge.position, point)
        let eField = (k * charge.charge) / radius;

        let theta = p5.Vector.sub(charge.position, point).heading()
        let forceX = eField * Math.cos(theta)
        let forceY = eField * Math.sin(theta)

        eField = createVector(forceX, forceY).mult(-1)

        finalForce.add(eField);
    }
    
    return finalForce

}

function doubleClicked() 
{
    let mousePosition = createVector(mouseX, mouseY)
    charges.push(new Charge(mousePosition, 0))
}

function mouseClicked()
{
    deselectCharges()

    for (let i = 0; i < charges.length; i++) 
    {
        let mousePosition = createVector(mouseX, mouseY)

        let collision = checkCollsion(charges[i], mousePosition)
        
        charges[i].selected = collision;
        
    }
}

function mouseDragged()
{
    for (let i = 0; i < charges.length; i++) 
    {
        let mousePosition = createVector(mouseX, mouseY)
        if (checkCollsion(charges[i], mousePosition)) 
        {
            charges[i].position = mousePosition

            return
        }
        
    }
}

function checkCollsion(circle, point)
{
    let distance = p5.Vector.dist(circle.position, point)

    if (distance < circle.radius) 
    {
        return true;
    }
    else
    {
        return false;
    }
}

function checkCollsionCircles(circle1, circle2)
{
    let distance = p5.Vector.dist(circle1.position, circle2.position)

    return (distance < circle2.radius + circle1.radius)
}

function displayFieldVectors()
{
    for (let x = 0; x < innerWidth; x+= 50) 
    {
        for (let y = 0; y < innerHeight; y+= 50) 
        {
            createFeildVector(createVector(x, y))
        }
    }
}

function createFeildVector(point)
{
    let finalPosition = netForceAtPosition(point).mult(500)
    finalPosition.add(point)

    stroke("white")
    line(point.x, point.y, finalPosition.x, finalPosition.y)
    
    
    translate(finalPosition.x, finalPosition.y);
    rotate(finalPosition.heading())
    triangle(-5, 0, 5, 0, 0,-5);
    rotate(- finalPosition.heading())
    translate(-finalPosition.x, -finalPosition.y);
}

function deselectCharges()
{
    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].selected = false;
    }
}

class Charge
{
    constructor(position, charge)
    {
        this.position = position;
        this.charge = charge;

        this.radius = chargeRadius;

        this.selected = false; 
        this.dragging = false; 

        this.slider = createSlider(-5, 5, this.charge, 1)
        this.slider.position(this.position.x - 60, this.position.y + 30);
        this.slider.style("visibility", "hidden")
    }

    display()
    {
        if (this.selected) 
        {
            this.slider.position(this.position.x - 60, this.position.y + 30);
            this.slider.style("visibility", "visible")
            stroke("white")

            this.charge = this.slider.value()
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

           
        ellipse(this.position.x, this.position.y, diameter, diameter)
        fill("white")
        noStroke()
        text(this.charge, this.position.x - 5, this.position.y + 5)   
    }
}