const roads = [
    "Alisa's house-Bob's house",
    "Alisa's house-PostOffice",
    "Darya's house-Erni's house",
    "Erni's house-Greta's house",
    "Greta's house-Shop",
    "Martet-PostOffice",
    "Market-TownHall",
    "Alisa's house-Warehouse",
    "Bob's house-TownHall",
    "Darya's house-TownHall",
    "Greta's house-Farm",
    "Market-Farm",
    "Market-Shop",
    "Shop-TownHall",
]

const mailRoute = [
    "Alisa's house", "Warehouse", "Alisa's house", "Bob's house",
    "TownHall", "Darya's house", "Erni's house", "Greta's house",
    "Shop", "Greta's house", "Farm", "Market", "Post Office"
];

function buildGraph(edges) {
    let graph = Object.create(null);
    function addEdge(from,to) {
        if (graph[from] == null) {
            graph[from] = [to];
        }
        else {
            graph[from].push(to);
        }
    }
    for ([from, to] of edges.map(r => r.split("-"))) {
        addEdge(from,to);
        addEdge(to, from);
    }
    return graph;
}

const roadGraph = buildGraph(roads)
console.log(roadGraph);

class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }
    move(destination) {
        if(!roadGraph[this.place].includes(destination)) {
            return this;
        }
        else {
            let parcels = this.parcels.map ((p) => {
                if(p.place != this.place) return p;
                else return {place: destination, address: p.address}
            }).filter((p) => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

function runRobot(state, robot, memory) {
    for(let turn = 0;;turn++) {
        if (state.parcels.length == 0) {
            console.log(`Выполнено за ${turn} ходов`);
            break
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Переход в направление ${action.direction}`);
    }
}

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}
function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])}
}

function routeRobot(state, memory) {
    if (memory.length == 0) {
        memory = mailRoute;
    }
    return {direction: memory[0], memory: memory.slice(1)};
}

function findRoute(graph, from, to) {
    let work = [{at: from, route: []}];
    for(let i = 0; i < work.length; i++) {
        let {at, route} = work[i];
        for(let place of graph[at]) {
            if(place == to) return route.concat(place);
            if(!work.some(w => w.at == place)) {
                work.push({at: place, route: route.concat(place)});
            }
        }
    }
}

VillageState.random = function(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        }
        while (place == address) {
            parcels.push({place, address});
        }
    }
    return new VillageState("PostOffice", parcels);
}

runRobot(VillageState.random(), randomRobot)



