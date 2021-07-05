let x = 150; 
let y = 150; 
let color = "red";
let charge = "+5";
let chargeDiameter = 40;


let x2 = 150; 
let y2 = 350; 
let color2 = "blue";
let charge2 = "-5";
let chargeDiameter2 = 40;

let charges = [];



function setup() 
{
    createCanvas(innerWidth, innerHeight);
}
  
function draw() {
    background("black")


    fill(color);
    ellipse(x, y, chargeDiameter, chargeDiameter);

    fill("white");
    textSize(16);
    text(charge, x - 9, y + 7);



    // charge 2
    fill(color2);
    ellipse(x2, y2, chargeDiameter2, chargeDiameter2);

    fill("white");
    textSize(16);
    text(charge2, x2 - 9, y2 + 7);

    // charge3.display();
    // charge4.display();

    for (let i = 0; i < charges.length; i++) 
    {
        charges[i].display();
        
    }


}


function mouseDragged() 
{
    x = mouseX; 
    y = mouseY;
}


function mouseClicked()
{
    charges.push(new Charge(mouseX, mouseY, 5))
}



class Charge
{
    constructor (x, y, charge)
    {
        this.x = x;
        this.y = y;
        this.charge = charge; 
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
        ellipse(this.x, this.y, chargeDiameter, chargeDiameter);

        fill("white");
        textSize(16);
        text(charge, this.x - 9, this.y + 7);
    }
}

let charge3 = new Charge(400, 100, 5);
let charge4 = new Charge(400, 200, -5)

charges = [charge3, charge4]