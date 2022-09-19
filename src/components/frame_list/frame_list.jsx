import React from 'react';
import FrameItem from '../frame/frame_item';
import styles from './frame_list.module.css';

const FameList = ({ frames }) => (
  <ul className={styles.frames}>
    {frames.map((frame) => (
      <FrameItem key={frame.id} frame={frame} />
    ))}
  </ul>
);

export default FameList;
