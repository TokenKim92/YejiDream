import React, { Component } from 'react';
import imageSrc from './sheep.png';
import styles from './progress_sheep.module.css';

class ProgressSheep extends Component {
  static IMAGE_WIDTH = 72;
  static IMAGE_HEIGHT = 60;
  static TOTAL_FRAME = 8;
  static FPS = 24;
  static FPS_TIME = 1000 / ProgressSheep.FPS;

  #canvasRef;
  #ctx;
  #img;
  #prevTime = 0;
  #curFrame = 0;

  constructor(props) {
    super(props);

    this.#canvasRef = React.createRef();
    this.#img = new Image();
    this.#img.src = imageSrc;
  }

  componentDidMount() {
    this.#ctx = this.#canvasRef.current.getContext('2d');
    this.#canvasRef.current.width = ProgressSheep.IMAGE_WIDTH;
    this.#canvasRef.current.height = ProgressSheep.IMAGE_HEIGHT;

    window.requestAnimationFrame(this.animate);
  }

  animate = (curTime) => {
    if (!this.#prevTime) {
      this.#prevTime = curTime;
    }

    const isOnFPSTime = curTime - this.#prevTime > ProgressSheep.FPS_TIME;
    if (isOnFPSTime) {
      this.#prevTime = curTime;
      this.#curFrame = (this.#curFrame + 1) % ProgressSheep.TOTAL_FRAME;

      this.#ctx.clearRect(
        0,
        0,
        ProgressSheep.IMAGE_WIDTH,
        ProgressSheep.IMAGE_HEIGHT
      );
      this.#ctx.drawImage(
        this.#img,
        ProgressSheep.IMAGE_WIDTH * this.#curFrame,
        0,
        ProgressSheep.IMAGE_WIDTH,
        ProgressSheep.IMAGE_HEIGHT,
        0,
        0,
        ProgressSheep.IMAGE_WIDTH,
        ProgressSheep.IMAGE_HEIGHT
      );
    }

    window.requestAnimationFrame(this.animate);
  };

  get #className() {
    return this.props.toBeDisappear
      ? `${styles.container} ${styles.disappear}`
      : `${styles.container}`;
  }

  get #style() {
    return { transform: `translateX(${this.props.posX}px)` };
  }

  render() {
    return (
      <canvas
        ref={this.#canvasRef}
        className={this.#className}
        style={this.#style}
      />
    );
  }
}

export default ProgressSheep;
