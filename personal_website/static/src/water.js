
APPS.push(() => {
    const title = document.getElementById('title');
    const canvas = document.getElementById('water');
    //const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
        const rect = title.getBoundingClientRect();
        console.log(`resizing to ${rect.width}, ${rect.height}`)
        canvas.width = rect.width;
        canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', () => resizeCanvas());

    const letterShapes = {
        W: {
            outline: [
                [0, 0.19],
                [0.3, 0.19],
                [0.35, 0.45],
                [0.43, 0.31],
                [0.58, 0.31],
                [0.66, 0.45],
                [0.7, 0.19],
                [1, 0.19],
                [0.88, 0.76],
                [0.62, 0.76],
                [0.5, 0.58],
                [0.38, 0.76],
                [0.12, 0.76]
            ]
        },
        I: {
            outline: [
                [0.08, 0.19],
                [0.92, 0.19],
                [0.92, 0.36],
                [0.67, 0.36],
                [0.67, 0.58],
                [0.92, 0.58],
                [0.92, 0.76],
                [0.08, 0.76],
                [0.08, 0.58],
                [0.33, 0.58],
                [0.33, 0.36],
                [0.08, 0.36]
            ]
        },
        L: {
            outline: [
                [0.15, 0.19],
                [0.5, 0.19],
                [0.5, 0.58],
                [0.92, 0.58],
                [0.92, 0.76],
                [0.15, 0.76]
            ]
        },
        P: {
            outline: [
                [0.14, 0.18],
                [0.7, 0.18],
                [0.88, 0.23],
                [1, 0.35],
                [1, 0.42],
                [0.88, 0.55],
                [0.7, 0.58],
                [0.47, 0.58],
                [0.47, 0.76],
                [0.14, 0.76]
            ],
            cutout: [
                [0.47, 0.35],
                [0.65, 0.35],
                [0.68, 0.38],
                [0.65, 0.42],
                [0.47, 0.42]   
            ]
        },
        A: {
            outline: [
                [0.28, 0.18],
                [0.72, 0.18],
                [1, 0.76],
                [0.68, 0.76],
                [0.63, 0.67],
                [0.38, 0.67],
                [0.33, 0.76],
                [0, 0.76]
            ],
            cutout: [
                [0.5, 0.36],
                [0.58, 0.51],
                [0.42, 0.51]
            ]
        },
        G: {
            outline: [
                [0.5, 0.18],
                [0.72, 0.2],
                [0.89, 0.27],
                [0.95, 0.35],
                [0.95, 0.38],
                [0.62, 0.38],
                [0.55, 0.34],
                [0.46, 0.34],
                [0.39, 0.38],
                [0.39, 0.56],
                [0.46, 0.6],
                [0.55, 0.6],
                [0.63, 0.57],
                [0.64, 0.54],
                [0.54, 0.54],
                [0.54, 0.41],
                [0.95, 0.41],
                [0.95, 0.6],
                [0.85, 0.7],
                [0.7, 0.75],
                [0.6, 0.76],
                [0.4, 0.76],
                [0.3, 0.75],
                [0.15, 0.7],
                [0.06, 0.6],
                [0.06, 0.38],
                [0.06, 0.35],
                [0.12, 0.27],
                [0.29, 0.2]
            ]
        },
        E: {
            outline: [
                [0.1, 0.18],
                [0.9, 0.18],
                [0.9, 0.35],
                [0.42, 0.35],
                [0.42, 0.39],
                [0.85, 0.39],
                [0.85, 0.55],
                [0.42, 0.55],
                [0.42, 0.59],
                [0.9, 0.59],
                [0.9, 0.76],
                [0.1, 0.76]
            ]
        }
    };

    const shapes = [];

    const TEXT_BY_LINE = ["WILL", "PAGE"];
    const textLines = document.querySelectorAll(".title .line");

    const mapPoints = (points, offsetX, offsetY, scaleX, scaleY) => {
        return points.map(([x, y]) => {
            return [(x * scaleX) + offsetX, (y * scaleY) + offsetY]
        })
    };

    const baseRect = title.getBoundingClientRect();

    textLines.forEach((line, index) => {
        const text = TEXT_BY_LINE[index]
        if (!text) {
            return;
        }

        const rect = line.getBoundingClientRect();
        const offsetY = rect.top - baseRect.top;
        const letterWidth = rect.width / text.length;
        const letterHeight = rect.height;
        Array.from(text).forEach((letter, index) => {
            const letterShape = letterShapes[letter];
            if (!letterShape) {
                return;
            }

            const shape = {
                outline: mapPoints(letterShape.outline, letterWidth * index, offsetY, letterWidth, letterHeight),
                cutout: letterShape.cutout && mapPoints(letterShape.cutout, letterWidth * index, offsetY, letterWidth, letterHeight)
            };
            shapes.push(shape);
        });
    });

    const rectBodiesForPoints = (points, inverted) => {
        const bodies = [];
        points.forEach((point, index) => {
            const nextPoint = points[(index + 1) % points.length];
            const dx = nextPoint[0] - point[0];
            const dy = nextPoint[1] - point[1];

            let ix = dy;
            let iy = -dx;
            const len = Math.sqrt((ix * ix) + (iy * iy));
            ix /= len;
            iy /= len;

            if (inverted) {
                ix *= -1;
                iy *= -1;
            }
            
            const factor = 5;

            const verts = Matter.Vertices.clockwiseSort(Matter.Vertices.create([
                { x: 0, y: 0 },
                { x: dx, y: dy },
                { x: dx + (ix * factor), y: dy + (iy * factor)},
                { x: (ix * factor), y: (iy * factor) },
            ]));
            const bounds = Matter.Bounds.create(verts);

            const body = Matter.Bodies.fromVertices(point[0], point[1], verts, { isStatic: true, render: { visible: false } });

            const ox = bounds.min.x - body.bounds.min.x;
            const oy = bounds.min.y - body.bounds.min.y;

            Matter.Body.translate(body, Matter.Vector.create(point[0] + ox, point[1] + oy));

            bodies.push(body);
        })
        return bodies;
    };

    const createLetterBodies = () => {
        let bodies = [];
        shapes.forEach((shape) => {
            bodies = bodies.concat(rectBodiesForPoints(shape.outline, false));
            if (shape.cutout) {
                bodies = bodies.concat(rectBodiesForPoints(shape.cutout, true));
            }
        });
        return bodies;
    };
    
    const engine = Matter.Engine.create();
    const world = engine.world;
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const render = Matter.Render.create({
        canvas,
        engine: engine,
        options: {
            width: canvas.width,
            height: canvas.height,
            background: 'transparent',
            wireframeBackground: 'transparent',
            wireframes: false
        }
    });
    Matter.Render.run(render);

    console.log(window.innerWidth);

    const WIDTH_BREAKPOINT = 641;

    const MAX_BALLS = window.innerWidth < WIDTH_BREAKPOINT ? 800 : 2500;
    const SPAWN_RPS = window.innerWidth < WIDTH_BREAKPOINT ? 100 : 200; 

    const BALL_COLOR = 'rgb(236, 97, 159)';
    const BALL_SIZE = 3;
    const balls = [];

    Matter.Composite.add(world, createLetterBodies());

    const spawners = [
        [0.045, 0.17, 0.03, 0],
        [0.21, 0.17, 0.03, 0],
        [0.125, 0.25, 0.03, 0],
        [0.32, 0.16, 0.027, 1],
        [0.375, 0.16, 0.027, 1],
        [0.43, 0.16, 0.027, 1],
        [0.58, 0.18, 0.037, 2],
        [0.83, 0.18, 0.037, 3],
        [0.075, 0.58, 0.037, 4],
        [0.17, 0.56, 0.025, 4],
        [0.13, 0.56, 0.025, 4],
        [0.347, 0.575, 0.033, 5],
        [0.405, 0.575, 0.033, 5],
        [0.585, 0.576, 0.03, 6],
        [0.64, 0.56, 0.027, 6],
        [0.7, 0.71, 0.033, 6],
        [0.66, 0.685, 0.02, 6],
        [0.815, 0.575, 0.03, 7],
        [0.88, 0.56, 0.02, 7],
        //[0.95, 0.56, 0.02, 7],
    ];
    const maxIndex = Math.max(...spawners.map(s => s[3]));

    const vlen = (p) => Math.sqrt((p.x * p.x) + (p.y * p.y));

    const getSpawnLocation = () => {
        const index = Math.floor(Math.random() * (maxIndex + 1));
        const letterSpawners = spawners.filter(s => s[3] === index);
        const spawner = letterSpawners[Math.floor(Math.random() * letterSpawners.length)];
        
        let p = null;
        while (p == null || vlen(p) > spawner[2]) {
            p = {
                x: ((Math.random() * 2) - 1) * spawner[2],
                y: ((Math.random() * 2) - 1) * spawner[2],
            }
        }
        return { x: (p.x + spawner[0]) * canvas.width, y: (p.y + spawner[1]) * canvas.height };
    };

    const spawnState = { nextSpawn: 0, total: 0 };
    Matter.Events.on(runner, "afterTick", (x) => {
        if (spawnState.total >= MAX_BALLS) {
            return;
        }
        
        const rate = SPAWN_RPS / 1000;
        let t = runner.delta;
        while (t >= spawnState.nextSpawn) {
            t -= spawnState.nextSpawn;
            spawnState.nextSpawn = Math.random() / rate;
            
            const p = getSpawnLocation();
            const ball = Matter.Bodies.circle(p.x, p.y, BALL_SIZE, {
                render: {
                    fillStyle: BALL_COLOR
                },
                restitution: 0.3,
                angle: Math.PI * 2 * Math.random()
            });
            balls.push(ball);
            Matter.Composite.add(world, [ball]);
            spawnState.total += 1;
        }
        spawnState.nextSpawn -= t;
    });

    setTimeout(() => {
        balls.filter(b => {
            const ry = b.position.y / canvas.height;
            return 0.48 <= ry && ry <= 0.52;
        }).forEach(b => Matter.World.remove(world, b));
        setTimeout(() => {
            Matter.Runner.stop(runner);
            Matter.Render.stop(render);
        }, 100);
    }, 20000);
});
