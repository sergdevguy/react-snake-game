import React, { useState, useEffect, useReducer } from 'react';
import s from './App.module.scss';

const initialState = {
  count: 0, 
  test: 2,
  snakeDir: 'right',

};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);

  const [snakeDir, setSnakeDir] = useState('right');
  const [field, setField] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [snake, setSnake] = useState([[3, 1], [3, 2]]);

  useEffect(() => {
    drawSnake();
    window.addEventListener("keydown", setSnakeDirection);
    return () => {
      window.removeEventListener("keydown", setSnakeDirection);
    };
  }, [snake, snakeDir]);

  useEffect(() => {
    const timer = setInterval(() => {
      resetField();
      moveSnake();
    }, 1000);
    return () => clearInterval(timer);
  }, [field]);

  function setSnakeDirection(e) {
    switch (e.code) {
      case 'ArrowUp':
        setSnakeDir('up');
        break;
      case 'ArrowRight':
        setSnakeDir('right');
        break;
      default:
        break;
    }
  }

  function resetField() {
    let clonedField = arrayClone(field);
    clonedField = clonedField.map((row) => {
      return row.map((col) => {
        return 0;
      });
    });
    setField(clonedField);
  }

  function drawSnake() {
    const clonedField = arrayClone(field);
    snake.forEach((item) => {
      clonedField[item[0]][item[1]] = 1;
    });
    setField(clonedField);
  }

  function moveSnake() {
    const clonedSnake = arrayClone(snake);
    const lastElement = clonedSnake[clonedSnake.length - 1];
    switch (snakeDir) {
      case 'right':
        clonedSnake.push([lastElement[0], lastElement[1] + 1]);
        break;
      case 'up':
        clonedSnake.push([lastElement[0] - 1, lastElement[1]]);
        break;
    }
    clonedSnake.shift();
    setSnake(clonedSnake);
  }

  return (
    <div className={s['field']}>
      {field.map((row, i) => {
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