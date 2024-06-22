'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // Check for missing required fields
      if (!puzzle || !coordinate || !value) {
        return res.status(400).json({ error: 'Required field(s) missing' });
      }

      // Check for invalid puzzle length or characters
      if (puzzle.length !== 81) {
        return res.status(400).json({ error: 'Expected puzzle to be 81 characters long' });
      }
      if (/[^1-9.]/.test(puzzle)) {
        return res.status(400).json({ error: 'Invalid characters in puzzle' });
      }

      // Validate coordinate
      const row = coordinate.charAt(0);
      const col = coordinate.charAt(1);
      if (!/[A-I]/.test(row) || !/[1-9]/.test(col)) {
        return res.status(400).json({ error: 'Invalid coordinate' });
      }

      // Validate value
      if (!/[1-9]/.test(value)) {
        return res.status(400).json({ error: 'Invalid value' });
      }

      // Check placement conflicts
      const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
      const colIndex = col - 1;
      const conflicts = solver.checkPlacement(puzzle, rowIndex, colIndex, value);

      if (conflicts.length === 0) {
        return res.json({ valid: true });
      } else {
        return res.status(500).json({ valid: false, conflict: conflicts });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      // Check for missing puzzle string
      if (!puzzle) {
        return res.status(400).json({ error: 'Required field missing' });
      }

      // Check for invalid puzzle length or characters
      if (puzzle.length !== 81) {
        return res.status(400).json({ error: 'Expected puzzle to be 81 characters long' });
      }
      if (/[^1-9.]/.test(puzzle)) {
        return res.status(400).json({ error: 'Invalid characters in puzzle' });
      }

      // Solve puzzle
      const result = solver.solve(puzzle);
      if (result.error) {
        return res.status(200).json(result);
      } else {
        return res.status(200).json({ solution: result.solution });
      }
    });
};
