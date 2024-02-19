# Sudoku Zero-Knowledge Proof Implementation

This repository contains the implementation of a Sudoku game designed to demonstrate the concept of Zero-Knowledge Proofs (ZKP). The project is divided into two main parts: the client-side, which presents the Sudoku game interface and handles puzzle generation and solution submission, and the server-side, which performs verification of the solutions submitted in a way that adheres to the principles of ZKP.

![Sudoku Game Interface](/client/public/game.png)
## Features

- **Sudoku Puzzle Generation:** Dynamically generates Sudoku puzzles for users to solve.
- **Solution Verification:** Employs Zero-Knowledge Proof methodology to verify the correctness of the user's solution without revealing the solution itself.
- **Feedback System:** Provides detailed feedback on verification failure, guiding users towards the correct solution without compromising the puzzle's integrity.
- **Privacy-Preserving:** Ensures that the solution details are not exposed, maintaining the ZKP property.

### Installation

Before starting, make sure you have a `.env` file set up in both the client and server directories with the necessary environment variables.

#### Client-side Setup

1. Navigate to the `client` directory:

```
cd client
```
2. Create a .env file with the following content to specify the server URL:
```
REACT_APP_SERVER_URL=http://localhost:4000
```
3. Install dependencies and start the application:
```
npm install
npm start
```
The client-side application will be available at http://localhost:3000.

#### Server-side Setup

1. Navigate to the server directory:

```
cd server
```
2. Create a .env file with the following content to specify the port:
```
PORT=4000
```
3. Install dependencies and start the server:
```
npm install
npm run start
```

The server will start and listen for requests on http://localhost:4000.

#### Usage
1. Generate Puzzle: Click on "Generate Puzzle" to start a new Sudoku game.
2. Solve Puzzle: Fill in the Sudoku puzzle with your solutions.
3. Verify Knowledge: Submit your solution for verification without revealing the solution itself.
4. Review Feedback: If the verification fails, review the feedback provided to correct your solution.
