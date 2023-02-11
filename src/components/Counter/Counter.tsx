import { useState, VFC } from 'react';

import styles from './Counter.module.css';

interface CounterProps {
  start?: number;
}

export const Counter: VFC<CounterProps> = ({ start = 0 }) => {
  const [count, setCount] = useState(start);

  const handleIncrement = () => setCount(count + 1);

  const handleDecrement = () => setCount(count - 1);

  return (
    <div className={styles.counterWrapper}>
      <button className={styles.button} onClick={handleIncrement}>
        +
      </button>
      <p>{count}</p>
      <button className={styles.button} onClick={handleDecrement}>
        -
      </button>
    </div>
  );
};
