let atom: Atom;
let atomic: p5.Element;
let walter: Walter;

function preload() {
    walter = loadJSON(
        'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json'
    ) as Walter;
}

function setup() {
    angleMode(DEGREES);
    createCanvas(windowWidth, windowHeight);
    atom = new Atom(width / 2, height / 2, 1);
    atomic = createSlider(1, 119, 1, 1)
        .position(width / 2 - width / 2.5 - 100, height / 2 + 120)
        .style('width', '200px');
}

function draw() {
    background(255);

    const atomicNumber = <number>atomic.value();
    if (atomicNumber !== atom.number) atom.setElement(atomicNumber);

    atom.draw();
}
