import React, { useState } from 'react';
import axios from 'axios';
import { Button, Grid } from '@mui/material';
import SudokuBoard from './SudokuBoard';

type PuzzleCell = number | null;
type PuzzleRow = PuzzleCell[];
type Puzzle = PuzzleRow[];

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

const SudokuGame: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  const generatePuzzle = async () => {
    try {
      const response = await axiosInstance.get<Puzzle>('/generate-puzzle');
      setPuzzle(response.data);
    } catch (error) {
      console.error('Error fetching the puzzle:', error);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={generatePuzzle}>
        Generate Puzzle
      </Button>
      <Grid
        container
        spacing={2}
        sx={{ marginTop: '20px', justifyContent: 'center' }}
      >
        <SudokuBoard puzzle={puzzle} />
      </Grid>
    </>
  );
};

export default SudokuGame;
