const k = 89900; // k = 8.99 * Math.pow(10, -9) adjusted because all charges are in micro coulombs;
const gridSize = 25;

let charges = [];
let chargeDiameter = 40;
let chargeRadius = chargeDiameter / 2;

let fieldVectors = [];

function setup() 
{
    createCanvas(innerWidth, innerHeight);

    charges.push(new Charge(createVector(200, 400), -5))
    charges.push(new Charge(createVector(400, 400), +5))

    deselectCharges()
}

function draw() 
{
    background("black");

    displayGrid()

    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].display();
    }

    fieldVectors = []    
    for (let y = 0; y < innerHeight; y+= gridSize)
    {
        for (let x = 0; x <= innerWidth; x+= gridSize)
        {
            let position = createVector(x, y);
            let vector = netForceAtPoint(position);

            let draw = true; 
            for (let i = 0; i < charges.length; i++) 
            {
                if (p5.Vector.dist(position, charges[i].position) < chargeDiameter) 
                {
                    draw = false; 
                }
            }

            if (draw && vector.mag() > 5) 
            {
                fieldVectors.push(new FieldVector(position, vector));
            }
            
        }
    }

    for (let i = 0; i < fieldVectors.length; i++) 
    {
        fieldVectors[i].display();
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


function mouseClicked()
{
    deselectCharges();
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
            stroke(0)
            this.slider.style("visibility", "hidden");
        }

        if (this.dragging) 
        {
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
        ellipse(this.position.x, this.position.y, chargeDiameter, chargeDiameter);

        // rect(this.x - 75, this.y + 25, 150, 25);

        noStroke()
        fill("white");
        textSize(16);
        let chargeToShow = (this.charge > 0) ?  ("+" + this.charge) : this.charge;
        text(chargeToShow, this.position.x - 9, this.position.y + 7);
    }
}


class FieldVector
{
    constructor (position, vector)
    {
        this.position = position;
        this.vector = vector.div(200); 

        this.end = position.copy().add(vector)

        this.lineScale = vector.mag() / 50;
        this.arrowScale = vector.mag() / 100;
    }

    display()
    {
        push()
            stroke(255)
            strokeWeight(this.lineScale)
            line(this.position.x, this.position.y, this.end.x, this.end.y);

            translate(this.end.x, this.end.y);
            rotate(this.vector.heading())
            // (0, 0, -10, -5, -10, 5 )
            triangle(0, 0, -10 * this.arrowScale, -5 * this.arrowScale, -10 * this.arrowScale, 5 * this.arrowScale);
        pop()
    }
}