import { Player } from './game_board.js';
import { Render } from './render.js';
import './style.css';

class Controller {
  constructor() {
    this.player = new Player();
    this.render = new Render();
    this.render.renderIntoScreen(this.player);
    this.enemyZone = document.querySelector('#computer .grid_container');

    this.playerAttack = null;
    this.computerAttack = this.randomAttack();
    this.playerTurn = true;

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
      this.playerAttack = [x, y];
    });
  }
  randomAttack() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return [x, y];
  }
}

new Controller();
