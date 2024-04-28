
const SIMULATE = (() => {
    const module = {};

    const lowestConnectionAbstract = (vertex, hexHeightMap, getHeight) => {
        let connection = undefined;
        vertex.connections.forEach(index => {
            const conn = hexHeightMap.vertices[index];
            if (getHeight(conn) < getHeight(vertex) && (connection === undefined || getHeight(conn) < getHeight(connection))) {
                connection = conn;
            }
        });
        return connection;
    }

    const lowestConnection = (vertex, hexHeightMap) => lowestConnectionAbstract(vertex, hexHeightMap, v => v.height);
    const lowestConnectionWithWater = (vertex, hexHeightMap) => lowestConnectionAbstract(vertex, hexHeightMap, v => v.height + v.water);

    const dot = (u, v) => {
        return (u[0]*v[0]) + (u[1]*v[1]) + (u[2]*v[2]);
    }

    const unit = (v) => {
        const length = dot(v,v);
        return v.map(x => length < 0.001 ? x : x / length);
    }

    const minus = (u, v) => {
        return u.map((x, i) => x - v[i]);
    }

    const verticalNormal = (start, end) => {
        const v1 = minus(end, start);
        const v2 = minus(end, [start[0], start[1], end[2]]);
        const normal = minus(v2, v1.map(x => x * 0.5));
        return unit(normal);
    }

    module.dropParticle = (hexHeightMap, erosionRate, depositRate, iterationScale) => {
        const hexkeys = Object.keys(hexHeightMap.hexagons);
        const hexkey = hexkeys[Math.floor(Math.random() * hexkeys.length)];
        const hex = hexHeightMap.hexagons[hexkey];
        const vertexIndex = Math.floor(Math.random() * 7);

        let vertex = hexHeightMap.vertices[hex.vertices[vertexIndex]];
        let sediment = 0;

        let visited = {};
        let lowest = lowestConnection(vertex, hexHeightMap);
        let index = 0;
        while (lowest && !visited[lowest.index]) {
            visited[vertex.index] = true;

            const normal = verticalNormal([...vertex.coords, vertex.height], [...lowest.coords, lowest.height]);
            const deposit = sediment * depositRate * normal[2];
            const erosion = erosionRate * (1 - normal[2]) * Math.min(1, index * iterationScale);

            vertex.height += deposit - erosion;
            sediment += erosion - deposit;

            vertex = lowest;
            lowest = lowestConnection(vertex, hexHeightMap);
            index++;
        }
        
        vertex.height += Math.max(0, Math.min(0.01, sediment));
    }

    module.fillWater = (hexHeightMap, erosionStep, erosionMax, riverStep, riverMax, lakeStep) => {
        const pathHash = {};
        const endVertices = {};
        const tracePath = (vert) => {
            if (pathHash[vert.index]) {
                return pathHash[vert.index];
            } else {
                const lowest = lowestConnectionWithWater(vert, hexHeightMap);
                if (lowest) {
                    return [vert, ...tracePath(lowest)];
                } else {
                    if (!endVertices[vert.index]) {
                        endVertices[vert.index] = 0;
                    }
                    endVertices[vert.index]++;
                    return [vert];
                }
            }
        };

        const findRootLowest = (vert) => {
            const lowest = lowestConnectionWithWater(vert, hexHeightMap);
            if (lowest) {
                return findRootLowest(lowest);
            } else {
                return vert;
            }
        }

        Object.values(hexHeightMap.hexagons).forEach(hex => {
            hex.vertices.forEach(vindex => {
                const vert = hexHeightMap.vertices[vindex];
                vert.steps = 0;
            });
        });

        Object.values(hexHeightMap.hexagons).forEach(hex => {
            hex.vertices.forEach(vindex => {
                const vert = hexHeightMap.vertices[vindex];
                const path = tracePath(vert);

                path.forEach(subvert => {
                    subvert.steps++;
                });
            });
        });

        Object.values(hexHeightMap.hexagons).forEach(hex => {
            hex.vertices.forEach(vindex => {
                const vert = hexHeightMap.vertices[vindex];
                vert.water += Math.min(vert.steps * riverStep, riverMax);

                const erosion = Math.min(vert.steps * erosionStep, erosionMax);
                vert.height -= erosion;
                
                //const erosionOverflow = Math.max(erosion - erosionMax, 0);
                //const erosionActual = Math.min(erosion, erosionMax);

                // apply half of overflow, at a max of 50% of erosionMax to neighbours
                //const neighbourErosion = Math.min(erosionOverflow / vert.connections.length, erosionMax / (2 * vert.connections.length));
                //vert.connections.forEach(conn => hexHeightMap.vertices[conn].height -= neighbourErosion);
            });
        });

        Object.entries(endVertices).forEach(([vindex, visited]) => {
            const vert = hexHeightMap.vertices[vindex];
            for (let i = 0; i < visited; i++) {
                const lowest = findRootLowest(vert);
                lowest.water += lakeStep;
            }
        });
    }

    module.fillWaterIterate = (hexHeightMap, erosionStep, erosionMax, riverStep, riverMax, lakeStep, iterations) => {
        const scale = 1 / iterations;
        for (let i = 0; i < iterations; i++) {
            module.fillWater(hexHeightMap, erosionStep * scale, erosionMax * scale, riverStep * scale, riverMax * scale, lakeStep * scale);
        }
    }

    return module;
})();