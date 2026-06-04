class Ship {
  constructor(len) {
    this.len = len;
    this.hitted = 0;
  }
  hit() {
    this.hitted += 1;
  }
  isSunk() {
    if (this.hitted >= this.len) {
      return true;
    }
    return false;
  }
}

function createNullMatrix(row, col) {
  const matrix = [];
  for (let i = 0; i < row; i++) {
    matrix[i] = new Array(col).fill(null);
  }
  return matrix;
}

class Gameboard {
  constructor() {
    this.row = 10;
    this.col = 10;
    this.watter = createNullMatrix(this.row, this.col);
  }
  placeAShip(x, y, ship) {
    //place ship in horizontal
    if (x < 0 || x > this.row - 1 || y < 0 || y > this.col - 1) {
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
  canPlace(x, y, ship) {
    for (let i = 0; i < ship.len; i++) {
      if (this.watter[x][y + i]) {
        return false;
      }
    }
    return true;
  }
}

export { Ship, Gameboard };
