import React from 'react';
import { memo } from 'react';
import styles from './frame.module.css';

const Frame = memo(({ frame }) => {
  <li className={styles.frame}>
    <p>{frame}</p>
  </li>;
});

export default Frame;
