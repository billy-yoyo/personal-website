

APPS.push(() => {
    const TEXT = 'WILL PAGE';

    const EPSILON = 0.0001;
    const nearlyEqual = (x, y) => {
        return Math.abs(x - x) <= EPSILON;
    };

    const titleContainer = document.getElementById('title-container');
    const titleCanvas = document.getElementById('title-canvas');
    const ctx = titleCanvas.getContext('2d');
    const titleText = document.getElementById('title');
    const state = {
        letterPoints: [],
        floatingPoints: undefined,
        lastTick: undefined,
        nextPoint: undefined
    };

    const letterLines = {
        'W': [
            [0.15, 0.25, 0.25, 0.7],
            [0.25, 0.7, 0.5, 0.4],
            [0.5, 0.4, 0.75, 0.7],
            [0.75, 0.7, 0.85, 0.26]
        ],
        'I': [
            [0.15, 0.25, 0.85, 0.25],
            [0.5, 0.25, 0.5, 0.65],
            [0.15, 0.7, 0.85, 0.7]
        ],
        'L': [
            [0.3, 0.25, 0.3, 0.65],
            [0.3, 0.7, 0.75, 0.7]
        ],
        'P': [
            [0.3, 0.25, 0.6, 0.25],
            [0.6, 0.25, 0.85, 0.35],
            [0.85, 0.35, 0.73, 0.45],
            [0.3, 0.5, 0.6, 0.5],
            [0.3, 0.25, 0.3, 0.7]
        ],
        'A': [
            [0.4, 0.25, 0.2, 0.7],
            [0.6, 0.25, 0.8, 0.7],
            [0.25, 0.6, 0.75, 0.6]
        ],
        'G': [
            [0.4, 0.25, 0.6, 0.25],
            [0.8, 0.3, 0.6, 0.25],
            [0.25, 0.3, 0.4, 0.25],
            [0.25, 0.3, 0.25, 0.6],
            [0.4, 0.68, 0.25, 0.6],
            [0.4, 0.68, 0.6, 0.68],
            [0.8, 0.6, 0.6, 0.68],
            [0.8, 0.6, 0.8, 0.5],
            [0.6, 0.5, 0.8, 0.5],
        ],
        'E': [
            [0.25, 0.25, 0.75, 0.25],
            [0.25, 0.48, 0.75, 0.48],
            [0.25, 0.7, 0.75, 0.7],
            [0.25, 0.25, 0.25, 0.68]
        ]
    }

    const generateLetterPoints = () => {
        const containerRect = titleContainer.getBoundingClientRect();
        const rect = titleText.getBoundingClientRect();

        const rectOffsetX = rect.left - containerRect.left;
        const rectOffsetY = rect.top - containerRect.top;

        const letters = TEXT;
        const letterWidth = rect.width / letters.length;
        const letterHeight = rect.height;
        const points = [];
        
        Array.from(letters).forEach((letter, index) => {
            if (!letterLines[letter]) {
                return;
            }
            
            const lines = letterLines[letter];
            const top = rectOffsetY;
            const left = rectOffsetX + (index * letterWidth);
            const stepSize = 2;

            lines.forEach(line => {
                let [sx, sy, ex, ey] = line;

                sx *= letterWidth;
                ex *= letterWidth;

                sy *= letterHeight;
                ey *= letterHeight;

                const dx = ex - sx;
                const dy = ey - sy;
                const len = Math.sqrt((dx * dx) + (dy * dy));
                let cur = 0;
                while (cur < len + stepSize) {
                    let t = cur >= len + stepSize ? len : cur;
                    let cx = sx + ((dx * t) / len);
                    let cy = sy + ((dy * t) / len);
                    points.push([cx + left, cy + top, 0]);
                    cur += stepSize;
                }
            })
        });

        state.letterPoints = points;
        if (state.floatingPoints === undefined) {
            initPointGrid();
        }
    };

    const getRandomTarget = (x, y) => {
        const [tx, ty] = state.letterPoints[Math.floor(Math.random() * state.letterPoints.length)];
        const dx = tx - x;
        const dy = ty - y;
        const len = Math.sqrt((dx * dx) + (dy * dy));
        return [dx / len, dy / len, len];
    };

    MAX_TARGETS = 5;

    const getPointTarget = (x, y) => {
        let [ref, closest, closestDist] = [null, null, null];
        state.letterPoints.forEach((t) => {
            const [tx, ty, count] = t;
            if (count >= MAX_TARGETS) {
                return;
            }

            const dx = tx - x;
            const dy = ty - y;
            const len = Math.sqrt((dx * dx) + (dy * dy));

            if (closestDist === null || len + (Math.random() * 15) < closestDist) {
                ref = t;
                closest = [dx / len, dy / len, len];
                closestDist = len;
            }
        });
        if (ref) {
            ref[2] += 1;
        }
        return closest;
    };

    const initPointGrid = () => {
        const cellSize = 12;
        const rect = titleContainer.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const points = [];

        for (let gx = 0; gx <= Math.floor(width / cellSize); gx++) {
            for (let gy = 0; gy < Math.floor(height / cellSize); gy++) {
                const x = (gx * cellSize) + (Math.random() * cellSize);
                const y = (gy * cellSize) + (Math.random() * cellSize);
                let target = getPointTarget(x, y);
                if (!target) {
                    break;
                }
                const [dx, dy, len] = target;
                points.push([x, y, dx, dy, len]);
            }
        }

        state.floatingPoints = points;
        state.lastTick = new Date().getTime();
    };

    const addPoints = (dt) => {
        if (state.letterPoints.every(([_, __, count]) => count >= MAX_TARGETS)) {
            return;
        }

        const rate = 2;
        const rect = titleContainer.getBoundingClientRect();
        if (state.nextPoint === undefined) {
            state.nextPoint = Math.random() / rate;
        }

        while (dt >= state.nextPoint) {
            dt -= state.nextPoint;
            state.nextPoint = Math.random() / rate;

            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            const target = getPointTarget(x, y);
            if (!target) {
                return;
            }
            const [dx, dy, len] = target;
            state.floatingPoints.push([x, y, dx, dy, len]);
        }

    };


    const renderPoints = () => {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = '#000d';
        ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        ctx.restore();
        
        ctx.fillStyle = 'white';
        state.floatingPoints.forEach(([x, y, dx, dy, len]) => {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    const GAP = 2;

    const movePoints = (dt) => {
        const speed = 0.09 * dt;
        const nextPoints = [];
        state.floatingPoints.forEach((p) => {
            const [x, y, dx, dy, remaining] = p;
            let curSpeed = speed;
            let nextRemaining = remaining - curSpeed;

            if (remaining <= GAP) {
                if (nearlyEqual(remaining, GAP)) {
                    nextPoints.push([x, y, dx, dy, remaining]);
                }

                // move up to the gap
                curSpeed = (remaining - GAP);
                nextRemaining = GAP;
                return;
            }

            const vx = dx * curSpeed;
            const vy = dy * curSpeed;

            nextPoints.push([x + vx, y + vy, dx, dy, nextRemaining]);
        });
        state.floatingPoints = nextPoints;
    };

    const loop = () => {
        const tick = new Date().getTime();
        const elapsed = tick - state.lastTick;
        state.lastTick = tick;

        addPoints(elapsed);
        movePoints(elapsed);
        renderPoints();
    };

    const resizeCanvas = () => {
        const rect = titleContainer.getBoundingClientRect();
        console.log(`resizing to ${rect.width}, ${rect.height}`)
        titleCanvas.width = rect.width;
        titleCanvas.height = rect.height;

        generateLetterPoints();

    };

    resizeCanvas();
    window.addEventListener('resize', () => resizeCanvas());

    
    setInterval(loop, 10);
});