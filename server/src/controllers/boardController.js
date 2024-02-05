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

    app.post('/verify-solution', (req, res) => {
        const { puzzleId, packet, rowIndex } = req.body;
        const puzzleData = puzzles[puzzleId];

        if (!puzzleData) {
            return res.status(404).send('Puzzle not found or expired');
        }

        const verificationResult = verifyPacket(puzzleData.solution, packet, rowIndex);
        res.json({ verified: verificationResult });
    });
};

function verifyPacket(solution, packet, rowIndex) {
    // Extract the row from the solution that corresponds to the selected cell.
    let solutionRow = solution.slice(rowIndex * 9, (rowIndex + 1) * 9);

    // Iterate through the user's input, checking only the filled values against the solution.
    for (let i = 0; i < packet.length; i++) {
        if (packet[i] === null) continue; // Skip null values which represent unfilled cells.

        // Verify the filled values. Adjust for 0-indexed format as necessary.
        if (packet[i] !== solutionRow[i] ) {
            return false; // A discrepancy invalidates the verification.
        }
    }

    // If the loop completes without returning false, the packet is valid.
    return true;
}



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
