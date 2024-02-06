import React, { useState } from 'react';
import { Grid, Paper, TextField, Typography } from '@mui/material';
import { Puzzle } from './SudokuGame';

interface SudokuBoardProps {
  puzzle: Puzzle | null;
  editableCells: boolean[][] | null;
  onCellChange?: (row: number, col: number, value: number) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  puzzle,
  editableCells,
  onCellChange,
}) => {
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );

  const shouldHighlight = (rowIndex: number, cellIndex: number) => {
    if (!selectedCell) return false;
    const [selectedRow, selectedCol] = selectedCell;
    const inSameBox =
      Math.floor(rowIndex / 3) === Math.floor(selectedRow / 3) &&
      Math.floor(cellIndex / 3) === Math.floor(selectedCol / 3);
    return rowIndex === selectedRow || cellIndex === selectedCol || inSameBox;
  };

  const handleCellValueChange = (row: number, col: number, value: string) => {
    const newValue = parseInt(value, 10);
    if (onCellChange && !isNaN(newValue) && newValue >= 1 && newValue <= 9) {
      onCellChange(row, col, newValue);
    }
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
                  : 'rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedCell([rowIndex, cellIndex])}
            >
              <Paper
                elevation={cell[0] !== 0 ? 3 : 0}
                square
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor:
                    cell[0] !== 0
                      ? 'rgba(100, 149, 237, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow:
                    cell[0] !== 0 ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
                  border: 'none',
                  width: '100%',
                  height: '100%',
                }}
              >
                {editableCells && editableCells[rowIndex][cellIndex] ? (
                  <TextField
                    variant="outlined"
                    defaultValue={cell[0] !== 0 ? cell[0] : ''}
                    onChange={(e) =>
                      handleCellValueChange(rowIndex, cellIndex, e.target.value)
                    }
                    InputProps={{
                      style: {
                        textAlign: 'center',
                        color: 'rgba(0, 0, 0, 0.7)',
                        fontSize: '1rem',
                        lineHeight: 'normal',
                      },
                    }}
                    inputProps={{ maxLength: 1 }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                      },
                      '& .MuiOutlinedInput-root': {
                        height: '100%',
                        borderRadius: '0',
                        alignItems: 'center',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '& .MuiInputBase-root': {
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      userSelect: 'none',
                      color: '#000',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    {cell[0]}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default SudokuBoard;
