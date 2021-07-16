const k = 89900; // k = 8.99 * Math.pow(10, -9) adjusted because all charges are in micro coulombs;
const testChargeCharge = 0.000005;

let charges = [];
let chargeDiameter = 40;
let chargeRadius = chargeDiameter / 2;

let testCharges = []
let testChargeDiameter = 10;
let testChargeRadius = testChargeDiameter / 2;

function setup() 
{
    createCanvas(innerWidth, innerHeight);

    //charges.push(new Charge(200, 400, -5))
    charges.push(new Charge(400, 400, +5))

    deselectCharges()
}
  
function draw() {
    background("black");

    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].display();
    }
    for (let i = 0; i < testCharges.length; i++) 
    {
        testCharges[i].display();
        testCharges[i].move();
    }
}


function netForceAtPoint(position) 
{
    let finalVector = createVector(0, 0);

    for (let i = 0; i < charges.length; i++) 
    {
        let charge = charges[i];
        let chargePosition = createVector(charge.x, charge.y);

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
    if (!selectACharge()) 
    {
        testCharges.push(new TestCharge(mouseX, mouseY, testChargeCharge));
    }
}


function doubleClicked()
{
    deselectCharges()

    if (!selectACharge()) 
    {
        charges.push(new Charge(mouseX, mouseY, 5))
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
        if (mouseX > charge.x - 75 && mouseX < charge.x + 75 && mouseY > charge.y + 25 && mouseY < charge.y + 50) 
        {
            onSlider = true;
        }
        if (charges[i].selected && !onSlider) 
        {
            charge.x = mouseX;
            charge.y = mouseY; 
            charge.dragging = true; 
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
        this.dragging = false; 

        this.slider = createSlider(-5, 5, this.charge, 1);
        this.slider.position(this.x - 75, this.y + 20);
        this.slider.style("visibility", "visible");
    }

    display()
    {
        this.charge = this.slider.value()
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
        ellipse(this.x, this.y, chargeDiameter, chargeDiameter);

        // rect(this.x - 75, this.y + 25, 150, 25);

        noStroke()
        fill("white");
        textSize(16);
        let chargeToShow = (this.charge > 0) ?  ("+" + this.charge) : this.charge;
        text(chargeToShow, this.x - 9, this.y + 7);
    }
}


class TestCharge
{
    constructor (x, y, charge)
    {
        this.x = x;
        this.y = y;
        this.charge = charge || 0; 

        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0 ,0);
    }

    display()
    {
       
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
        ellipse(this.position.x, this.position.y, testChargeDiameter, testChargeDiameter);
    }

    move()
    {
        let testCharge = this;
        let force = netForceAtPoint(testCharge.position);

        if (force.mag() != Infinity)
        {
            // F  = qE
            // ma = qE
            // a  = (qE)/m
            // m = 1
            // a  = q*E
            testCharge.acceleration = force.mult(testCharge.charge);
            testCharge.velocity.add(testCharge.acceleration);
            testCharge.position.add(testCharge.velocity);
        }
    }
}