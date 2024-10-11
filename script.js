
//Объект Vector
function Vector(x,y) {
    this.x = x;
    this.y = y;
}
Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
}

//Сетка
function Grid(width, height) {
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
}

Grid.prototype.isInside = function(vector) {
    return vector.x >= 0 && vector.x < this.width &&
    vector.y >= 0 && vector.y < this.height;
};

Grid.prototype.get = function(vector) {
    return this.space[vector.x + this.width * vector.y];
};

Grid.prototype.set = function(vector, value) {
    this.space[vector.x + this.width * vector.y] = value;
};
//
//* Вспомогательные функции
//Случайный элемент массива(направление для шага существа)
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
//создание нужного экземпляра, находим конструктор символа и применяем new. Из свойства originChar узнаём изначальный символ
function elementFromChar(legend, ch) {
    if(ch === " ") return null;
    let element = new legend[ch]();
    element.originChar = ch;
    return element;
}

//Объект World
function World(map, legend) {
    let grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend - legend;

    map.forEach((line, y) => {
        for(let x = 0; x < line.length; x++) {
            grid.set(new Vector(x, y),elementFromChar(legend, line[x]))
        }
    })
}


//Объект BouncingCritter
function BouncingCritter() {
    this.direction = randomElement(Object.keys(directions));
}

BouncingCritter.prototype.act = function(view) {
    if(view.look(this.direction) != " ") {
        this.direction = view.find(" ") || "s";
    }
    return {type: "move", direction: this.direction};
}

//Объект с направлениями
let directions = {
    "n": new Vector (0, 1),
    "ne": new Vector(1, 1),
    "e": new Vector(1, 0),
    "se": new Vector(1, -1),
    "s": new Vector(0, -1),
    "sw": new Vector(-1,-1),
    "w": new Vector(-1, 0),
    "nw": new Vector(-1, 1)
}

let grid = new Grid(5,5);
grid.set(new Vector(1,1), "X");
console.log(grid.get(new Vector(1,1,)));