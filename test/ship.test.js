import { Ship } from '../src';

test('test hit function', () => {
  const sh = new Ship(3);
  expect(sh.len).toBe(3);
  sh.hit();
  expect(sh.hitted).toBe(1);
});

test('is Shrink function', () => {
  const sh = new Ship(3);
  expect(sh.isSunk()).toBe(false);
  sh.hit();
  expect(sh.isSunk()).toBe(false);
  sh.hit();
  expect(sh.isSunk()).toBe(false);
  sh.hit();
  expect(sh.isSunk()).toBe(true);
});
