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
    this.watter = createNullMatrix(this.row, this.col, null);
    this.visited = new Set(); // "x,y" same typo
  }
  placeAShip(x, y, ship) {
    //place ship in horizontal
    if (!this.isInOfBound(x, y)) {
      return;
    }
    if (y + ship.len - 1 > this.row - 1) {
      return;
    }
    if (!this.canPlace(x, y, ship)) {
      return;
    }
    for (let i = 0; i < ship.len; i++) {
      this.watter[x][y + i] = ship;
    }
  }
  isInOfBound(x, y) {
    if (x < 0 || x > this.row - 1 || y < 0 || y > this.col - 1) {
      return false;
    }
    return true;
  }
  canPlace(x, y, ship) {
    for (let i = 0; i < ship.len; i++) {
      if (this.watter[x][y + i]) {
        return false;
      }
    }
    return true;
  }
  receiveAttack(x, y) {
    if (!this.isInOfBound(x, y)) {
      return;
    }
    let key = `${x},${y}`;
    if (this.visited.has(key)) {
      return;
    }
    this.visited.add(key);
    if (this.watter[x][y]) {
      this.watter[x][y].hit();
    }
  }
}

export { Ship, Gameboard };
