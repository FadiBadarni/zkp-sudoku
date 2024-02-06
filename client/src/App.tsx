import './App.css';
import {
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import SudokuGame from './SudokuGame';

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
      <CssBaseline />
      <Container
        maxWidth="lg"
        sx={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          ZKP Sudoku Protocol
        </Typography>
        <SudokuGame />
      </Container>
    </ThemeProvider>
  );
}

export default App;
