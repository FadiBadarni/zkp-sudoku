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
    // Convert the input value to an integer or use 0 if the input is empty
    const newValue = value ? parseInt(value, 10) : 0;

    // Call onCellChange only if the value is within the valid range or is being cleared
    if (onCellChange && !isNaN(newValue) && newValue >= 0 && newValue <= 9) {
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
        backgroundColor: '#121212',
      }}
    >
      {puzzle.map((row, rowIndex) => (
        <Grid
          container
          item
          key={rowIndex}
          justifyContent="center"
          sx={{
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
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#313131',
                },
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
                  backgroundColor: shouldHighlight(rowIndex, cellIndex)
                    ? '#646464' // Highlighted background color
                    : cell[0] !== 0
                    ? '#333333' // Non-highlighted, filled cell background color
                    : '#2D2D2D', // Non-highlighted, empty cell background color
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#E0E0E0',
                  boxShadow: 'none',
                  width: '100%',
                  height: '100%',
                  transition: 'background-color 0.3s ease',
                }}
              >
                {editableCells && editableCells[rowIndex][cellIndex] ? (
                  <TextField
                    variant="outlined"
                    value={cell[0] !== 0 ? cell[0].toString() : ''}
                    onChange={(e) =>
                      handleCellValueChange(rowIndex, cellIndex, e.target.value)
                    }
                    autoComplete="off"
                    InputProps={{
                      style: {
                        textAlign: 'center',
                        color: 'rgba(0, 0, 0, 0.7)',
                        fontSize: '1rem',
                        lineHeight: 'normal',
                        width: '100%',
                        height: '100%',
                      },
                    }}
                    inputProps={{ maxLength: 1 }}
                    sx={{
                      width: '100%',
                      height: '100%',

                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                        color: '#E0E0E0',
                        cursor: 'pointer',
                      },
                      '& .MuiOutlinedInput-root': {
                        height: '100%',
                        alignItems: 'center',
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        borderRadius: 0,
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
