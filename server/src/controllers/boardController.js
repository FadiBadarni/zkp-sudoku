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

    app.post('/request-challenge', (req, res) => {
        const { puzzleId } = req.body;
        const puzzleData = puzzles[puzzleId];

        if (!puzzleData) {
            return res.status(404).send('Puzzle not found or expired');
        }

        // Example challenge generation
        // For simplicity, this could be randomized or follow a specific sequence
        const challengeType = ["row", "column", "sub-grid"][Math.floor(Math.random() * 3)];
        const challengeIndex = Math.floor(Math.random() * 9); // Random index for row, column, or sub-grid

        res.json({
            challenge: {
                type: challengeType,
                index: challengeIndex
            }
        });
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


module.exports = generatePuzzleRoute;
