import { Player, Ship } from './game_board.js';
import { Render } from './render.js';
import './style.css';

class Controller {
  constructor() {
    this.player = new Player();
    this.render = new Render();
    this.enemyZone = null;
    this.friendZone = null;
    this.previewCell = [];
    this.shipsElement = null;
    this.chooseableArea = null;
    this.currentShip = null;
    this.confirmBtn = null;
    this.shipList = [2, 3, 3, 4, 5];
    this.resetBtn = null;
    this.attackList = [];
    this.hittedList = [];
    this.x_asix = true;
    this.xAxisBtn = null;
    this.yAxisBtn = null;
    this.highProbabilityPointList = new Set(); // 'xy'

    this.winnerDialog = document.getElementById('winner_dialog'); // in template
    this.winner = document.getElementById('winner'); // in template

    this.firstInit();
  }
  firstInit() {
    this.render.showShipPlacement(this.player.realPlayer, this.shipList);
    this.previewCell = [];
    this.shipsElement = document.querySelectorAll('.ship');
    this.chooseableArea = document.querySelector('.main_board .grid_container');
    this.currentShip = null;
    this.confirmBtn = document.getElementById('confirm');
    this.resetBtn = document.getElementById('reset');
    this.xAxisBtn = document.getElementById('x_axis');
    this.yAxisBtn = document.getElementById('y-axis');
    this.x_asix = true;
    this.bindEventFirst();
  }
  bindEventFirst() {
    this.shipsElement.forEach((ship) => {
      ship.addEventListener('dragstart', () => {
        ship.classList.add('dragging');
        const dragging = document.querySelector('.dragging');
        this.currentShip = new Ship(Number(dragging.dataset.value));
      });
      ship.addEventListener('dragend', () => {
        this.currentShip = null;
        ship.classList.remove('dragging');
      });
    });
    this.chooseableArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      const cell = e.target.closest('.cell');
      if (!cell) return;
      const x = Number(cell.dataset.row);
      const y = Number(cell.dataset.col);
      this.showPreview(x, y, this.currentShip, this.x_asix);
    });
    this.chooseableArea.addEventListener('dragleave', () => {
      this.clearPreview();
    });
    this.chooseableArea.addEventListener('drop', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      if (!this.currentShip) return;
      const x = Number(cell.dataset.row);
      const y = Number(cell.dataset.col);
      const put = this.player.realPlayer.placeAShip(
        x,
        y,
        this.currentShip,
        this.x_asix,
      );
      this.render.renderBoard(this.player.realPlayer, this.chooseableArea);
      const dragging = document.querySelector('.dragging');
      if (put) dragging.remove();
      this.clearPreview();
    });
    this.confirmBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.player.realPlayer.putEnoughShip(this.shipList.length)) {
        alert('you need to put all ship to play');
        return;
      }
      this.placeShipRandomly(this.player.computer, this.shipList, 10, 10);
      this.initAfterChoose();
    });
    this.resetBtn.addEventListener('click', () => {
      this.player = new Player();
      this.firstInit();
    });
    this.xAxisBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.yAxisBtn.classList.remove('clicked');
      this.xAxisBtn.classList.add('clicked');
      this.x_asix = this.xAxisBtn.dataset.axis === 'true' ? true : false;
    });
    this.yAxisBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.yAxisBtn.classList.add('clicked');
      this.xAxisBtn.classList.remove('clicked');
      this.x_asix = this.yAxisBtn.dataset.axis === 'false' ? false : true;
    });
  }
  initAfterChoose() {
    this.render.renderIntoScreen(this.player);
    this.friendZone = document.getElementById('friend');
    this.enemyZone = document.getElementById('enemy');
    this.bindEventAfterChoose();
  }
  bindEventAfterChoose() {
    // realPlayer attack turn
    this.enemyZone.addEventListener('click', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      const x = Number(cell.dataset.row);
      const y = Number(cell.dataset.col);
      const success = this.player.computer.receiveAttack(x, y);
      const hit = this.player.computer.isOccupied(x, y);
      if (!success) return;
      const sunk = this.player.computer.isShipSunk(x, y);
      if (sunk) {
        const cells = this.player.computer.findAdjacentShip(x, y, sunk);
        this.bindClassSunk(cells);
      }
      if (!hit) this.computerAttack();
      this.render.markAttackForCell(cell, hit);
      this.haveWinner();
    });
    this.winnerDialog.addEventListener('close', () => {
      if (this.winnerDialog.returnValue === 'cancel') {
        this.player = new Player();
        this.firstInit();
      }
    });
  }
  randomValidAttack() {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    while (this.player.realPlayer.attacked[x][y] === 1) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    }
    return [x, y];
  }
  // computer attack turn
  attackValid4Dir(x, y) {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (let [dx, dy] of directions) {
      let nx = x + dx;
      let ny = y + dy;
      if (
        nx >= 0 &&
        nx < 10 &&
        ny >= 0 &&
        ny < 10 &&
        this.player.realPlayer.attacked[nx][ny] === 0 &&
        !this.attackList.some(([a, b]) => {
          return a === nx && b === ny;
        })
      ) {
        this.attackList.push([nx, ny]);
      }
    }
  }
  rowValidAttack(point1, point2) {
    const cordinates = [point1, point2];
    const directions = [
      [0, -1],
      [0, 1],
    ];
    for (let [x, y] of cordinates) {
      for (let [dx, dy] of directions) {
        let nx = x + dx;
        let ny = y + dy;
        if (
          nx >= 0 &&
          nx < 10 &&
          ny >= 0 &&
          ny < 10 &&
          this.player.realPlayer.attacked[nx][ny] === 0 &&
          !this.attackList.some(([a, b]) => {
            return a === nx && b === ny;
          })
        ) {
          this.attackList.push([nx, ny]);
        }
      }
    }
  }
  colValidAttack(point1, point2) {
    const cordinates = [point1, point2];
    const directions = [
      [-1, 0],
      [1, 0],
    ];
    for (let [x, y] of cordinates) {
      for (let [dx, dy] of directions) {
        let nx = x + dx;
        let ny = y + dy;
        if (
          nx >= 0 &&
          nx < 10 &&
          ny >= 0 &&
          ny < 10 &&
          this.player.realPlayer.attacked[nx][ny] === 0 &&
          !this.attackList.some(([a, b]) => {
            return a === nx && b === ny;
          })
        ) {
          this.attackList.push([nx, ny]);
        }
      }
    }
  }
  computerDecision() {
    while (this.hittedList.length >= 2) {
      const len = this.hittedList.length;
      const point1 = this.hittedList[len - 1];
      const point2 = this.hittedList[len - 2];
      if (point1[0] === point2[0]) {
        this.rowValidAttack(point1, point2);
        this.hittedList.pop();
        this.hittedList.pop();
      } else if (point1[1] === point2[1]) {
        this.colValidAttack(point1, point2);
        this.hittedList.pop();
        this.hittedList.pop();
      }
    }
    if (this.hittedList.length === 1) {
      let [x, y] = this.hittedList[0];
      this.attackValid4Dir(x, y);
      while (this.attackList.length !== 0) {
        let [x, y] = this.attackList.pop();
        if (this.player.realPlayer.attacked[x][y] === 1) continue;
        return [x, y];
      }
    }
    while (this.hittedList.length > 0) {
      let [x, y] = this.hittedList.pop();
      this.attackValid4Dir(x, y);
    }
    while (this.attackList.length !== 0) {
      let [x, y] = this.attackList.pop();
      if (this.player.realPlayer.attacked[x][y] === 1) continue;
      return [x, y];
    }
    return this.randomValidAttack();
  }
  computerAttack() {
    let [x, y] = this.computerDecision();
    this.player.realPlayer.receiveAttack(x, y);
    const cell = this.friendZone.querySelector(
      `[data-row='${x}'][data-col='${y}']`,
    );
    const hit = this.player.realPlayer.isOccupied(x, y);
    this.render.markAttackForCell(cell, hit);
    if (hit) {
      this.hittedList.push([x, y]);
      if (this.player.realPlayer.isShipSunk(x, y)) {
        this.attackList = [];
      }
      this.computerAttack();
    }
  }
  resetGame() {
    this.player = new Player();
    this.render.renderBoard(this.player.realPlayer, this.friendZone);
    this.render.renderBoard(this.player.computer, this.enemyZone);
    this.bindEventAfterChoose(); // it probaly change
  }
  haveWinner() {
    if (this.player.computer.isAllSunk()) {
      this.winner.textContent = 'Human';
      this.winnerDialog.showModal();
    }
    if (this.player.realPlayer.isAllSunk()) {
      this.winner.textContent = 'Computer';
      this.winnerDialog.showModal();
    }
  }
  showPreview(x, y, ship, x_axis) {
    this.clearPreview();
    let cells = [];
    const dx = x_axis ? 0 : 1;
    const dy = x_axis ? 1 : 0;
    for (let i = 0; i < ship.len; i++) {
      let nx = x + dx * i;
      let ny = y + dy * i;
      if (nx >= 10 || ny >= 10) return;
      const cell = document.querySelector(
        `[data-row='${nx}'][data-col='${ny}']`,
      );
      cells.push(cell);
    }
    const valid = cells.every((c) => {
      return !c.classList.contains('occupied');
    });
    cells.forEach((c) => {
      c.classList.add(valid ? 'preview' : 'invalid');
    });
    this.previewCell = cells;
  }
  clearPreview() {
    this.previewCell.forEach((c) => {
      c.classList.remove('preview', 'invalid');
    });
    this.previewCell = [];
  }
  placeShipRandomly(player, shipList, rightBoundary, bottomBoundary) {
    for (let lenOfShip of shipList) {
      const ship = new Ship(lenOfShip);
      let x = Math.floor(Math.random() * bottomBoundary);
      let y = Math.floor(Math.random() * rightBoundary);
      let x_asix = Math.floor(Math.random() * 2);
      while (!player.placeAShip(x, y, ship, x_asix)) {
        x = Math.floor(Math.random() * bottomBoundary);
        y = Math.floor(Math.random() * rightBoundary);
        x_asix = Math.floor(Math.random() * 2);
      }
    }
  }
  bindClassSunk(cells) {
    for (let [x, y] of cells) {
      const cell = this.enemyZone.querySelector(
        `[data-row='${x}'][data-col='${y}']`,
      );
      if (!cell) return;
      cell.classList.add('sunk');
    }
  }
}

new Controller();
