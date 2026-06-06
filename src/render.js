class Render {
  constructor(player) {
    this.container = document.querySelector('.container');
    this.player = player;
    this.renderIntoScreen();
    this.displaymaxtrix();
  }
  makeMarkAttack() {
    const attack = document.createElement('div');
    attack.classList.add('attacked');
    return attack;
  }
  displaymaxtrix() {
    console.log(this.player.realPlayer.water);
    console.log(this.player.computer.water);
  }
  renderPlayerBoard(playerBoard, markBoard, playerName, id, shipColor) {
    const player1 = document.createElement('div');
    player1.id = id;
    player1.classList.add('player');
    const name = document.createElement('h1');
    name.classList.add('name');
    name.textContent = playerName;
    player1.appendChild(name);
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid_container');
    for (let i = 0; i < playerBoard.length; i++) {
      for (let j = 0; j < playerBoard[0].length; j++) {
        const cell = document.createElement('div');
        if (playerBoard[i][j]) cell.classList.add(shipColor);
        if (markBoard[i][j] === 1) {
          const attack = this.makeMarkAttack();
          cell.appendChild(attack);
        }
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        gridContainer.appendChild(cell);
      }
    }
    player1.appendChild(gridContainer);
    return player1;
  }
  renderIntoScreen() {
    this.container.innerHTML = '';
    const player = this.renderPlayerBoard(
      this.player.realPlayer.water,
      this.player.realPlayer.attacked,
      'Player',
      'realplayer',
      'frendShip',
    );
    const computer = this.renderPlayerBoard(
      this.player.computer.water,
      this.player.computer.attacked,
      'Computer',
      'computer',
      'enemyShip',
    );
    this.container.appendChild(player);
    this.container.appendChild(computer);
  }
}

export { Render };
