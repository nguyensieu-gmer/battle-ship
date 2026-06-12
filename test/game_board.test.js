import { Gameboard } from '../src/game_board';

let board;
let mockShip;
beforeEach(() => {
  mockShip = {
    len: 3,
    hit: jest.fn(),
    isSunk: jest.fn(),
  };
  board = new Gameboard();
});
afterEach(() => {
  board = undefined;
});

test('test water', () => {
  expect(board.water.length).toBe(10);
  expect(board.water[9].length).toBe(10);
  expect(board.water[0][0]).toBe(null);
});

describe('placeAShip test', () => {
  test('placeAShip method with edge case', () => {
    expect(board.placeAShip(-1, -1, mockShip, true)).toBe(false);
    expect(board.placeAShip(10, 10, mockShip, true)).toBe(false);
  });

  test('ship cant fit water place', () => {
    expect(board.placeAShip(0, 9, mockShip, true)).toBe(false);
    expect(board.placeAShip(0, 9, mockShip, true)).toBe(false);
  });

  test('place ship', () => {
    board.placeAShip(0, 0, mockShip, true);
    expect(board.water[0][0]).toEqual(mockShip);
    expect(board.water[0][1]).toEqual(mockShip);
    expect(board.water[0][2]).toEqual(mockShip);
    expect(board.water[0][3]).toEqual(null);
  });
  test('y-asix', () => {
    board.placeAShip(0, 0, mockShip, false);
    expect(board.water[1][0]).toEqual(mockShip);
    expect(board.water[2][0]).toEqual(mockShip);
  });
  test('y-asix out of bound', () => {
    const success = board.placeAShip(8, 0, mockShip, false);
    expect(success).toBe(false);
  });
});

test('hit a target', () => {
  board.placeAShip(5, 3, mockShip, true);
  board.receiveAttack(5, 4);
  expect(mockShip.hit).toHaveBeenCalled();
  expect(board.attacked[5][4]).toBe(1);
});

test('test all sunk method', () => {
  board.placeAShip(5, 3, mockShip, true);
  board.receiveAttack(5, 4);
  expect(mockShip.isSunk).toHaveBeenCalled();
});

test('test with 3 ship', () => {
  board.placeAShip(0, 0, mockShip, true);
  board.placeAShip(1, 0, mockShip, true);
  expect(board.putEnoughShip(3)).toBe(false);
  board.placeAShip(2, 0, mockShip, true);
  expect(board.putEnoughShip(3)).toBe(true);
});

test('a ship is sink or not', () => {
  board.placeAShip(0, 0, mockShip, true);
  board.receiveAttack(0, 1);
  board.isShipSunk(0, 0);
  expect(mockShip.isSunk).toHaveBeenCalled();
  expect(board.isShipSunk(9, 9)).toBe(null);
});

test('dfs', () => {
  let mockShip1 = {
    len: 4,
    hit: jest.fn(),
    isSunk: jest.fn(),
  };
  board = new Gameboard();
  board.placeAShip(0, 1, mockShip, true);
  board.placeAShip(1, 0, mockShip1, true);
  const cells = board.findAdjacentShip(0, 3, mockShip);
  expect(cells.length).toBe(3);
  // check contain
  expect(cells.sort()).toEqual([
    [0, 1],
    [0, 2],
    [0, 3],
  ]);
});
