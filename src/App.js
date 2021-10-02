import React, { useEffect, useReducer } from 'react';
import s from './App.module.scss';

const initialState = {
  snakeDir: 'right',
  field: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  snake: [[0, 0]],
  prevSnake: [[0, 0]],
  food: [0, 1],
  loose: false,
  win: false,
};
let direction = 'right';

function reducer(state, action) {
  switch (action.type) {
    case 'moveSnake':
      return moveSnake();
    case 'changeDir':
      return changeDir();
    case 'drawField':
      return drawField();
    default:
      throw new Error();
  }

  function drawField() {
    const newField = arrayClone(state.field);
    newField.forEach((row, i) => {
      row.forEach((col, j) => {
        newField[i][j] = 0;
      });
    });
    // if no food - win (stop game)
    if (!state.food) {
      return {...state, win: true};
    }
    // draw food on field
    newField[state.food[0]][[state.food[1]]] = 2;
    // draw snake on field
    state.snake.forEach((item) => {
      newField[item[0]][item[1]] = 1;
    });
    // check eating
    const [snakeI, snakeJ] = state.snake[state.snake.length - 1];
    const [foodI, foodJ] = state.food;
    if (snakeI === foodI && snakeJ === foodJ) {
      // if snake eat food, take prev snake in state
      // and add last elem to snake and move snake to store
      const newSnake = arrayClone(state.snake);
      newSnake.unshift([...state.prevSnake[0]]);
      // add first elem snake to field
      newField[newSnake[0][0]][newSnake[0][1]] = 1;
      state.snake = newSnake;
      state.food = placeForFood(newField);
    }
    return { ...state, field: newField };
  }

  function placeForFood(newField) {
    const arrForFood = [];
    newField.forEach((item, i) => {
      item.forEach((item, j) => {
        if (newField[i][j] === 0) {
          arrForFood.push([i, j]);
        }
      });
    });
    return arrForFood[getRandomInt(arrForFood.length - 1)];
  }

  function moveSnake() {
    const prevSnake = arrayClone(state.snake);
    const newSnake = arrayClone(state.snake);
    newSnake.push([...newSnake[newSnake.length - 1]]);
    switch (state.snakeDir) {
      case 'right':
        newSnake[newSnake.length - 1][1] += 1;
        break;
      case 'left':
        newSnake[newSnake.length - 1][1] -= 1;
        break;
      case 'top':
        newSnake[newSnake.length - 1][0] -= 1;
        break;
      case 'bottom':
        newSnake[newSnake.length - 1][0] += 1;
        break;
      default:
        break;
    }
    newSnake.shift();
    // for looking direction after move
    direction = state.snakeDir;
    // check walls
    if (newSnake[newSnake.length - 1][0] >= state.field.length ||
      newSnake[newSnake.length - 1][1] >= state.field[0].length ||
      newSnake[newSnake.length - 1][0] < 0 ||
      newSnake[newSnake.length - 1][1] < 0) {
      return { ...state, loose: true };
    }
    // if snake is ok return new snake
    return { ...state, snake: newSnake, prevSnake: prevSnake };
  }

  function changeDir() {
    state.snakeDir = action.dir;
    return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.loose) {
      return;
    }
    window.addEventListener("keydown", setSnakeDirection);
    return () => {
      window.removeEventListener("keydown", setSnakeDirection);
    };
  }, [state.loose]);

  useEffect(() => {
    if (state.win) {
      return;
    }
    const timer = setInterval(() => {
      dispatch({ type: 'moveSnake' });
      dispatch({ type: 'drawField' });
    }, 500);
    return () => clearInterval(timer);
  }, [state.win]);

  function setSnakeDirection(e) {
    switch (e.code) {
      case 'ArrowUp':
        if (direction !== 'bottom') {
          dispatch({ type: 'changeDir', dir: 'top' });
        }
        break;
      case 'ArrowRight':
        if (direction !== 'left') {
          dispatch({ type: 'changeDir', dir: 'right' });
        }
        break;
      case 'ArrowLeft':
        if (direction !== 'right') {
          dispatch({ type: 'changeDir', dir: 'left' });
        }
        break;
      case 'ArrowDown':
        if (direction !== 'top') {
          dispatch({ type: 'changeDir', dir: 'bottom' });
        }
        break;
      default:
        break;
    }
  }

  return (
    <div className={s['field']}>
      {state.loose && <div>Вы проиграли</div>}
      {state.win && <div>Вы выиграли</div>}
      {state.field.map((row, i) => {
        return (
          <div className={s['field__row']} key={i}>
            {row.map((col, j) => {
              return (
                <div
                  className={
                    s['field__col'] + ' ' + s[`_${col}`]
                  }
                  key={j}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default App;

function arrayClone(arr) {
  let i, copy;

  if (Array.isArray(arr)) {
    copy = arr.slice(0);
    for (i = 0; i < copy.length; i++) {
      copy[i] = arrayClone(copy[i]);
    }
    return copy;
  } else if (typeof arr === 'object') {
    throw new Error();
  } else {
    return arr;
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}