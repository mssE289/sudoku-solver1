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

  checkPlacement(puzzleString, row, column, value) {
    let conflicts = [];
  
    if (!this.checkRowPlacement(puzzleString, String.fromCharCode(65 + row), column + 1, value)) {
      conflicts.push('row');
    }
    if (!this.checkColPlacement(puzzleString, String.fromCharCode(65 + row), column + 1, value)) {
      conflicts.push('column');
    }
    if (!this.checkRegionPlacement(puzzleString, String.fromCharCode(65 + row), column + 1, value)) {
      conflicts.push('region');
    }
  
    return conflicts;
  }

  isValidSudoku(puzzleString) {
    for (let i = 0; i < 81; i++) {
      if (puzzleString[i] !== '.') {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const value = puzzleString[i];
        puzzleString = puzzleString.slice(0, i) + '.' + puzzleString.slice(i + 1);

        if (!this.checkRowPlacement(puzzleString, String.fromCharCode(65 + row), col + 1, value) ||
            !this.checkColPlacement(puzzleString, String.fromCharCode(65 + row), col + 1, value) ||
            !this.checkRegionPlacement(puzzleString, String.fromCharCode(65 + row), col + 1, value)) {
          return false;
        }

        puzzleString = puzzleString.slice(0, i) + value + puzzleString.slice(i + 1);
      }
    }
    return true;
  }

  solve(puzzleString) {
    const validateResult = this.validate(puzzleString);
    if (validateResult !== true) {
      return validateResult;
    }

    if (!this.isValidSudoku(puzzleString)) {
      return { error: 'Puzzle cannot be solved' };
    }

    const attemptSolve = (puzzle) => {
      const emptyIndex = puzzle.indexOf('.');
      if (emptyIndex === -1) {
        return puzzle;
      }

      const row = Math.floor(emptyIndex / 9);
      const column = emptyIndex % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(puzzle, String.fromCharCode(65 + row), column + 1, value) &&
          this.checkColPlacement(puzzle, String.fromCharCode(65 + row), column + 1, value) &&
          this.checkRegionPlacement(puzzle, String.fromCharCode(65 + row), column + 1, value)
        ) {
          const newPuzzle = puzzle.slice(0, emptyIndex) + value + puzzle.slice(emptyIndex + 1);
          const solvedPuzzle = attemptSolve(newPuzzle);
          if (solvedPuzzle) {
            return solvedPuzzle;
          }
        }
      }
      return false; // Backtrack if no valid number found
    };

    const solvedPuzzle = attemptSolve(puzzleString);
  
    if (solvedPuzzle) {
      console.log('Solved Puzzle:', solvedPuzzle); // Debug log
      return { solution: solvedPuzzle };
    } else {
      console.log('Unsolvable Puzzle:', puzzleString); // Debug log
      return { error: 'Puzzle cannot be solved' };
    }
  }
}

module.exports = SudokuSolver;

