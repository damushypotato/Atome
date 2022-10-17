const electronShells = [2, 8, 8, 18, 18, 32, 32];
const nuclearShells = [4, 10, 18, 26, 34, 42, 50, 62, 74];

interface Walter {
    elements: {
        name: string;
        appearance: string;
        atomic_mass: number;
        boil: number;
        category: string;
        density: number;
        discovered_by: string;
        melt: number;
        molar_heat: number;
        named_by: string;
        number: number;
        period: number;
        phase: string;
        source: string;
        bohr_model_image: string;
        bohr_model_3d: string;
        spectral_img: string;
        summary: string;
        symbol: string;
        xpos: number;
        ypos: number;
        shells: number[];
        electron_configuration: string;
        electron_configuration_semantic: string;
        electron_affinity: number;
        electronegativity_pauling: number;
        ionization_energies: number[];
        'cpk-hex': string;
        image: {
            title: string;
            url: string;
            attribution: string;
        };
    }[];
}

class Atom {
    number: number;
    x: number;
    y: number;
    electronRadius: number;
    nuclearRadius: number;
    electronShellInc: number;
    nuclearShellInc: number;
    nucleons: (Proton | Neutron)[][];
    electrons: Electron[][];
    data: Walter['elements'][any];
    drawInfo: boolean = true;

    private angle = 0;

    constructor(x: number, y: number, atomic: number) {
        this.x = x;
        this.y = y;

        this.number = atomic;

        this.electronRadius = 120;
        this.electronShellInc = 70;
        this.nuclearRadius = 5;
        this.nuclearShellInc = 7.5;

        this.setElement(atomic);
    }

    setElement(number: number) {
        const element = walter.elements[number - 1];
        this.data = element;
        this.setAtom(element.number, Math.round(element.atomic_mass), 0, element.shells);
    }

    setAtom(atomic: number, mass?: number, ionic?: number, electronShellsProfile?: number[]) {
        mass = mass || atomic * 2;
        ionic = ionic || 0;
        electronShellsProfile = electronShellsProfile || electronShells;

        this.number = atomic;

        const P = atomic;
        const N = mass - atomic;
        const E = atomic - ionic;

        let electrons: Electron[] = [];
        for (let i = 0; i < E; i++) {
            electrons.push(new Electron());
        }

        let nucleons: (Proton | Neutron)[] = [];
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

    static makeShells = <T>(particles: T[], shellProfile: number[]): T[][] => {
        let shells: any[] = [];
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

                if (i % 2 === 0) shell[j].draw(x, y);
                else shell[j].draw(y, x);

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

class Particle {
    constructor(public charge: number, public size: number, public color: string) {}

    draw(x: number, y: number) {
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
