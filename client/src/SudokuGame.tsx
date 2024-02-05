import React, { useState } from 'react';
import axios from 'axios';
import { Button, Grid } from '@mui/material';
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

  const generatePuzzle = async () => {
    try {
      const response = await axiosInstance.get<{
        puzzleId: string;
        puzzle: number[][][];
      }>('/generate-puzzle');

      setPuzzleId(response.data.puzzleId);
      setPuzzle(response.data.puzzle);
    } catch (error) {
      console.error('Error fetching the puzzle:', error);
    }
  };

  const verifyKnowledge = async () => {
    if (!puzzle || !puzzleId) return;

    // Randomly choose a sub-grid, row, or column as an example of what you might verify.
    const randomIndex = Math.floor(Math.random() * 9); // For example, choose a random sub-grid
    const subGrid: PuzzleCell[][] = extractSubGrid(puzzle, randomIndex);

    // Flatten the sub-grid, select the first non-zero number from each cell, and filter out zeros
    const selectedCards: number[] = subGrid
      .flat()
      .map((cell) => cell.find((n) => n !== 0) || 0)
      .filter((n) => n !== 0);

    // Shuffle the selected cards
    const shuffledCards: number[] = selectedCards.sort(
      () => Math.random() - 0.5
    );

    try {
      // Submit the shuffled cards for verification
      const response = await axiosInstance.post('/submit-response', {
        puzzleId,
        response: shuffledCards,
      });
      console.log('Verification submitted:', response.data);
      // Optionally handle server response here, like updating UI based on verification result
    } catch (error) {
      console.error('Error submitting verification:', error);
    }
  };

  function extractSubGrid(puzzle: Puzzle, index: number): PuzzleCell[][] {
    const gridSize = 3; // Size of a sub-grid
    const rowStart = Math.floor(index / 3) * gridSize;
    const colStart = (index % 3) * gridSize;

    let subGrid: PuzzleCell[][] = [];

    for (let row = rowStart; row < rowStart + gridSize; row++) {
      let subGridRow: PuzzleCell[] = [];
      for (let col = colStart; col < colStart + gridSize; col++) {
        subGridRow.push(puzzle[row][col]);
      }
      subGrid.push(subGridRow);
    }

    return subGrid;
  }

  return (
    <Grid container spacing={2} style={{ padding: '20px' }}>
      <Grid item xs={12} md={8}>
        <SudokuBoard puzzle={puzzle} onCellSelect={() => {}} />
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
      </Grid>
    </Grid>
  );
};

export default SudokuGame;
