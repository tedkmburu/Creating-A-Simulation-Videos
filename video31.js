let diameter = 40;
let chargeRadius = diameter / 2; 

let charges = [];

let noPositiveCharges;

let voltageMap = []
let voltageAccuracy = 20

const backgroundCanvas = canvas => {

    canvas.setup = function() {
        canvas.createCanvas(innerWidth, innerHeight)
    };
  
    canvas.draw = function() {
        canvas.background("black");

        createVoltageMap()
        displayVoltageMap()
        
    };
};




const foregroundCanvas = canvas => {

    canvas.setup = function() {
        canvas.createCanvas(innerWidth, innerHeight)

        charges.push(new Charge(canvas.createVector(200, 150), 5))
        charges.push(new Charge(canvas.createVector(450, 150), -4))

        checkForPositives();
    };
  
    canvas.draw = function() {
        canvas.clear()();
  
        checkForPositives();

        canvas.text(Math.round(canvas.frameRate()), 20, 20)
        
        for (let i = 0; i < charges.length; i++) 
        {
            charges[i].display()
        }
    };
};



  
new p5(backgroundCanvas); // invoke p5
new p5(foregroundCanvas); // invoke p5

function createVoltageMap()
{
    voltageMap = []    

    for (let x = 0; x < innerWidth/voltageAccuracy; x++) 
    {
        voltageMap[x] = []
        for (let y = 0; y < innerHeight/voltageAccuracy; y++) 
        {            
            let r = 0;
            let g = 0;
            let b = 0;

            let voltage = voltageAtPoint(backgroundCanvas.createVector(x * voltageAccuracy, y * voltageAccuracy))

            let intensity = backgroundCanvas.map(Math.abs(voltage), 0, 1000000, 0, 255)

            if (voltage > 0) 
            {
                r = intensity;
            }
            else if (voltage < 0) 
            {
                b = intensity;
            }
            let a = intensity * 5;

            voltageMap[x][y] = backgroundCanvas.color(r, g, b, a)

        }
        
    }
}

function displayVoltageMap()
{
    for (let x = 0; x < innerWidth/voltageAccuracy; x++) 
    {
        for (let y = 0; y < innerHeight/voltageAccuracy; y++) 
        {
            let color = voltageMap[x][y];

            
            backgroundCanvas.fill(color)
            backgroundCanvas.rect(x * voltageAccuracy, y * voltageAccuracy, voltageAccuracy, voltageAccuracy)
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
    let finalForce = foregroundCanvas.createVector(0, 0); 

    for (let i = 0; i < charges.length; i++) 
    {
        let charge = charges[i];
        let radius = p5.Vector.dist(charge.position, point)
        let eField = (k * charge.charge) / radius;

        let theta = p5.Vector.sub(charge.position, point).heading()
        let forceX = eField * Math.cos(theta)
        let forceY = eField * Math.sin(theta)

        eField = foregroundCanvas.createVector(forceX, forceY).mult(-1)

        finalForce.add(eField);
    }
    
    return finalForce

}

function doubleClicked() 
{
    let mousePosition = foregroundCanvas.createVector(foregroundCanvas.mouseX, foregroundCanvas.mouseY)
    charges.push(new Charge(mousePosition, 0))
}

function mouseClicked()
{
    deselectCharges()

    for (let i = 0; i < charges.length; i++) 
    {
        let mousePosition = foregroundCanvas.createVector(foregroundCanvas.mouseX, foregroundCanvas.mouseY)

        let collision = checkCollsion(charges[i], mousePosition)
        
        charges[i].selected = collision;
        
    }
}

function mouseDragged()
{

    for (let i = 0; i < charges.length; i++) 
    {
        let mousePosition = foregroundCanvas.createVector(foregroundCanvas.mouseX, foregroundCanvas.mouseY)
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

        this.slider = foregroundCanvas.createSlider(-5, 5, this.charge, 1)
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
            foregroundCanvas.stroke("white")

            this.charge = this.slider.value()
        }
        else
        {
            this.slider.style("visibility", "hidden")
            foregroundCanvas.noStroke()
        }
        
        
        if (this.charge > 0) 
        {
            foregroundCanvas.fill("red") 
        }
        else if (this.charge < 0) 
        {
            foregroundCanvas.fill("blue") 
        }
        else
        {
            foregroundCanvas.fill("grey") 
        }

        foregroundCanvas.stroke("black")
        foregroundCanvas.ellipse(this.position.x, this.position.y, diameter, diameter)
        foregroundCanvas.fill("white")
        foregroundCanvas.noStroke()
        foregroundCanvas.text(this.charge, this.position.x - 5, this.position.y + 5)   
    }
}