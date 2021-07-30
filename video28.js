let diameter = 40;
let chargeRadius = diameter / 2; 

let charges = [];

let noPositiveCharges;

let voltageMap = []
let voltageAccuracy = 20

function setup()
{
    createCanvas(800, 500)

    charges.push(new Charge(createVector(200, 150), 5))
    charges.push(new Charge(createVector(450, 150), -4))

    checkForPositives();
}

function draw()
{
    background("black");
  
    checkForPositives();

    text(Math.round(frameRate()), 20, 20)

    createVoltageMap()
    displayVoltageMap()
    
    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].display()
    }
}

function createVoltageMap()
{
    voltageMap = []    

    for (let x = 0; x < innerWidth/voltageAccuracy; x++) 
    {
        voltageMap[x] = []
        for (let y = 0; y < innerHeight/voltageAccuracy; y++) 
        {
            voltageMap[x][y] = voltageAtPoint(createVector(x * voltageAccuracy, y * voltageAccuracy))
            
        }
        
    }
}

function displayVoltageMap()
{
    for (let x = 0; x < innerWidth/voltageAccuracy; x++) 
    {
        for (let y = 0; y < innerHeight/voltageAccuracy; y++) 
        {
            let voltage = voltageAtPoint(createVector(x * voltageAccuracy, y * voltageAccuracy))
            let color;

            if (voltage > 0) {
                color = "red";
            }
            else if (voltage < 0) 
            {
                color = "blue"
            }
            fill(color)
            rect(x * voltageAccuracy, y * voltageAccuracy, voltageAccuracy, voltageAccuracy)
        }
    }
}

function checkForPositives()
{
    noPositiveCharges = charges.some(charge => { 
        return !(charge.charge >= 0);
    })
}

function voltageAtPoint(point)
{
    let k = 10000000; 
    let voltage = 0; 

    for (let i = 0; i < charges.length; i++) 
    {
        let charge = charges[i];
        let radius = p5.Vector.dist(charge.position, point)
        let v = (k * charge.charge) / radius;

        voltage += v;
    }
    
    return voltage;
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

function reset()
{
    
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
        this.slider.input(reset)
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