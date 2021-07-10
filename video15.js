const k = 89900; // k = 8.99 * Math.pow(10, -9) adjusted because all charges are in micro coulombs;
const gridSize = 25;

let charges = [];
let chargeDiameter = 40;
let chargeRadius = chargeDiameter / 2;

function setup() 
{
    createCanvas(innerWidth, innerHeight);

    charges.push(new Charge(createVector(400, 400), +5))

    deselectCharges()
}

function draw() 
{
    background("black");

    displayGrid()

    let voltageAccuracy = 15; 

    push()
        for (let x = 0; x < innerWidth; x+= voltageAccuracy) 
        {
            for (let y = 0; y < innerHeight; y+= voltageAccuracy) 
            {
                noStroke()

                let voltage = voltageAtPoint(createVector(x, y))
                let intensity = map(Math.abs(voltage), 0, 5475, 0, 255)

               

                let red = 0;
                let blue = 0;
                let green = 0;
                let alpha = intensity * 10;

                if (voltage > 0) red = intensity;
                else if (voltage < 0) blue = intensity;

                fill(red, green, blue, alpha)
                rect(x, y, voltageAccuracy, voltageAccuracy)
            }
        }
    pop()

    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].display();
    }
}



function displayGrid() // displays background grid
{
    push();
    stroke("rgba(255,255,255,0.25)"); // gray color for the grid
        for (let x = 0; x <= innerWidth; x+= gridSize)
        {
        line(x, 0, x, innerHeight);
        }
        for (let y = 0; y < innerHeight; y+= gridSize)
        {
        line(0, y, innerWidth, y);
        }
    pop();
}



function netForceAtPoint(position) 
{
    let finalVector = createVector(0, 0);

    for (let i = 0; i < charges.length; i++) 
    {
        let charge = charges[i];
        let chargePosition = createVector(charge.position.x, charge.position.y);

        //F = KQ / (r^2)
        let kq = charge.charge * k;
        let r = p5.Vector.dist(position, chargePosition) / 10;

        if (r < 0.5) r = 0.5
        
        let rSquared = Math.pow(r,2);
        let force = kq / rSquared;

        let theta = p5.Vector.sub(chargePosition, position).heading();
        let forceX = force * Math.cos(theta);
        let forceY = force * Math.sin(theta);

        let forceVectors = createVector(forceX, forceY).mult(-1);

        finalVector.add(forceVectors);
    }

    return finalVector;
}


function voltageAtPoint(point)
{
  let voltage = 0;

  charges.forEach(charge => {
    // V = kq / r 
    let kq = charge.charge * k;
    let r = p5.Vector.dist(point, charge.position);
    let v = kq / r;

    voltage += v;
  })

  return voltage;
}


function mouseClicked()
{
    deselectCharges();
    selectACharge()
}


function doubleClicked()
{
    deselectCharges();

    if (!selectACharge()) 
    {
        let mousePosition = createVector(mouseX, mouseY);
        charges.push(new Charge(mousePosition, 5))
    }
}

function mouseDragged()
{
    selectACharge();

    for (let i = 0; i < charges.length; i++) 
    {
        let charge = charges[i];
        let onSlider = false;

        // rect(this.x - 75, this.y + 25, 150, 25);
        if (mouseX > charge.position.x - 75 && mouseX < charge.position.x + 75 && mouseY > charge.position.y + 25 && mouseY < charge.position.y + 50) 
        {
            onSlider = true;
        }
        if (charges[i].selected && !onSlider) 
        {
            deselectCharges()
            charge.position.x = mouseX;
            charge.position.y = mouseY; 
            charge.selected = true; 
            charge.dragging = true; 
            return
        }
        else if (onSlider) 
        {
            charge.dragging = false; 
        }
        else
        {
            charge.dragging = false; 
        }
        
    }
}


function deselectCharges()
{
    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].selected = false;
        charges[i].dragging = false;
    }
}


function selectACharge()
{
    for (let i = 0; i < charges.length; i++) 
    {
        let chargePosition = charges[i].position;
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

function circleIsInCircle(circle1, circle2)
{
  let distance = circle1.position.dist(circle2.position);
  return (distance < circle1.radius + circle2.radius)
}



class Charge
{
    constructor (position, charge)
    {
        this.position = position;
        this.charge = charge || 0; 

        this.radius = chargeRadius; 

        this.selected = true;
        this.dragging = false; 

        this.slider = createSlider(-5, 5, this.charge, 1);
        this.slider.position(this.position.x - 75, this.position.y + 20);
        this.slider.style("visibility", "visible");
    }

    display()
    {
        this.charge = this.slider.value()
        if (this.selected) 
        {
            stroke("white")  
            this.slider.position(this.position.x - 75, this.position.y + 20);
            this.slider.style("visibility", "visible");
        }
        else
        {
            stroke(0);
            this.slider.style("visibility", "hidden");
        }

        if (this.dragging)  this.slider.style("visibility", "hidden");

        let color;
        if (this.charge < 0) color = "blue"; 
        else if (this.charge > 0) color = "red";
        else   color = "grey";

        fill(color);
        ellipse(this.position.x, this.position.y, chargeDiameter, chargeDiameter);

        // rect(this.x - 75, this.y + 25, 150, 25);

        noStroke()
        fill("white");
        textSize(16);
        let chargeToShow = (this.charge > 0) ?  ("+" + this.charge) : this.charge;
        text(chargeToShow, this.position.x - 9, this.position.y + 7);
    }
}


