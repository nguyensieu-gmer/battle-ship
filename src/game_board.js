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
    this.addShips();
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
    if (this.ships > 0) this.ships -= 1;
    this.visited.add(key);
    let ship = this.watter[x][y];
    if (ship) {
      ship.hit();
      if (ship.isSunk()) {
        this.reduceShips();
      }
    }
  }
  isAllSunk() {
    return this.ships === 0;
  }
}

class Player {
  constructor() {
    this.realPlayer = new Gameboard();
    this.computer = new Gameboard();
    this.putPlace();
  }
  putPlace() {
    this.realPlayer.placeAShip(0, 0, new Ship(2));
    this.realPlayer.placeAShip(3, 5, new Ship(3));
    this.realPlayer.placeAShip(9, 4, new Ship(3));
    this.realPlayer.placeAShip(7, 3, new Ship(4));
    this.realPlayer.placeAShip(5, 5, new Ship(5));

    this.computer.placeAShip(0, 0, new Ship(2));
    this.computer.placeAShip(3, 5, new Ship(3));
    this.computer.placeAShip(9, 4, new Ship(3));
    this.computer.placeAShip(7, 3, new Ship(4));
    this.computer.placeAShip(5, 5, new Ship(5));
  }
}

export { Ship, Gameboard, Player };
