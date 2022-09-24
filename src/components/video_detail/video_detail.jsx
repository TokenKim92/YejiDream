import React from 'react';
import styles from './video_detail.module.css';

const VideoDetail = ({ video, video: { snippet } }) => (
    <iframe
      className={styles.video}
      type='text/html'
      width='100%'
      height='500px'
      src={`https://www.youtube.com/embed/${OXobV9ChELY}`}
      frameBorder='0'
      allowFullScreen></iframe>
);

export default VideoDetail;
