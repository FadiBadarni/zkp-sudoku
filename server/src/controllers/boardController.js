const sudoku = require('sudoku');

const puzzles = {};

const generatePuzzleRoute = (app) => {
    app.get('/generate-puzzle', (req, res) => {
        try {
            const rawPuzzle = sudoku.makepuzzle();
            const rawSolution = sudoku.solvepuzzle(rawPuzzle);
            const readablePuzzle = formatPuzzle(rawPuzzle);
            const readableSolution = formatPuzzle(rawSolution);

            const puzzleId = generateUniqueId();

            puzzles[puzzleId] = {
                puzzle: readablePuzzle,
                solution: readableSolution,
                timestamp: Date.now()
            };

            setTimeout(() => {
                delete puzzles[puzzleId];
            }, 3600000);

            res.json({ puzzleId, puzzle: readablePuzzle });
        } catch (error) {
            console.error('Error generating Sudoku puzzle:', error);
            res.status(500).send('Error generating Sudoku puzzle');
        }
    });

    app.post('/submit-response', (req, res) => {
        const { puzzleId, response: shuffledCards } = req.body;
        const puzzleData = puzzles[puzzleId];

        if (!puzzleData) {
            return res.status(404).send('Puzzle not found or expired');
        }

        const isValid = verifyResponse(shuffledCards);

        res.json({ verified: isValid });
    });

};

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 11);
}

function formatPuzzle(puzzleArray) {
    // Map each cell to an array of "cards"
    const formatted = puzzleArray.map(cell =>
        cell === null ? [0, 0, 0] : [cell + 1, cell + 1, cell + 1] // Adjust for 1-based indexing and create "cards"
    );

    // Format the puzzle into rows
    let puzzleRows = [];
    for (let i = 0; i < formatted.length; i += 9) {
        puzzleRows.push(formatted.slice(i, i + 9));
    }
    return puzzleRows;
}

function verifyResponse(shuffledCards) {
    const numbersTracker = Array(9).fill(false);

    shuffledCards.forEach(card => {
        if (card >= 1 && card <= 9) {
            numbersTracker[card - 1] = true;
        }
    });

    return numbersTracker.every(isPresent => isPresent);
}


function extractSubGrid(solution, index) {
    const subGridSize = 3; // Each sub-grid is 3x3
    const subGridsPerRow = Math.sqrt(solution.length); // Typically, 3 sub-grids per row for a 9x9 Sudoku

    // Calculate the starting row and column for the sub-grid
    const startRow = Math.floor(index / subGridsPerRow) * subGridSize;
    const startCol = (index % subGridsPerRow) * subGridSize;

    let subGrid = [];

    for (let row = startRow; row < startRow + subGridSize; row++) {
        for (let col = startCol; col < startCol + subGridSize; col++) {
            // Initialize the sub-row arrays if they don't exist
            if (!subGrid[row - startRow]) {
                subGrid[row - startRow] = [];
            }

            // Push the cell value into the correct sub-row
            subGrid[row - startRow].push(solution[row][col]);
        }
    }

    return subGrid;
}



module.exports = generatePuzzleRoute;
