class Ship {
  constructor(len) {
    this.len = len;
    this.hitted = 0;
  }
  hit() {
    if (this.isSunk()) return;
    this.hitted += 1;
  }
  isSunk() {
    if (this.hitted >= this.len) {
      return true;
    }
    return false;
  }
}

function createNullMatrix(row, col, value) {
  const matrix = [];
  for (let i = 0; i < row; i++) {
    matrix[i] = new Array(col).fill(value);
  }
  return matrix;
}

class Gameboard {
  constructor() {
    this.row = 10;
    this.col = 10;
    this.water = createNullMatrix(this.row, this.col, null);
    this.attacked = createNullMatrix(this.row, this.col, 0);
    this.occupied = createNullMatrix(this.row, this.col, 0);
    this.ships = 0;
  }
  isShipSunk(x, y) {
    if (this.water[x][y] && this.water[x][y].isSunk()) {
      return this.water[x][y];
    }
    return null;
  }
  occupyACell(x, y) {
    this.occupied[x][y] = 1;
  }
  isOccupied(x, y) {
    return this.occupied[x][y] === 1;
  }
  addShips() {
    this.ships++;
  }
  reduceShips() {
    this.ships--;
  }
  placeAShip(x, y, ship) {
    //place ship in horizontal
    if (!this.isInOfBound(x, y)) {
      return false;
    }
    if (y + ship.len - 1 > this.col - 1) {
      return false;
    }
    if (!this.canPlace(x, y, ship)) {
      return false;
    }
    for (let i = 0; i < ship.len; i++) {
      this.water[x][y + i] = ship;
      this.occupyACell(x, y + i);
    }
    this.addShips();
    return true;
  }
  isInOfBound(x, y) {
    if (x < 0 || x > this.row - 1 || y < 0 || y > this.col - 1) {
      return false;
    }
    return true;
  }
  canPlace(x, y, ship) {
    for (let i = 0; i < ship.len; i++) {
      if (this.water[x][y + i]) {
        return false;
      }
    }
    return true;
  }
  receiveAttack(x, y) {
    if (!this.isInOfBound(x, y)) {
      return false;
    }
    if (this.attacked[x][y] === 1) {
      return false;
    }
    this.attacked[x][y] = 1;
    let ship = this.water[x][y];
    if (ship) {
      ship.hit();
      if (ship.isSunk()) {
        this.reduceShips();
      }
    }
    return true;
  }
  isAllSunk() {
    return this.ships === 0;
  }
  putEnoughShip(maxAmountOfShip) {
    return this.ships === maxAmountOfShip;
  }
  findAdjacentShip(x, y, ship) {
    const cells = [];
    const visited = createNullMatrix(this.row, this.col, 0);
    const directions = [
      [0, 1], // phải
      [0, -1], // trái
      [1, 0], // xuống
      [-1, 0], // lên
    ];
    const dfs = (x, y, ship) => {
      cells.push([x, y]);
      visited[x][y] = 1;
      for (let [dx, dy] of directions) {
        const x1 = x + dx;
        const y1 = y + dy;
        if (
          x1 >= 0 &&
          x1 < this.row &&
          y1 >= 0 &&
          y1 < this.col &&
          this.water[x1][y1] === ship &&
          visited[x1][y1] === 0
        ) {
          dfs(x1, y1, ship);
        }
      }
    };
    dfs(x, y, ship);
    return cells;
  }
}

class Player {
  constructor() {
    this.realPlayer = new Gameboard();
    this.computer = new Gameboard();
  }
}

export { Ship, Gameboard, Player };
