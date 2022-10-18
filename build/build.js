let atom;
let atomic;
let walter;
function preload() {
    walter = loadJSON('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json');
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
    const atomicNumber = atomic.value();
    if (atomicNumber !== atom.number)
        atom.setElement(atomicNumber);
    atom.draw();
}
const electronShells = [2, 8, 8, 18, 18, 32, 32];
const nuclearShells = [4, 10, 18, 26, 34, 42, 50, 62, 74];
class Atom {
    constructor(x, y, atomic) {
        this.drawInfo = true;
        this.angle = 0;
        this.x = x;
        this.y = y;
        this.number = atomic;
        this.electronRadius = 120;
        this.electronShellInc = 70;
        this.nuclearRadius = 5;
        this.nuclearShellInc = 7.5;
        this.setElement(atomic);
    }
    setElement(number) {
        const element = walter.elements[number - 1];
        this.data = element;
        this.setAtom(element.number, Math.round(element.atomic_mass), 0, element.shells);
    }
    setAtom(atomic, mass, ionic, electronShellsProfile) {
        mass = mass || atomic * 2;
        ionic = ionic || 0;
        electronShellsProfile = electronShellsProfile || electronShells;
        this.number = atomic;
        const P = atomic;
        const N = mass - atomic;
        const E = atomic - ionic;
        let electrons = [];
        for (let i = 0; i < E; i++) {
            electrons.push(new Electron());
        }
        let nucleons = [];
        for (let i = 0; i < P; i++) {
            nucleons.push(new Proton());
        }
        for (let i = 0; i < N; i++) {
            nucleons.push(new Neutron());
        }
        for (let i = nucleons.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nucleons[i], nucleons[j]] = [nucleons[j], nucleons[i]];
        }
        this.electrons = Atom.makeShells(electrons, electronShellsProfile);
        this.nucleons = Atom.makeShells(nucleons, nuclearShells);
    }
    draw() {
        translate(this.x, this.y);
        for (let i = 0; i < this.electrons.length; i++) {
            const shell = this.electrons[i];
            const shellHeight = this.electronRadius + this.electronShellInc * i;
            noFill();
            ellipse(0, 0, this.electronRadius * 2 + this.electronShellInc * 2 * i);
            for (let j = 0; j < shell.length; j++) {
                const x = shellHeight * cos(this.angle);
                const y = shellHeight * sin(this.angle);
                if (i % 2 === 0)
                    shell[j].draw(x, y);
                else
                    shell[j].draw(y, x);
                rotate(360 / shell.length);
            }
        }
        for (let i = 0; i < this.nucleons.length; i++) {
            const shell = this.nucleons[i];
            const shellHeight = this.nuclearRadius + this.nuclearShellInc * i;
            for (let j = 0; j < shell.length; j++) {
                const x = shellHeight;
                const y = shellHeight;
                shell[j].draw(x, y);
                rotate(360 / shell.length);
            }
        }
        this.angle += 1;
        if (this.drawInfo) {
            const x = -width / 2.5;
            const y = 0;
            translate(x, y);
            noFill();
            rectMode(CENTER);
            rect(0, 0, 200, 200);
            fill(0);
            textAlign(LEFT, CENTER);
            textSize(35);
            text(this.number, -95, -75);
            textAlign(CENTER, CENTER);
            textSize(50);
            text(this.data.symbol, 0, -10);
            textSize(25);
            text(this.data.name, 0, 30);
            textSize(20);
            text(this.data.atomic_mass, 0, 65);
        }
    }
}
Atom.makeShells = (particles, shellProfile) => {
    let shells = [];
    let n = particles.length;
    for (let i = 0; i < shellProfile.length; i++) {
        const currentShell = shellProfile[i];
        if (n >= currentShell) {
            shells.push(particles.splice(0, currentShell));
            n -= currentShell;
            continue;
        }
        if (n > 0) {
            shells.push(particles.splice(0, n));
            n -= n;
        }
    }
    return shells;
};
class Particle {
    constructor(charge, size, color) {
        this.charge = charge;
        this.size = size;
        this.color = color;
    }
    draw(x, y) {
        fill(this.color);
        ellipse(x, y, this.size);
    }
}
class Proton extends Particle {
    constructor() {
        super(1, 10, 'red');
    }
}
class Neutron extends Particle {
    constructor() {
        super(0, 10, 'white');
    }
}
class Electron extends Particle {
    constructor() {
        super(-1, 10, 'yellow');
    }
}
//# sourceMappingURL=build.js.map