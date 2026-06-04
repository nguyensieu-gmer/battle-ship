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
