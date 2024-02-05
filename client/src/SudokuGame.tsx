import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography } from '@mui/material';
import SudokuBoard from './SudokuBoard';

type PuzzleCell = number | null;
type PuzzleRow = PuzzleCell[];
type Puzzle = PuzzleRow[];

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

const SudokuGame: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [puzzleId, setPuzzleId] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [inputValue, setInputValue] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string>('');

  const generatePuzzle = async () => {
    try {
      const response = await axiosInstance.get<{
        puzzleId: string;
        puzzle: Puzzle;
      }>('/generate-puzzle');
      setPuzzleId(response.data.puzzleId);
      setPuzzle(response.data.puzzle);
    } catch (error) {
      console.error('Error fetching the puzzle:', error);
    }
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell([row, col]);
  };

  const updateCell = (value: number) => {
    if (selectedCell && puzzle) {
      const [row, col] = selectedCell;
      const newPuzzle = JSON.parse(JSON.stringify(puzzle));
      newPuzzle[row][col] = value;
      setPuzzle(newPuzzle);
    }
  };

  const verifySolution = async (rowPacket: any, rowIndex: number) => {
    if (!puzzleId) return;

    try {
      const response = await axiosInstance.post('/verify-solution', {
        puzzleId,
        packet: rowPacket,
        rowIndex,
      });

      setVerificationResult(
        response.data.verified ? 'Verified' : 'Verification failed'
      );
    } catch (error) {
      console.error('Error verifying the solution:', error);
    }
  };

  const handleVerifySelection = () => {
    if (selectedCell && puzzle) {
      const rowIndex = selectedCell[0];
      const rowPacket = puzzle[rowIndex];

      verifySolution(rowPacket, rowIndex);
    }
  };

  return (
    <>
      <SudokuBoard puzzle={puzzle} onCellSelect={handleCellSelect} />
      <Button variant="contained" color="primary" onClick={generatePuzzle}>
        Generate Puzzle
      </Button>
      {verificationResult && (
        <Typography style={{ color: 'white', marginTop: '10px' }}>
          Verification Result: {verificationResult}
        </Typography>
      )}
      {selectedCell && (
        <>
          <Typography style={{ color: 'white', marginTop: '10px' }}>
            Selected Cell: Row {selectedCell[0] + 1}, Column{' '}
            {selectedCell[1] + 1}
          </Typography>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue) {
                updateCell(parseInt(inputValue, 10));
                setInputValue('');
              }
            }}
            min="1"
            max="9"
            style={{ marginLeft: '10px' }}
          />
        </>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleVerifySelection}
        disabled={!selectedCell}
      >
        Verify Selected Area
      </Button>
    </>
  );
};

export default SudokuGame;
