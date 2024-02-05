import React, { useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';

type PuzzleCell = number | null;
type PuzzleRow = PuzzleCell[];
type Puzzle = PuzzleRow[];

interface SudokuBoardProps {
  puzzle: Puzzle | null;
  onCellSelect?: (row: number, col: number) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ puzzle, onCellSelect }) => {
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    setSelectedCell([rowIndex, cellIndex]);
    if (onCellSelect) {
      onCellSelect(rowIndex, cellIndex);
    }
  };

  const shouldHighlight = (rowIndex: number, cellIndex: number) => {
    if (!selectedCell) return false;
    const [selectedRow, selectedCol] = selectedCell;
    // Highlight if same row, column, or in the same 3x3 grid
    const inSameBox =
      Math.floor(rowIndex / 3) === Math.floor(selectedRow / 3) &&
      Math.floor(cellIndex / 3) === Math.floor(selectedCol / 3);
    return rowIndex === selectedRow || cellIndex === selectedCol || inSameBox;
  };

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
                backgroundColor: shouldHighlight(rowIndex, cellIndex)
                  ? 'rgba(255, 235, 59, 0.3)'
                  : '',
                cursor: 'pointer',
              }}
              onClick={() => handleCellClick(rowIndex, cellIndex)}
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
