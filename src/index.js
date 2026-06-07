import { Player } from './game_board.js';
import { Render } from './render.js';
import './style.css';

class Controller {
  constructor() {
    this.player = new Player();
    this.render = new Render();
    this.render.renderIntoScreen(this.player);
    this.enemyZone = document.querySelector('#computer .grid_container');

    this.init();
  }
  init() {
    this.bindEvent();
  }
  resetBoard() {
    this.render.renderIntoScreen(this.player);
  }
  bindEvent() {
    this.enemyZone.addEventListener('click', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      const x = cell.dataset.row;
      const y = cell.dataset.col;
      const success = this.player.computer.receiveAttack(x, y);
      if (!success) return;
      this.computerAttack();
      this.render.markAttackForCell(cell);
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
    const cell = document.querySelector(`[data-row='${x}'][data-col='${y}']`);
    this.render.markAttackForCell(cell);
  }
}

new Controller();
