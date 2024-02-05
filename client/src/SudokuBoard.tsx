import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

type PuzzleCell = number | null;
type PuzzleRow = PuzzleCell[];
type Puzzle = PuzzleRow[];

interface SudokuBoardProps {
  puzzle: Puzzle | null;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ puzzle }) => {
  if (!puzzle)
    return (
      <Typography variant="h6" style={{ color: 'white' }}>
        Generate a puzzle to start.
      </Typography>
    );

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      sx={{
        maxWidth: '450px',
        margin: 'auto',
        '& .MuiPaper-root': {
          width: '100%',
          paddingTop: '100%',
          position: 'relative',
          backgroundColor: 'transparent',
          border: '2px solid',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
          },
        },
      }}
    >
      {puzzle.map((row, rowIndex) => (
        <Grid container item key={rowIndex} spacing={1} justifyContent="center">
          {row.map((cell, cellIndex) => (
            <Grid item key={`${rowIndex}-${cellIndex}`} xs={1}>
              <Paper
                elevation={0}
                square
                sx={{
                  backgroundColor:
                    cell !== null
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <Typography
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '1rem',
                    userSelect: 'none',
                  }}
                >
                  {cell !== null ? cell : ''}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default SudokuBoard;
