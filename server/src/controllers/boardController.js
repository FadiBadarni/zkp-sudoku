const sudoku = require('sudoku');

const generatePuzzleRoute = (app) => {
    app.get('/generate-puzzle', (req, res) => {
        try {
            // Generate a raw puzzle with a unique solution
            const rawPuzzle = sudoku.makepuzzle();
            // Convert the puzzle to a more readable format (e.g., 0-8 for Sudoku numbers, null for empty cells)
            const readablePuzzle = rawPuzzle.map(cell => cell === null ? null : cell + 1);
            // Format the puzzle for the frontend if necessary
            const formattedPuzzle = formatPuzzle(readablePuzzle);
            res.json({ puzzle: formattedPuzzle });
        } catch (error) {
            console.error('Error generating Sudoku puzzle:', error);
            res.status(500).send('Error generating Sudoku puzzle');
        }
    });
};

function formatPuzzle(puzzleArray) {
    // Implement the formatting logic if needed, such as converting the flat array to a 2D array
    let formatted = [];
    let size = 9; // Sudoku grid size
    for (let i = 0; i < puzzleArray.length; i += size) {
        formatted.push(puzzleArray.slice(i, i + size));
    }
    return formatted;
}

module.exports = generatePuzzleRoute;
