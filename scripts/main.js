
import { Board } from './Board.js';

let elBoard = document.querySelector('.board');

let newBoard = new Board(elBoard);

newBoard.setBoard();
