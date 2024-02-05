import React from 'react';
import './App.css';
import {
  Container,
  Typography,
  Button,
  Grid,
  ThemeProvider,
  createTheme,
} from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <Typography variant="h2" gutterBottom>
          ZKP Sudoku Protocol
        </Typography>
        <Grid container spacing={3}>
          {/* Grid for Sudoku board or other components */}
        </Grid>
        <Button variant="contained" color="primary" style={{ margin: '10px' }}>
          Generate Puzzle
        </Button>
        <Button variant="contained" color="secondary">
          Verify
        </Button>
      </Container>
    </ThemeProvider>
  );
}

export default App;
