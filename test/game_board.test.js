import { Gameboard } from '../src';

let board;
let mockShip;
beforeEach(() => {
  mockShip = {
    len: 3,
    hit: jest.fn(),
    isSunk: () => {
      return false;
    },
  };
  board = new Gameboard();
});
afterEach(() => {
  board = undefined;
});

test('test watter', () => {
  expect(board.watter.length).toBe(10);
  expect(board.watter[9].length).toBe(10);
  expect(board.watter[0][0]).toBe(null);
});

describe('placeAShip test', () => {
  test('placeAShip method with edge case', () => {
    expect(board.placeAShip(-1, -1, mockShip)).toBe(undefined);
    expect(board.placeAShip(10, 10, mockShip)).toBe(undefined);
  });

  test('ship cant fit water place', () => {
    expect(board.placeAShip(0, 9, mockShip)).toBe(undefined);
    expect(board.placeAShip(0, 9, mockShip)).toBe(undefined);
  });

  test('place ship', () => {
    board.placeAShip(0, 0, mockShip);
    expect(board.watter[0][0]).toEqual(mockShip);
    expect(board.watter[0][1]).toEqual(mockShip);
    expect(board.watter[0][2]).toEqual(mockShip);
    expect(board.watter[0][3]).toEqual(null);
  });
});

test('hit a target', () => {
  board.placeAShip(5, 3, mockShip);
  board.receiveAttack(5, 4);
  expect(mockShip.hit).toHaveBeenCalled();
  expect(board.visited.size).not.toBe(0);
  expect(board.visited.has('5,4')).toBe(true);
});
