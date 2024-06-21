class SudokuSolver {
  validate(puzzleString) {
    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 65;
    const start = rowIndex * 9;
    const rowValues = puzzleString.slice(start, start + 9);
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = column - 1;
    for (let i = 0; i < 9; i++) {
      if (puzzleString[colIndex + i * 9] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 65;
    const colIndex = column - 1;
    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(colIndex / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleString[(startRow + i) * 9 + startCol + j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  isValidSudoku(puzzleString) {
    for (let i = 0; i < 81; i++) {
      if (puzzleString[i] !== '.') {
        const row = String.fromCharCode(65 + Math.floor(i / 9));
        const col = (i % 9) + 1;
        const value = puzzleString[i];
        puzzleString = puzzleString.slice(0, i) + '.' + puzzleString.slice(i + 1);

        if (!this.checkRowPlacement(puzzleString, row, col, value) ||
            !this.checkColPlacement(puzzleString, row, col, value) ||
            !this.checkRegionPlacement(puzzleString, row, col, value)) {
          return false;
        }

        puzzleString = puzzleString.slice(0, i) + value + puzzleString.slice(i + 1);
      }
    }
    return true;
  }

  solve(puzzleString) {
    console.log('Solving puzzle:', puzzleString); // Debug statement
    const validateResult = this.validate(puzzleString);
    if (validateResult !== true) {
      return validateResult;
    }

    const solveRecursive = (puzzle) => {
      const index = puzzle.indexOf('.');
      if (index === -1) {
        return this.isValidSudoku(puzzle) ? puzzle : false;
      }

      const row = String.fromCharCode(65 + Math.floor(index / 9));
      const col = (index % 9) + 1;

      for (let value = 1; value <= 9; value++) {
        const charValue = value.toString();
        if (this.checkRowPlacement(puzzle, row, col, charValue) &&
            this.checkColPlacement(puzzle, row, col, charValue) &&
            this.checkRegionPlacement(puzzle, row, col, charValue)) {
          const newPuzzle = puzzle.slice(0, index) + charValue + puzzle.slice(index + 1);
          console.log('Trying value:', charValue, 'new puzzle:', newPuzzle); // Debug statement
          const solvedPuzzle = solveRecursive(newPuzzle);
          if (solvedPuzzle) {
            return solvedPuzzle;
          }
        }
      }
      return false;
    };

    const solution = solveRecursive(puzzleString);
    console.log('Solution:', solution);  // Debug statement
    if (solution && typeof solution === 'string' && solution.indexOf('.') === -1) {
      return { solution };
    }
    return { error: 'Puzzle cannot be solved' };
  }
}

module.exports = SudokuSolver;

