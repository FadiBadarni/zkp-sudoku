import React, { useState } from 'react';
import axios from 'axios';
import { Button, Grid, Typography } from '@mui/material';
import SudokuBoard from './SudokuBoard';

export type Card = number; // Represents a single "card" in the cell
export type PuzzleCell = Card[]; // a cell is an array of "cards"
export type PuzzleRow = PuzzleCell[];
export type Puzzle = PuzzleRow[];

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

const SudokuGame: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [puzzleId, setPuzzleId] = useState<string | null>(null);
  const [editableCells, setEditableCells] = useState<boolean[][] | null>(null);

  const generatePuzzle = async () => {
    try {
      const response = await axiosInstance.get<{
        puzzleId: string;
        puzzle: number[][][];
      }>('/generate-puzzle');

      setPuzzleId(response.data.puzzleId);
      setPuzzle(response.data.puzzle);

      const initialEditableCells = response.data.puzzle.map(
        (row) => row.map((cell) => cell[0] === 0) // cell[0] is the value, and 0 means empty
      );
      setEditableCells(initialEditableCells);
    } catch (error) {
      console.error('Error fetching the puzzle:', error);
    }
  };

  const verifyKnowledge = async () => {
    if (!puzzle || !puzzleId) return;

    // Assemble packets for all rows, columns, and sub-grids
    const packets = assemblePackets(puzzle);

    try {
      const response = await axiosInstance.post('/submit-verification', {
        puzzleId,
        packets,
      });
      console.log('Verification submitted:', response.data);
    } catch (error) {
      console.error('Error submitting verification:', error);
    }
  };

  function assemblePackets(puzzle: Puzzle): number[][] {
    let packets: number[][] = [];

    // Assemble packets for rows and columns
    for (let i = 0; i < 9; i++) {
      let rowPacket = [],
        columnPacket = [];
      for (let j = 0; j < 9; j++) {
        // Randomly select one card for the row and one for the column
        rowPacket.push(puzzle[i][j][Math.floor(Math.random() * 3)]);
        columnPacket.push(puzzle[j][i][Math.floor(Math.random() * 3)]);
      }
      packets.push(rowPacket);
      packets.push(columnPacket);
    }

    // Assemble packets for sub-grids
    for (let sg = 0; sg < 9; sg++) {
      let subGridPacket = [];
      let startRow = Math.floor(sg / 3) * 3;
      let startCol = (sg % 3) * 3;
      for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
          // Randomly select one card for the sub-grid
          subGridPacket.push(puzzle[row][col][Math.floor(Math.random() * 3)]);
        }
      }
      packets.push(subGridPacket);
    }

    // shuffle each packet to further obfuscate the information
    packets.forEach((packet) => packet.sort(() => Math.random() - 0.5));

    return packets;
  }

  const onCellChange = (row: number, col: number, value: number) => {
    if (!puzzle || !editableCells) return;

    if (editableCells[row][col]) {
      // Check if the cell was initially empty
      const newPuzzle = [...puzzle];
      newPuzzle[row][col] = [value, value, value]; // Update only if editable
      setPuzzle(newPuzzle);
    }
  };

  return (
    <Grid container spacing={2} style={{ padding: '20px' }}>
      <Grid item xs={12} md={8}>
        <SudokuBoard
          puzzle={puzzle}
          onCellChange={onCellChange}
          editableCells={editableCells}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={4}
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h6" gutterBottom style={{ color: 'white' }}>
          Sudoku Verification Game
        </Typography>
        <Typography
          variant="body1"
          style={{ marginBottom: '20px', color: 'lightgray' }}
        >
          Generate a puzzle and try to solve it. Click "Verify Knowledge" to
          check if your solution adheres to Sudoku rules without revealing the
          solution.
        </Typography>
        <Grid item>
          <Button variant="contained" color="primary" onClick={generatePuzzle}>
            Generate Puzzle
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={verifyKnowledge}
          >
            Verify Knowledge
          </Button>
        </Grid>
        <Typography
          variant="body2"
          style={{ marginTop: '20px', color: 'gray' }}
        >
          Instructions:
        </Typography>
        <ul style={{ color: 'gray' }}>
          <li>Fill in the Sudoku board with numbers 1-9.</li>
          <li>
            Each row, column, and 3x3 grid must contain all numbers from 1 to 9
            without repetition.
          </li>
          <li>Use "Verify Knowledge" to check your solution at any time.</li>
        </ul>
        <Typography
          variant="body2"
          style={{ marginTop: '20px', color: 'gray' }}
        >
          Note: Verification does not provide the solution but checks for rule
          adherence.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SudokuGame;
