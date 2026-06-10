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
}

class Player {
  constructor() {
    this.realPlayer = new Gameboard();
    this.computer = new Gameboard();
    this.putship();
  }
  putship() {
    // this.realPlayer.placeAShip(0, 0, new Ship(2));
    // this.realPlayer.placeAShip(3, 5, new Ship(3));
    // this.realPlayer.placeAShip(9, 4, new Ship(3));
    // this.realPlayer.placeAShip(7, 3, new Ship(4));
    // this.realPlayer.placeAShip(5, 5, new Ship(5));

    this.computer.placeAShip(0, 0, new Ship(2));
    this.computer.placeAShip(3, 5, new Ship(3));
    this.computer.placeAShip(9, 4, new Ship(3));
    this.computer.placeAShip(7, 3, new Ship(4));
    this.computer.placeAShip(5, 5, new Ship(5));
  }
}

export { Ship, Gameboard, Player };
