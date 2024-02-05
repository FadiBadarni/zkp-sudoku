import React, { useState } from 'react';
import axios from 'axios';
import { Button, Grid } from '@mui/material';

interface Puzzle {
  // Define the structure of the puzzle data you expect
}

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

const SudokuBoard: React.FC = () => {
  // If the puzzle has a known structure, use it here, else use 'any' or a proper type
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  const generatePuzzle = async () => {
    try {
      const response = await axiosInstance.get<Puzzle>('/generate-puzzle');
      setPuzzle(response.data); // The response.data will be typed as Puzzle
      // You will need to render the puzzle on the grid below
    } catch (error) {
      console.error('Error fetching the puzzle:', error);
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        {/* Render the Sudoku board here based on the puzzle state */}
      </Grid>
      <Button variant="contained" color="primary" onClick={generatePuzzle}>
        Generate Puzzle
      </Button>
      {/* The verify button will probably need to be moved here as well */}
    </>
  );
};

export default SudokuBoard;
