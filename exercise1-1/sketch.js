function setup() {
    createCanvas(400, 300);
    noStroke();
}

function draw() {
    background(0, 0, 50);
    fill(255, 234, 0);
    triangle(width / 2, height / 2 - 50, width / 2 - 20, height / 2, width / 2 + 20, height / 2);
    triangle(width / 2 - 50, height / 2 - 20, width / 2, height / 2 - 20, width / 2, height / 2 + 10);
    triangle(width / 2 + 50, height / 2 - 20, width / 2, height / 2 - 20, width / 2, height / 2 + 10);
    triangle(width / 2 - 20, height / 2 - 5, width / 2, height / 2 + 10, width / 2 - 35, height / 2 + 30);
    triangle(width / 2, height / 2 + 10, width / 2 + 20, height / 2 - 5, width / 2 + 35, height / 2 + 30);

}