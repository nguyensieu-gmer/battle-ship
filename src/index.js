import { Player, Ship } from './game_board.js';
import { Render } from './render.js';
import './style.css';

class Controller {
  constructor() {
    this.player = new Player();
    this.render = new Render();
    this.enemyZone = null; // after render competion
    this.friendZone = null; //  after render competion
    this.previewCell = [];
    this.shipsElement = null;
    this.chooseableArea = null;
    this.currentShip = null;
    this.confirmBtn = null;
    this.shipList = [2, 3, 3, 4, 5];
    this.resetBtn = null;

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
      this.showPreview(x, y, this.currentShip);
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
      const put = this.player.realPlayer.placeAShip(x, y, this.currentShip);
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
      this.computerAttack();
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
  randomAttack() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return [x, y];
  }
  // computer attack turn
  computerAttack() {
    let [x, y] = this.randomAttack();
    while (this.player.realPlayer.attacked[x][y] === 1) {
      [x, y] = this.randomAttack();
    }
    this.player.realPlayer.receiveAttack(x, y);
    const cell = this.friendZone.querySelector(
      `[data-row='${x}'][data-col='${y}']`,
    );
    const hit = this.player.realPlayer.isOccupied(x, y);
    this.render.markAttackForCell(cell, hit);
  }
  // notice when it change after intergrate
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
  showPreview(x, y, ship) {
    this.clearPreview();
    let cells = [];
    for (let i = 0; i < ship.len; i++) {
      let nx = x;
      let ny = y + i;
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
  // can be change if it can be put ship in y-axis
  placeShipRandomly(player, shipList, rightBoundary, bottomBoundary) {
    for (let lenOfShip of shipList) {
      const ship = new Ship(lenOfShip);
      let x = Math.floor(Math.random() * bottomBoundary);
      let y = Math.floor(Math.random() * rightBoundary);
      while (!player.placeAShip(x, y, ship)) {
        x = Math.floor(Math.random() * bottomBoundary);
        y = Math.floor(Math.random() * rightBoundary);
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
