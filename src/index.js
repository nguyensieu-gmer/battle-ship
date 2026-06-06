import { Player } from './game_board.js';
import { Render } from './render.js';
import './style.css';

const player = new Player();
const render = new Render(player);
