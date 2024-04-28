
APPS.push(() => {
    const createColour = (r, g, b) => {
        return r + (g >> 8) + (b >> 16); 
    }

    const randomColour = () => {
        return createColour(
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
        );
    }

    const genNoise = (amount) => (Math.random() - 0.5) * amount


    const clamp = (x, min, max) => {
        return Math.max(Math.min(x, max), min)
    }

    const addNoiseToColour = (colour, amount) => {
        return colour.map(c => clamp(c + genNoise(amount), 0, 1));
    }

    const interpolateColour = (left, right, ratio) => {
        return left.map((c, i) => (c * ratio) + (right[i] * (1 - ratio)));
    }

    const length = (arr) => Math.sqrt(arr.reduce((t, x) => t + (x * x), 0));
    const normalize = (arr) => {
        const len = length(arr);
        return arr.map(x => x / len);
    }

    const getColour = (height, water) => {
        const ranges = [
            [1, [1, 1, 1], [1, 1, 1]],
            [0.9, [1, 1, 1], [1, 1, 1]],
            [0.85, [0.4, 0.4, 0.4], [0.5, 0.5, 0.5]],
            [0.75, [0.3, 0.3, 0.3], [0.2, 0.2, 0.2]],
            [0.65, [0.05, 0.3, 0.05], [0.8, 0.7, 0.4]],
            [0.55, [0.15, 0.5, 0.15], [0.8, 0.7, 0.4]],
            [0.3, [0.3, 0.9, 0.3], [0.9, 0.8, 0.5]]
        ]

        const noiseAmp = 0.05;
        const waterThreshold = 0.2;

        let lastHeight;
        let lastColour;
        let lastWaterColour;
        for (let [h, colour, waterColour] of ranges) {
            if (height > h) {
                let left, right;
                if (water > waterThreshold) {
                    left = lastWaterColour ?? lastColour;
                    right = waterColour ?? colour;
                } else {
                    left = lastColour;
                    right = colour;
                }
                if (left === undefined) {
                    return addNoiseToColour(right, noiseAmp);
                } else {
                    return addNoiseToColour(interpolateColour(left, right, (height - h) / (lastHeight - h)), noiseAmp);
                }
            }
            lastHeight = h;
            lastColour = colour;
            lastWaterColour = waterColour;
        }
        return addNoiseToColour(water > waterThreshold ? lastWaterColour : lastColour, noiseAmp);
    }

    const createHexGridMesh = (scene, heightMap, scale, maxHeight, waterMesh) => {
        const vertices = [];
        const normals = [];
        const colors = [];
        const indices = [];

        heightMap.vertices.map((vert, ii) => {
            const [x, y] = vert.coords;
            vertices.push(x * scale, y * scale, (vert.height + (waterMesh ? vert.water : 0)) * scale);

            let normal = [0, 0, 0];
            vert.connections.forEach((nindex) => {
                const nvert = heightMap.vertices[nindex];
                const ndiff = normalize([nvert.coords[0] - x, nvert.coords[1] - y, nvert.height - vert.height]);
                let nnorm = ndiff.map((x, i) => x / 2);
                nnorm[2] -= ndiff[2];
                if (nnorm[2] < 0) {
                    nnorm = nnorm.map(x => -x);
                }
                nnorm.forEach((x, i) => normal[i] += x);
            });
            normal = normalize(normal);
            if (normal[2] < 0) {
                normal = normal.map(x => -x);
            }
            if (ii === 100) {
                console.log(normal);
            }
            normals.push(...normal);

            if (waterMesh) {
                colors.push(0.4, 0.7, 0.7, Math.min(vert.water, 1) * 0.8);
            } else {
                let grey = vert.height / maxHeight;
                //colors.push(grey * 0.8, grey, grey * 0.8, 1);
                colors.push(...getColour(vert.height / maxHeight, vert.water), 1);
                //colors.push(0.5, 0.5, 0.5, 1)
            }

            //const gray = vert.height / 30;
            //colors.push(gray, gray, gray + vert.water);
            //colors.push(Math.abs(x / heightMap.radius), Math.abs(y / heightMap.radius), Math.abs((x * y) / (heightMap ** 2)));
            //colors.push(Math.sin(x * y * scale * scale * 0.3), Math.cos(x * y * scale * scale * 0.3), 1);
        });

        Object.values(heightMap.hexagons).forEach(hex => {
            const centre = hex.vertices[6];
            const triangles = [
                hex.vertices[0], hex.vertices[1], centre,
                hex.vertices[1], hex.vertices[2], centre,
                hex.vertices[2], hex.vertices[3], centre,
                hex.vertices[3], hex.vertices[4], centre,
                hex.vertices[4], hex.vertices[5], centre,
                hex.vertices[5], hex.vertices[0], centre
            ];
            indices.push(...triangles);
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setIndex( indices );
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 4 ) );

        const material = new THREE.MeshPhongMaterial( {
            side: THREE.DoubleSide,
            vertexColors: true,
            transparent: waterMesh || false
        } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        return mesh;
    }

    const createTreeMesh = (scene, heightMap, scale, maxHeight) => {
        const vertices = [];
        const normals = [];
        const colors = [];
        const indices = [];

        heightMap.vertices.map((vert) => {
            const [x, y] = vert.coords;
            const height = vert.height / maxHeight;

            // create tree
            if (0.5 <= height && height <= 0.72 && vert.water < 0.5) {
                for (let j = 0; j < 2; j++) {
                    const tx = (x * scale) + ((Math.random() - 0.5) * 0.4 * scale);
                    const ty = (y * scale) + ((Math.random() - 0.5) * 0.4 * scale);
                    const baseheight = vert.height * scale;
                    const theight = baseheight + ((1 + (Math.random() * 0.5)) * scale);
                    const twidth = (0.5 + (Math.random() * 0.2)) * scale;
                    const halfw = twidth / 2;
                    
                    const dx = Math.random();
                    const dy = Math.sqrt(1 - (dx * dx));
                    const idx = -dy;
                    const idy = dx;

                    const index = vertices.length;

                    vertices.push(tx, ty, theight);
                    vertices.push(tx + (dx * halfw), ty + (dy * halfw), baseheight);
                    vertices.push(tx - (dx * halfw), ty - (dy * halfw), baseheight);

                    for (let i = 0; i < 3; i++) { normals.push(idx, idy, 0); }
                    
                    vertices.push(tx, ty, theight);
                    vertices.push(tx + (idx * halfw), ty + (idy * halfw), baseheight);
                    vertices.push(tx - (idx * halfw), ty - (idy * halfw), baseheight);

                    for (let i = 0; i < 3; i++) { normals.push(dx, dy, 0); }

                    const colour = [0.05 + (Math.random() * 0.15), 0.3 + (Math.random() * 0.2), 0.05 + (Math.random() * 0.15), 0.9];
                    for (let i = 0; i < 6; i++) { colors.push(...colour); }

                    indices.push(index, index + 1, index + 2);
                    indices.push(index + 3, index + 4, index + 5);
                }
            }
            
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setIndex( indices );
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 4 ) );

        const material = new THREE.MeshPhongMaterial( {
            side: THREE.DoubleSide,
            vertexColors: true,
            transparent: false,
            shininess: 10,
            reflectivity: 0.5
        } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        return mesh;
    }

    const HEX_COEF = Math.sqrt(3) / 2;

    const createHexHeightMap = (func, radius) => {
        const hexagons = {};
        const vertices = [];

        const getHexKey = (hx, hy) => `${hx}:${hy}`
        const getHexData = (hx, hy) => hexagons[getHexKey(hx, hy)];
        const getHex = (x, y, z) => [x + z, y - z];
        const getVertex = (x, y, z, vert) => {
            const [hx, hy] = getHex(x, y, z);
            const hex = getHexData(hx, hy);
            if (hex) {
                return hex.vertices[vert];
            }
            return undefined;
        };
        const createVertex = (x, y, z, vert) => {
            const [hx, hy] = getHex(x, y, z);
            let rx = (hx * HEX_COEF * 2) + (hy * HEX_COEF);
            let ry = hy * 1.5;

            if (vert === -1) {
                // central vertex
            } else if (vert === 0) {
                ry += 1;
            } else if (vert === 1) {
                rx += HEX_COEF;
                ry += 0.5;
            } else if (vert === 2) {
                rx += HEX_COEF;
                ry -= 0.5;
            } else if (vert === 3) {
                ry -= 1;
            } else if (vert === 4) {
                rx -= HEX_COEF;
                ry -= 0.5;
            } else {
                rx -= HEX_COEF;
                ry += 0.5;
            }

            const index = vertices.length;
            vertices.push({ coords: [rx, ry], connections: [], fullConnections: [], index, water: 0, height: func(rx, ry) });
            return index;
        };
        const connect = (v1, v2, extended) => {
            const vert1 = vertices[v1];
            const vert2 = vertices[v2];

            if (extended) {
                if (!vert1.fullConnections.includes(v2)) {
                    vert1.fullConnections.push(v2);
                }
        
                if (!vert2.fullConnections.includes(v1)) {
                    vert2.fullConnections.push(v1);
                }
            } else {
                if (!vert1.connections.includes(v2)) {
                    vert1.connections.push(v2);
                }
        
                if (!vert2.connections.includes(v1)) {
                    vert2.connections.push(v1);
                }
            }
        };

        const iterateRing = (r, func) => {
            if (r === 0) {
                func(0, 0, 0);
            } else {
                let p = [-r, 0, 0];
                for (let j = 0; j < 6; j++) {
                    for (let i = 0; i < r; i++) {
                        if (j < 3) {
                            p[(j + 2) % 3]++;
                        } else {
                            p[(j + 2) % 3]--;
                        }
                        func(...p);
                    }
                }
            }
        }

        const iterateCircle = (r, func) => {
            for (let ring = 0; ring <= r; ring++) {
                iterateRing(ring, func);
            }
        }

        iterateCircle(radius, (x, y, z) => {
            const [hx, hy] = getHex(x, y, z);
            const vertexHexagons = [
                [ [0, 0, -1, 2], [0, 1, 0, 4] ],
                [ [0, 1, 0, 3], [1, 0, 0, 5] ],
                [ [1, 0, 0, 4], [0, 0, 1, 0] ],
                [ [0, 0, 1, 5], [0, -1, 0, 1] ],
                [ [0, -1, 0, 0], [-1, 0, 0, 2] ],
                [ [-1, 0, 0, 1], [0, 0, -1, 3] ],
            ];

            const vertices = vertexHexagons
                .map(([h1, h2]) => [[h1[0] + x, h1[1] + y, h1[2] + z, h1[3]], [h2[0] + x, h2[1] + y, h2[2] + z, h2[3]]])
                .map(([h1, h2]) => getVertex(...h1) ?? getVertex(...h2))
                .map((vertex, index) => vertex ?? createVertex(x, y, z, index));

            const centre = createVertex(x, y, z, -1);

            vertices.forEach((v, i) => {
                connect(centre, v);
                connect(v, vertices[(i + 1) % vertices.length]);
            })

            vertices.push(centre);

            for (let v1 = 0; v1 < vertices.length; v1++) {
                for (let v2 = 0; v2 < v1; v2++) {
                    connect(vertices[v1], vertices[v2], true);
                }
            }

            hexagons[getHexKey(hx, hy)] = { hx, hy, vertices };
        });

        return { vertices, hexagons, radius };
    }

    const smoothHeightMap = (heightMap) => {
        const bias = 3;
        const vertices = heightMap.vertices;
        const avgs = vertices.map(vert => {
            const sum = (vert.height * bias) + (vert.connections.reduce((t, c) => t + vertices[c].height, 0));
            return sum / (bias + vert.connections.length);
        });

        vertices.forEach((vert, i) => { vert.height = avgs[i] });
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    const skyColor = '#0xB1E1FF';
    const skyIntensity = 0.3;
    const hemilight = new THREE.HemisphereLight(skyColor, undefined, skyIntensity);
    scene.add(hemilight);

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set( -50, -50, 50);
    light.target.position.set(0, 0, 0);
    scene.add( light );
    scene.add( light.target );

    const toyContent = document.getElementById('toy-content');
    const toyRect = toyContent.getBoundingClientRect();

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(toyRect.width, toyRect.height);
    toyContent.appendChild(renderer.domElement);

    NOISE.seed(Math.random());
    const octaves = 4;
    const roughness = 1.8;
    const persistance = 0.37;

    const getNoise = (x, y) => {
        let noise = 0;
        let freq = 1;
        let factor = 1;
        for (let i = 0; i < octaves; i++) {
            noise = noise + (NOISE.simplex2(x * freq * i * 0.72354, y * freq * i * 0.72354) + 1) * 0.5 * factor;
            factor *= persistance;
            freq *= roughness;
        }
        return noise ** 1.5;
    }
    
    const maxHeight = 30;
    const heightMap = createHexHeightMap((x, y) => {
        return getNoise(x * 0.015, y * 0.015) * maxHeight;
    }, 50);
    for (let i = 0; i < 3; i++) {
        smoothHeightMap(heightMap);
    }
    //const original = createHexGridMesh(scene, heightMap, 0.7, maxHeight);

    for (let i = 0; i < 0; i++) {
        SIMULATE.dropParticle(heightMap, 0.5, 0.5, 0.25);
        //SIMULATE.dropParticle(heightMap, 0.015, 0.1, 1);
    }
    SIMULATE.fillWaterIterate(heightMap, 0.005, 1, 0.003, 0.6, 0.1, 1);
    /*for (let i = 0; i < 20000; i++) {
        SIMULATE.dropParticle(heightMap, 0.2, 0.05, 0.03, 0.1);
    }*/

    const scale = 0.9;
    const grid = createHexGridMesh(scene, heightMap, scale, maxHeight);
    const water = createHexGridMesh(scene, heightMap, scale, maxHeight, true);
    const trees = createTreeMesh(scene, heightMap, scale, maxHeight);

    /*original.rotation.x -= 1;
    original.rotation.z += 0.2;
    original.position.x -= 50;*/

    grid.rotation.x -= 1;
    grid.rotation.z += 0.2;
    grid.position.y += 3;
    //grid.position.x += 50;

    water.rotation.x -= 1;
    water.rotation.z += 0.2;
    water.position.y += 3;
    //water.position.x += 50;

    trees.rotation.x -= 1;
    trees.rotation.z += 0.2;
    trees.position.y += 3;
    //trees.position.x += 50;

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);

        //grid.rotation.x += 0.01;
        grid.rotation.z += 0.002;
        water.rotation.z += 0.002;
        trees.rotation.z += 0.002;
        //original.rotation.z += 0.002;
    };

    animate();
});