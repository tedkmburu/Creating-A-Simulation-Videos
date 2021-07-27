let diameter = 40;
let chargeRadius = diameter / 2; 

let charges = [];

let noPositiveCharges;

function setup()
{
    createCanvas(800, 500)

    charges.push(new Charge(createVector(50, 150), 5))
    charges.push(new Charge(createVector(350, 150), -4))
}

function draw()
{
    background("black");
  
    checkForPositives();

    
    
    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].display()
    }

    displayFeildLines()

    
}

function checkForPositives()
{
    // noPositiveCharges = true
    // for (let i = 0; i < charges.length; i++) 
    // {
    //     if (charges[i].charge > 0 ) 
    //     {
    //         noPositiveCharges = false;   
    //     }
        
    // }

    noPositiveCharges = charges.some(charge => { 
        return ! (charge > 0);
    })

}

function displayFeildLines()
{
    stroke("white")

    let iteration = 0;

    for (let a = 0; a < charges.length; a++) 
    {
        let radius = createVector(chargeRadius, 0)
        let startingPosition = charges[a].position.copy()

        let startingPositions = []

        let numberOfLines = Math.abs(charges[a].charge) * 4

        for (let i = 0; i < numberOfLines; i++) 
        {
            startingPositions.push(p5.Vector.add(radius, startingPosition))
            radius.rotate((Math.PI * 2) / numberOfLines) 
        }

        for (let i = 0; i < startingPositions.length; i++) 
        {
            startingPosition = startingPositions[i]
            for (let i = 0; i < 100; i++) 
            {
                let finalPosition;
                let direction;

                if (noPositiveCharges) 
                {
                    finalPosition = netForceAtPosition(startingPosition).copy().mult(-1).setMag(10).add(startingPosition)
                    line(startingPosition.x, startingPosition.y, finalPosition.x, finalPosition.y)
                    direction = p5.Vector.sub(finalPosition, startingPosition).mult(-1)
                }
                else
                {
                    finalPosition = netForceAtPosition(startingPosition).copy().setMag(10).add(startingPosition)
                    line(startingPosition.x, startingPosition.y, finalPosition.x, finalPosition.y)
                    direction = p5.Vector.sub(finalPosition, startingPosition)
                }
                
                
                
                startingPosition = finalPosition

                iteration++;

                if (iteration > 10) 
                {
                    let scale = 1;
                    translate(finalPosition.x, finalPosition.y);
                    rotate(direction.heading())
                    triangle(0, 0, -10 * scale, -5 * scale, -10 * scale, 5 * scale);
                    rotate(- direction.heading())
                    translate(-finalPosition.x, -finalPosition.y);    

                    iteration = 0;
                }
            }

            iteration = 0;
        }
        
    }
}


function factorial(a)
{ 
    let result = 0;
    if(a <= 1)
    {
        return 1
    }
    else
    {
        result += a * factorial(a - 1)
    }

    return result
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