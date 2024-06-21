const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');
const SudokuSolver = require('../controllers/sudoku-solver.js');

let solver = new Solver();

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    assert.equal(solver.validate(puzzle), true);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5....X.9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.deepEqual(solver.validate(puzzle), { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37';
    assert.deepEqual(solver.validate(puzzle), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    assert.equal(solver.checkRowPlacement(puzzle, 'A', 2, '3'), true);
  });

  test('Logic handles an invalid row placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    assert.equal(solver.checkRowPlacement(puzzle, 'A', 2, '1'), false);
  });

  test('Logic handles a valid column placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    assert.equal(solver.checkColPlacement(puzzle, 'A', 2, '3'), true);
  });

  test('Logic handles an invalid column placement', function(done) {
    const solver = new SudokuSolver();
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const column = 2; // Column index should be 1-based
    const isValid = solver.checkColPlacement(puzzle, 'A', column, '6');
    console.log(`Column placement validity for column ${column}: ${isValid}`);
    assert.equal(isValid, false);
    done();
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    assert.equal(solver.checkRegionPlacement(puzzle, 'A', 2, '3'), true);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    assert.equal(solver.checkRegionPlacement(puzzle, 'A', 2, '2'), false);
  });

  test('Valid puzzle strings pass the solver', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const solution = puzzlesAndSolutions[0][1];
    assert.deepEqual(solver.solve(puzzle).solution, solution);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5....X.9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.deepEqual(solver.solve(puzzle), { error: 'Invalid characters in puzzle' });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const solution = puzzlesAndSolutions[0][1];
    assert.deepEqual(solver.solve(puzzle).solution, solution);
  });
});
