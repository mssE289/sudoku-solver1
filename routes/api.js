'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      const validation = solver.validate(puzzle);
      if (validation !== true) {
        return res.status(200).json(validation);
      }

      if (!coordinate || !value) {
        return res.status(200).json({ error: 'Required field(s) missing' });
      }

      const row = coordinate[0];
      const column = parseInt(coordinate[1], 10);

      if (!/[A-I]/.test(row) || !/[1-9]/.test(column)) {
        return res.status(200).json({ error: 'Invalid coordinate' });
      }

      if (!/[1-9]/.test(value)) {
        return res.status(200).json({ error: 'Invalid value' });
      }

      const conflicts = [];
      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflicts.push('row');
      }
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflicts.push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflicts.push('region');
      }

      if (conflicts.length > 0) {
        return res.status(200).json({ valid: false, conflict: conflicts });
      } else {
        return res.status(200).json({ valid: true });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.status(200).json({ error: 'Required field missing' });
      }

      const result = solver.solve(puzzle);
      if (!result.error) {
        console.error('Unexpected result:', result); // Debug statement
      }
      return res.status(200).json(result);
    });
};
