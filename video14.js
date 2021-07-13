const k = 89900; // k = 8.99 * Math.pow(10, -9) adjusted because all charges are in micro coulombs;
const gridSize = 25;

let charges = [];
let chargeDiameter = 40;
let chargeRadius = chargeDiameter / 2;

let backgroundCanvas
let foreGroundCanvas


const background = canvas => {

    canvas.setup = function()  // This function only runs once when the page first loads. 
    {
      canvas.createCanvas(innerWidth, innerHeight); // creates the <canvas> that everything runs on.
      backgroundCanvas = canvas;
    }
  
    canvas.draw = function() // this function runs every frame. Everything on the background canvas starts here.
    {  
        canvas.background("black");

        let voltageAccuracy = 15; 

        canvas.push()
            for (let x = 0; x < innerWidth; x+= voltageAccuracy) 
            {
                for (let y = 0; y < innerHeight; y+= voltageAccuracy) 
                {
                    canvas.noStroke()

                    let voltage = voltageAtPoint(canvas.createVector(x, y))
                    let intensity = canvas.map(Math.abs(voltage), 0, 5475, 0, 255)

                

                    let red = 0;
                    let blue = 0;
                    let green = 0;
                    let alpha = intensity * 10;

                    if (voltage > 0) red = intensity;
                    else if (voltage < 0) blue = intensity;

                    canvas.fill(red, green, blue, alpha)
                    canvas.rect(x, y, voltageAccuracy, voltageAccuracy)
                }
            }
            canvas.pop()
    }
  
    canvas.windowResized = function() // inbuilt p5 function. runs everytime the window is resized
    {
      canvas.resizeCanvas(innerWidth, innerHeight); // resizes the canvas to fit the new window size
    }
}



const foreGround = canvas => {
  
    canvas.setup = function()  // This function only runs once when the page first loads. 
    {
        canvas.createCanvas(innerWidth, innerHeight); // creates the <canvas> that everything runs on.

        
        foreGroundCanvas = canvas;
        charges.push(new Charge(canvas.createVector(400, 400), +5))
        deselectCharges()
    }
  
  
  
    canvas.draw = function() // this function runs every frame. Everything on the foreground canvas starts here.
    {  
      canvas.clear(); // clears the canvas so that it's transparent

      displayGrid()

        for (let i = 0; i < charges.length; i++) 
        {
            charges[i].display();
        }
    }
  
    canvas.mouseClicked = function() { whenMouseClicked(); } // inbuilt p5 function. runs everytime any mouse button is clicked
    canvas.mouseDragged = function() { whenMouseDragged(); } // inbuilt p5 function. runs everytime the mosue is dragged (clicked down and moving)
    canvas.doubleClicked = function() { whenDoubleClicked(); } // inbuilt p5 function. runs everytime the mouse is double clicked
   
}


new p5(background); // creates the background instance of p5
new p5(foreGround); // creates the foreground instance of p5


function displayGrid() // displays background grid
{
    let canvas = foreGroundCanvas
    canvas.push();
        canvas.stroke("rgba(255,255,255,0.25)"); // gray color for the grid
        for (let x = 0; x <= innerWidth; x+= gridSize)
        {
            canvas.line(x, 0, x, innerHeight);
        }
        for (let y = 0; y < innerHeight; y+= gridSize)
        {
            canvas.line(0, y, innerWidth, y);
        }
    canvas.pop();
}



function netForceAtPoint(position) 
{
    let canvas = foreGroundCanvas;

    let finalVector = canvas.createVector(0, 0);

    for (let i = 0; i < charges.length; i++) 
    {
        let charge = charges[i];
        let chargePosition = canvas.createVector(charge.position.x, charge.position.y);

        //F = KQ / (r^2)
        let kq = charge.charge * k;
        let r = p5.Vector.dist(position, chargePosition) / 10;

        if (r < 0.5) r = 0.5
        
        let rSquared = Math.pow(r,2);
        let force = kq / rSquared;

        let theta = p5.Vector.sub(chargePosition, position).heading();
        let forceX = force * Math.cos(theta);
        let forceY = force * Math.sin(theta);

        let forceVectors = canvas.createVector(forceX, forceY).mult(-1);

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


function whenMouseClicked()
{
    deselectCharges();
    selectACharge()
}


function whenDoubleClicked()
{
    deselectCharges();

    if (!selectACharge()) 
    {
        let canvas = foreGroundCanvas;
        let mousePosition = canvas.createVector(canvas.mouseX, canvas.mouseY);
        charges.push(new Charge(mousePosition, 5))
    }
}

function whenMouseDragged()
{
    let canvas = foreGroundCanvas;
    selectACharge();

    for (let i = 0; i < charges.length; i++) 
    {
        let charge = charges[i];
        let onSlider = false;

        // rect(this.x - 75, this.y + 25, 150, 25);
        if (canvas.mouseX > charge.position.x - 75 && canvas.mouseX < charge.position.x + 75 && canvas.mouseY > charge.position.y + 25 && canvas.mouseY < charge.position.y + 50) 
        {
            onSlider = true;
        }
        if (charges[i].selected && !onSlider) 
        {
            deselectCharges()
            charge.position.x = canvas.mouseX;
            charge.position.y = canvas.mouseY; 
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
    let canvas = foreGroundCanvas;
    for (let i = 0; i < charges.length; i++) 
    {
        let chargePosition = charges[i].position;
        let mousePosition = canvas.createVector(canvas.mouseX, canvas.mouseY)
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
        let canvas = foreGroundCanvas;

        this.position = position;
        this.charge = charge || 0; 

        this.radius = chargeRadius; 

        this.selected = true;
        this.dragging = false; 

        this.slider = canvas.createSlider(-5, 5, this.charge, 1);
        this.slider.position(this.position.x - 75, this.position.y + 20);
        this.slider.style("visibility", "visible");
    }

    display()
    {
        let canvas = foreGroundCanvas;

        this.charge = this.slider.value()
        if (this.selected) 
        {
            canvas.stroke("white")  
            this.slider.position(this.position.x - 75, this.position.y + 20);
            this.slider.style("visibility", "visible");
        }
        else
        {
            canvas.stroke(0);
            this.slider.style("visibility", "hidden");
        }

        if (this.dragging)  this.slider.style("visibility", "hidden");

        let color;
        if (this.charge < 0) color = "blue"; 
        else if (this.charge > 0) color = "red";
        else   color = "grey";

        canvas.fill(color);
        canvas.ellipse(this.position.x, this.position.y, chargeDiameter, chargeDiameter);

        // rect(this.x - 75, this.y + 25, 150, 25);

        canvas.noStroke()
        canvas.fill("white");
        canvas.textSize(16);
        let chargeToShow = (this.charge > 0) ?  ("+" + this.charge) : this.charge;
        canvas.text(chargeToShow, this.position.x - 9, this.position.y + 7);
    }
}


