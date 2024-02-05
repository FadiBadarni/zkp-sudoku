import React, { useState } from 'react';
import axios from 'axios';
import { Button, Grid, Paper } from '@mui/material';

type PuzzleCell = number | null;
type PuzzleRow = PuzzleCell[];
type Puzzle = PuzzleRow[];

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

const SudokuBoard: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  const generatePuzzle = async () => {
    try {
      const response = await axiosInstance.get<Puzzle>('/generate-puzzle');
      setPuzzle(response.data);
    } catch (error) {
      console.error('Error fetching the puzzle:', error);
    }
  };

  const renderSudokuBoard = () => {
    if (!puzzle) return 'Generate a puzzle to start.';
    return puzzle.map((row, rowIndex) => (
      <Grid container item key={rowIndex} spacing={1} justifyContent="center">
        {row.map((cell, cellIndex) => (
          <Grid item key={cellIndex}>
            <Paper
              elevation={3}
              square
              sx={{
                width: '2rem',
                height: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: cell !== null ? 'lightblue' : 'lightgrey',
              }}
            >
              {cell !== null ? cell : ''}
            </Paper>
          </Grid>
        ))}
      </Grid>
    ));
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={generatePuzzle}>
        Generate Puzzle
      </Button>
      <Grid container spacing={2} sx={{ marginTop: '20px' }}>
        {renderSudokuBoard()}
      </Grid>
    </>
  );
};

export default SudokuBoard;
