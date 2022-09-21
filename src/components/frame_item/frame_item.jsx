import React, { PureComponent } from 'react';
import styles from './frame_item.module.css';

class FrameItem extends PureComponent {
  static RATIO_TO_HEIGHT = 0.8;
  static RATIO_TO_WIDTH = 0.6;

  #rect;
  #speed;
  #containerRef;
  #frameRef;

  constructor(props) {
    super(props);

    this.#rect = this.props.frame.rect;
    this.#speed = Math.random() + 1;

    this.#containerRef = React.createRef();
    this.#frameRef = React.createRef();
  }

  componentDidMount() {
    this.#containerRef.current.style.left = `${this.#rect.x}px`;
    this.#containerRef.current.style.top = `${this.#rect.y}px`;
    this.#frameRef.current.style.width = `${this.#rect.w}px`;
    this.#frameRef.current.style.height = `${this.#rect.h}px`;

    this.#frameRef.current.addEventListener('pointerdown', () => {
      this.props.onFrameClick(this.props.frame);
    });
  }

  get #className() {
    switch (this.props.displayType) {
      case 'detail':
        return `${styles.container} ${styles.detail}`;
      case 'disappear':
        return `${styles.container} ${styles.disappear}`;
      default:
        return `${styles.container}`;
    }
  }

  get #style() {
    switch (this.props.displayType) {
      case 'detail':
        return {
          left: '50%',
          top: '50%',
          transform: `
            scale(${this.#detailSizeRatio}) 
            translate(-${this.#frameHalfSize.w}px, -${this.#frameHalfSize.h}px)`,
        }; // prettier-ignore
      case 'disappear':
        return {
          transform: `translateX(${(this.props.frame.posX + this.#rect.x + this.#rect.w) * - 1}px `,
        }; // prettier-ignore
      default:
        return {
          transform: `translateX(${this.props.frame.posX * this.#speed}px `,
        };
    }
  }

  get #frameHalfSize() {
    return {
      w: this.#rect.w / (this.#detailSizeRatio * 2),
      h: this.#rect.h / (this.#detailSizeRatio * 2),
    };
  }

  get #detailSizeRatio() {
    const isVertical = this.#rect.h / this.#rect.w > 1;

    return isVertical
      ? (document.documentElement.clientHeight * FrameItem.RATIO_TO_HEIGHT) /
          this.#rect.h
      : (document.documentElement.clientWidth * FrameItem.RATIO_TO_WIDTH) /
          this.#rect.w;
  }

  render() {
    return (
      <li
        className={this.#className}
        ref={this.#containerRef}
        style={this.#style}>
        <div className={styles.frame} ref={this.#frameRef}>
          <img src={this.props.frame.url} className={styles.content}></img>
        </div>
        <p className={styles.title}>{this.props.frame.title}</p>
      </li>
    );
  }
}

export default FrameItem;
