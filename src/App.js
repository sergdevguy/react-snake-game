import React, { useState, useEffect, useReducer } from 'react';
import s from './App.module.scss';

const initialState = {
  snakeDir: 'right',
  field: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  snake: [[6, 1], [6, 2], [6, 3]],
};

function reducer(state, action) {
  switch (action.type) {
    case 'changeDir':
      state.snakeDir = action.dir;
      return state;
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
    state.snake.forEach((item) => {
      newField[item[0]][item[1]] = 1;
    })
    return { ...state, field: newField, snake: moveSnake() };
  }

  function moveSnake() {
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
    }
    newSnake.shift();
    return newSnake;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    window.addEventListener("keydown", setSnakeDirection);
    return () => {
      window.removeEventListener("keydown", setSnakeDirection);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'drawField' });
      console.log(state.snake);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  function setSnakeDirection(e) {
    switch (e.code) {
      case 'ArrowUp':
        dispatch({ type: 'changeDir', dir: 'top' });
        break;
      case 'ArrowRight':
        dispatch({ type: 'changeDir', dir: 'right' });
        break;
      case 'ArrowLeft':
        dispatch({ type: 'changeDir', dir: 'left' });
        break;
      case 'ArrowDown':
        dispatch({ type: 'changeDir', dir: 'bottom' });
        break;
      default:
        break;
    }
  }

  return (
    <div className={s['field']}>
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
                >{col}</div>
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
    throw 'Cannot clone array containing an object!';
  } else {
    return arr;
  }
}