let atom: Atom;

let walter: Walter;

function preload() {
    walter = loadJSON(
        'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json'
    ) as Walter;
}

function setup() {
    angleMode(DEGREES);
    createCanvas(windowWidth, windowHeight);

    const ask = prompt('Atomic Number', '1');
    const num = parseInt(ask);

    atom = new Atom(width / 2, height / 2, num);
}

function draw() {
    background(255);
    atom.draw();
}
