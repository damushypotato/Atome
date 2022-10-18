let atom: Atom;
let atomic: p5.Element;
let custom: p5.Element;
let summary: any;
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
    custom = createButton('Customize Atom')
        .style('width', '120px')
        .style('height', '20px')
        .position(width / 2 - 60, 5)
        .mousePressed(() => {
            const mass = prompt(
                `Enter the mass of your ${atom.data.name} Atom`,
                round(atom.data.atomic_mass).toString()
            );
            const charge = prompt(`Enter the charge of your ${atom.data.name} Atom`, '0');

            if (mass && charge) atom.setAtom(atom.number, parseInt(mass), parseInt(charge));
        });
    summary = createCheckbox('Show Summary', true).position(5, 5);
}

function draw() {
    background(255);

    const atomicNumber = <number>atomic.value();
    if (atomicNumber !== atom.number) atom.setElement(atomicNumber);

    atom.draw();
    Atom.drawSymbol(atom.number, width / 2 - width / 2.5, height / 2);
    atom.drawIsotope(width / 2, 40);
    if (summary.checked()) Atom.drawInfo(atom.number, width / 2, height);
}
