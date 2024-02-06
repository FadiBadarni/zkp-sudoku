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

        // Process each packet with detailed analysis for partial solutions
        const detailedResults = packets.map((packet, i) => {
            // Determine the type based on the index
            const type = i < 9 ? "row" : i < 18 ? "column" : "subgrid";
            const adjustedIndex = i < 9 ? i : i % 9; // Adjust index for rows, columns, and subgrids
            return verifyPacket(packet, adjustedIndex, type);
        });

        const isValid = detailedResults.every(result => result.isValid);

        res.json({
            verified: isValid,
            details: detailedResults.filter(result => !result.isValid) // Provide details for invalid packets
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

function verifyPacket(packet, index, type) {
    // Remove zeros (unselected cards) and sort the remaining numbers
    const sortedNumbers = packet.filter(number => number > 0).sort((a, b) => a - b);
    const duplicates = sortedNumbers.filter((number, i, arr) => arr.indexOf(number) !== i && arr.lastIndexOf(number) === i);
    const hasDuplicates = duplicates.length > 0;

    // A packet is valid if it does not contain duplicates
    const isValid = !hasDuplicates;

    return {
        isValid,
        type,
        index,
        duplicates,
    };
}



module.exports = generatePuzzleRoute;
