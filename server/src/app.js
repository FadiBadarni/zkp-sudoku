require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const generatePuzzleRoute = require('./controllers/boardController');

const app = express();
const port = process.env.PORT ;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

generatePuzzleRoute(app);

app.get('/', (req, res) => {
    res.send('ZKP Sudoku Server Running');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
