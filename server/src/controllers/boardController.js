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

    app.post('/submit-verification', (req, res) => {
        const { puzzleId, packets } = req.body;
        const puzzleData = puzzles[puzzleId];

        if (!puzzleData) {
            return res.status(404).send('Puzzle not found or expired');
        }

        // Verify each packet
        const isValid = packets.every(packet => verifyPacket(packet));

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

function verifyPacket(packet) {
    // Remove zeros (unselected cards) and sort the remaining numbers
    const filteredNumbers = packet.filter(number => number > 0).sort();

    // Check for duplicates in the filtered list
    for (let i = 1; i < filteredNumbers.length; i++) {
        if (filteredNumbers[i] === filteredNumbers[i - 1]) {
            return false; // Found a duplicate, which violates Sudoku rules
        }
    }

    // Ensure all numbers are within the valid Sudoku range
    return filteredNumbers.every(number => number >= 1 && number <= 9);
}



module.exports = generatePuzzleRoute;
