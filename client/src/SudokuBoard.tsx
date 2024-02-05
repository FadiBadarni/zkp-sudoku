import React from 'react';
import { Grid, Paper } from '@mui/material';

type PuzzleCell = number | null;
type PuzzleRow = PuzzleCell[];
type Puzzle = PuzzleRow[];

interface SudokuBoardProps {
  puzzle: Puzzle | null;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ puzzle }) => {
  if (!puzzle) return <div>Generate a puzzle to start.</div>;

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      style={{ maxWidth: '450px', margin: 'auto' }}
    >
      {puzzle.map((row, rowIndex) => (
        <Grid container item key={rowIndex} spacing={1} justifyContent="center">
          {row.map((cell, cellIndex) => (
            <Grid item key={`${rowIndex}-${cellIndex}`} xs={1}>
              <Paper
                elevation={3}
                square
                sx={{
                  width: '100%',
                  paddingTop: '100%',
                  position: 'relative',
                  backgroundColor: cell !== null ? 'lightblue' : 'lightgrey',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '1.25rem',
                  }}
                >
                  {cell !== null ? cell : ''}
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default SudokuBoard;
