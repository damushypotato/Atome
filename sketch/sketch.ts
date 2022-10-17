let atom: Atom;

let walter: Walter;

function preload() {
    walter = loadJSON('../walter_hartwell_white.json') as Walter;
}

function setup() {
    angleMode(DEGREES);
    createCanvas(windowWidth, windowHeight);

    atom = new Atom(width / 2, height / 2, 5);
}

function draw() {
    background(255);
    atom.draw();
}
