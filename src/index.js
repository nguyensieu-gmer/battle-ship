import { Player, Ship } from './game_board.js';
import { Render } from './render.js';
import './style.css';

class Controller {
  constructor() {
    this.player = new Player();
    this.render = new Render();
    this.enemyZone = null; // after render competion
    this.friendZone = null; //  after render competion

    this.winnerDialog = document.getElementById('winner_dialog'); // in template
    this.winner = document.getElementById('winner'); // in template

    this.initAfterChoose(); // it will not init first
  }
  initAfterChoose() {
    this.render.renderIntoScreen(this.player);
    this.friendZone = document.getElementById('friend');
    this.enemyZone = document.getElementById('enemy');
    this.bindEventAfterChoose();
  }
  bindEventAfterChoose() {
    this.enemyZone.addEventListener('click', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      const x = Number(cell.dataset.row);
      const y = Number(cell.dataset.col);
      const success = this.player.computer.receiveAttack(x, y);
      if (!success) return;
      this.computerAttack();
      this.render.markAttackForCell(cell);
      this.haveWinner();
    });
    this.winnerDialog.addEventListener('close', () => {
      if (this.winnerDialog.returnValue === 'cancel') {
        this.resetGame(); // notice when it change after intergrate
      }
    });
  }
  randomAttack() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return [x, y];
  }
  computerAttack() {
    let [x, y] = this.randomAttack();
    while (this.player.realPlayer.attacked[x][y] === 1) {
      [x, y] = this.randomAttack();
    }
    this.player.realPlayer.receiveAttack(x, y);
    const cell = this.friendZone.querySelector(
      `[data-row='${x}'][data-col='${y}']`,
    );
    this.render.markAttackForCell(cell);
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
}

new Controller();

// const render = new Render();
// const player = new Player();
// render.showShipPlacement(player.realPlayer);

// let previewCell = [];
// const shipsElement = document.querySelectorAll('.ship');
// const chooseableArea = document.querySelector('.main_board .grid_container');
// let currentShip = null;

// shipsElement.forEach((ship) => {
//   ship.addEventListener('dragstart', () => {
//     ship.classList.add('dragging');
//     const dragging = document.querySelector('.dragging');
//     currentShip = new Ship(Number(dragging.dataset.value));
//   });

//   ship.addEventListener('dragend', () => {
//     ship.classList.remove('dragging');
//   });
// });

// chooseableArea.addEventListener('dragover', (e) => {
//   e.preventDefault();
//   const cell = e.target.closest('.cell');
//   if (!cell) return;
//   const x = Number(cell.dataset.row);
//   const y = Number(cell.dataset.col);
//   showPreview(x, y, currentShip);
// });

// function showPreview(x, y, ship) {
//   clearPreview();
//   let cells = [];
//   for (let i = 0; i < ship.len; i++) {
//     let nx = x;
//     let ny = y + i;
//     if (nx >= 10 || ny >= 10) return;
//     const cell = document.querySelector(`[data-row='${nx}'][data-col='${ny}']`);
//     cells.push(cell);
//   }
//   const valid = cells.every((c) => {
//     return !c.classList.contains('occupied');
//   });
//   cells.forEach((c) => {
//     c.classList.add(valid ? 'preview' : 'invalid');
//   });
//   previewCell = cells;
// }

// function clearPreview() {
//   previewCell.forEach((c) => {
//     c.classList.remove('preview', 'invalid');
//   });
//   previewCell = [];
// }

// chooseableArea.addEventListener('dragleave', () => {
//   clearPreview();
// });

// chooseableArea.addEventListener('drop', (e) => {
//   const cell = e.target.closest('.cell');
//   if (!cell) return;
//   if (!currentShip) return;
//   const x = Number(cell.dataset.row);
//   const y = Number(cell.dataset.col);
//   const put = player.realPlayer.placeAShip(x, y, currentShip);
//   previewCell.forEach((c) => {
//     const x = Number(c.dataset.row);
//     const y = Number(c.dataset.col);
//     player.realPlayer.occupyACell(x, y);
//   });
//   render.renderBoard(player.realPlayer, chooseableArea);
//   const dragging = document.querySelector('.dragging');
//   if (put) dragging.remove();
//   clearPreview();
// });
