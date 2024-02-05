const sudoku = require('sudoku');

const puzzles = {};

const generatePuzzleRoute = (app) => {
    app.get('/generate-puzzle', (req, res) => {
        try {
            const rawPuzzle = sudoku.makepuzzle();
            const solution = sudoku.solvepuzzle(rawPuzzle);
            const readablePuzzle = rawPuzzle.map(cell => cell === null ? null : cell + 1);

            const puzzleId = generateUniqueId();

            puzzles[puzzleId] = {
                puzzle: readablePuzzle,
                solution: solution,
                timestamp: Date.now()
            };

            setTimeout(() => {
                delete puzzles[puzzleId];
            }, 3600000);

            res.json({ puzzleId, puzzle: formatPuzzle(readablePuzzle) });
        } catch (error) {
            console.error('Error generating Sudoku puzzle:', error);
            res.status(500).send('Error generating Sudoku puzzle');
        }
    });

    app.post('/verify-solution', (req, res) => {
        const { puzzleId, packets } = req.body; // Packets would be the client's selection for verification
        const puzzleData = puzzles[puzzleId];

        if (!puzzleData) {
            return res.status(404).send('Puzzle not found or expired');
        }

        const verificationResult = verifyPackets(puzzleData.solution, packets);
        res.json({ verified: verificationResult });
    });
};

function verifyPackets(solution, packets) {
    // Implement the logic to verify the packets here.
    // For example, check if the packets contain all numbers from 1 to 9
    // without revealing the solution to the client.
    return true; // Or false, based on the verification
}

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 11);
}

function formatPuzzle(puzzleArray) {
    let formatted = [];
    let size = 9;
    for (let i = 0; i < puzzleArray.length; i += size) {
        formatted.push(puzzleArray.slice(i, i + size));
    }
    return formatted;
}

module.exports = generatePuzzleRoute;
