import React from 'react';
import Frame from '../frame/frame';
import styles from './frame_list.module.css';

const FameList = ({ frames }) => (
  <ul className={styles.frames}>
    {frames.map((frame) => (
      <Frame key={frame} frame={frame} />
    ))}
  </ul>
);

export default FameList;
