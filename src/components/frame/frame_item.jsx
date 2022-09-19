import React from 'react';
import styles from './frame_item.module.css';

const FrameItem = ({ frame }) => {
  const isVertical = !!(frame.id % 2); // TODO: logic should be reimplemented later width object
  const width = Math.round(Math.random() * 50) + 150;
  const heightRatio = isVertical ? 1.5 : 2 / 3;
  const height = Math.round(width * heightRatio);

  return (
    <div className={styles.container}>
      <li
        className={styles.frame}
        style={{ width: `${width}px`, height: `${height}px` }}>
        <div className={styles.content}></div>
      </li>
      <p className={styles.title}>{frame.title}</p>
    </div>
  );
};

export default FrameItem;
