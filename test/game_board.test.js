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
    expect(board.placeAShip(-1, -1, mockShip)).toBe(false);
    expect(board.placeAShip(10, 10, mockShip)).toBe(false);
  });

  test('ship cant fit water place', () => {
    expect(board.placeAShip(0, 9, mockShip)).toBe(false);
    expect(board.placeAShip(0, 9, mockShip)).toBe(false);
  });

  test('place ship', () => {
    board.placeAShip(0, 0, mockShip);
    expect(board.water[0][0]).toEqual(mockShip);
    expect(board.water[0][1]).toEqual(mockShip);
    expect(board.water[0][2]).toEqual(mockShip);
    expect(board.water[0][3]).toEqual(null);
  });
});

test('hit a target', () => {
  board.placeAShip(5, 3, mockShip);
  board.receiveAttack(5, 4);
  expect(mockShip.hit).toHaveBeenCalled();
  expect(board.attacked[5][4]).toBe(1);
});

test('test all sunk method', () => {
  board.placeAShip(5, 3, mockShip);
  board.receiveAttack(5, 4);
  expect(mockShip.isSunk).toHaveBeenCalled();
});
