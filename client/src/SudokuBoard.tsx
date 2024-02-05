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
      justifyContent="center"
      sx={{
        maxWidth: '450px',
        width: '100%',
        margin: 'auto',
      }}
    >
      {puzzle.map((row, rowIndex) => (
        <Grid
          container
          item
          key={rowIndex}
          justifyContent="center"
          sx={{
            borderBottom:
              (rowIndex + 1) % 3 === 0 && rowIndex !== 8
                ? '2px solid rgba(255, 255, 255, 0.3)'
                : 'none',
            width: '100%',
          }}
        >
          {row.map((cell, cellIndex) => (
            <Grid
              item
              key={`${rowIndex}-${cellIndex}`}
              sx={{
                width: '11.11%',
                paddingBottom: '11.11%',
                borderRight:
                  (cellIndex + 1) % 3 === 0 && cellIndex !== 8
                    ? '2px solid rgba(255, 255, 255, 0.3)'
                    : 'none',
                position: 'relative',
              }}
            >
              <Paper
                elevation={cell !== null ? 3 : 0}
                square
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor:
                    cell !== null
                      ? 'rgba(100, 149, 237, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow:
                    cell !== null ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
                  border: 'none',
                  width: '100%',
                  height: '100%',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1rem',
                    userSelect: 'none',
                    color: cell !== null ? '#000' : 'rgba(0, 0, 0, 0.7)',
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
