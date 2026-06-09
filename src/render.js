class Render {
  constructor() {
    this.container = document.querySelector('.container');
    this.friendShip = 'friendShip';
    this.enemyShip = 'enemyShip';
    this.friend = 'friend';
    this.enemy = 'enemy';
  }
  showShipPlacement(player) {
    const chooseBoard = document.createElement('div');
    chooseBoard.classList.add('choose_board');
    this.container.appendChild(chooseBoard);
    const mainBoard = document.createElement('div');
    mainBoard.classList.add('main_board');
    chooseBoard.appendChild(mainBoard);
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid_container');
    gridContainer.id = this.friend;
    mainBoard.appendChild(gridContainer);
    this.renderBoard(player, gridContainer);
    const decisionArea = document.createElement('div');
    decisionArea.classList.add('decision_area');
    mainBoard.appendChild(decisionArea);
    const reset = document.createElement('button');
    reset.id = 'reset';
    reset.textContent = 'Reset';
    decisionArea.appendChild(reset);
    const confirm = document.createElement('button');
    confirm.id = 'confirm';
    confirm.textContent = 'Confirm';
    decisionArea.appendChild(confirm);
    const shipsArea = document.createElement('div');
    shipsArea.classList.add('ships_area');
    chooseBoard.appendChild(shipsArea);
    for (let i = 0; i < 4; i++) {
      const shipContainer = document.createElement('div');
      shipContainer.classList.add('ship_container');
      const ship = document.createElement('div');
      ship.classList.add('ship');
      shipContainer.appendChild(ship);
      ship.draggable = true;
      shipsArea.appendChild(shipContainer);
    }
  }
  makeMarkAttack() {
    const attack = document.createElement('div');
    attack.classList.add('attacked');
    return attack;
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
    gridContainer.id = shipColor === this.friendShip ? this.friend : this.enemy;
    gridContainer.classList.add('grid_container');
    for (let i = 0; i < playerBoard.length; i++) {
      for (let j = 0; j < playerBoard[0].length; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (playerBoard[i][j]) cell.classList.add(shipColor);
        if (markBoard[i][j] === 1) {
          const attack = this.makeMarkAttack();
          cell.appendChild(attack);
        }
        cell.dataset.row = i;
        cell.dataset.col = j;
        gridContainer.appendChild(cell);
      }
    }
    player1.appendChild(gridContainer);
    return player1;
  }
  renderIntoScreen(player) {
    this.container.innerHTML = '';
    const real = this.renderPlayerBoard(
      player.realPlayer.water,
      player.realPlayer.attacked,
      'Player',
      'realplayer',
      this.friendShip,
    );
    const computer = this.renderPlayerBoard(
      player.computer.water,
      player.computer.attacked,
      'Computer',
      'computer',
      this.enemyShip,
    );
    this.container.appendChild(real);
    this.container.appendChild(computer);
  }
  markAttackForCell(cell) {
    const attack = this.makeMarkAttack();
    cell.appendChild(attack);
  }
  renderBoard(player, container) {
    container.innerHTML = '';
    const matrix = player.water;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const shipColor =
          container.id === this.friend ? this.friendShip : this.enemyShip;
        if (matrix[i][j]) cell.classList.add(shipColor);
        if (player.attacked[i][j] === 1) {
          const attack = this.makeMarkAttack();
          cell.appendChild(attack);
        }
        cell.dataset.row = i;
        cell.dataset.col = j;
        container.appendChild(cell);
      }
    }
  }
}

export { Render };
