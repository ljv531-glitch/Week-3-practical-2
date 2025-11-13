let starPositions = [];

function setup() {
  createCanvas(400, 300);
  noStroke();
  background(0, 0, 50);

 
  for (let i = 0; i < 3; i++) {
    let x = random(50, width - 50); 
    let y = random(50, height - 50);
    starPositions.push({x: x, y: y});
  }

 
  for (let pos of starPositions) {
    star(pos.x, pos.y);
  }
}

function draw() {
  
}


function star(x, y) {
  fill(255, 234, 0);

  triangle(x, y - 50, x - 20, y, x + 20, y);          
  triangle(x - 50, y - 20, x, y - 20, x, y + 10);     
  triangle(x + 50, y - 20, x, y - 20, x, y + 10);     
  triangle(x - 20, y - 5, x, y + 10, x - 35, y + 30); 
  triangle(x, y + 10, x + 20, y - 5, x + 35, y + 30); 
}
