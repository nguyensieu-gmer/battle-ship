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
    this.ships = 0;
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
}

class Player {
  constructor() {
    this.realPlayer = new Gameboard();
    this.computer = new Gameboard();
  }
}

export { Ship, Gameboard, Player };
