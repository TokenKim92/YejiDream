import React, { Component } from 'react';
import styles from './frame_item.module.css';

class FrameItem extends Component {
  static RATIO_TO_HEIGHT = 0.8;
  static RATIO_TO_WIDTH = 0.6;

  #left;
  #width;
  #height;
  #speed;

  constructor(props) {
    super(props);

    const horizontalInterval = 200;
    const heightRatio = this.props.frame.isVertical ? 1.6 : 0.76;
    this.#left = (Math.random() + this.props.index) * horizontalInterval; // prettier-ignore
    this.#width = Math.round(Math.random() * 100) + horizontalInterval; // prettier-ignore
    this.#height = Math.round(this.#width * heightRatio);
    this.#speed = Math.random() + 1;

    this.rootRef = React.createRef();
    this.state = { posX: this.#left };
  }

  componentDidMount() {
    const top = Math.round(
      Math.random() * (document.documentElement.clientHeight - this.#height)
    );

    this.rootRef.current.style.left = `${this.#left}px`;
    this.rootRef.current.style.top = `${top}px`;
    this.rootRef.current.style.width = `${this.#width}px`;
    this.rootRef.current.style.height = `${this.#height}px`;

    this.rootRef.current.addEventListener('pointerdown', () => {
      this.props.onFrameClick(this.props.frame);
    });
  }

  get className() {
    switch (this.props.displayType) {
      case 'detail':
        return `${styles.container} ${styles.detail}`;
      case 'disappear':
        return `${styles.container} ${styles.disappear}`;
      default:
        return `${styles.container}`;
    }
  }

  get detailSizeRatio() {
    return this.props.frame.isVertical
      ? (document.documentElement.clientHeight * FrameItem.RATIO_TO_HEIGHT) /
          this.#height
      : (document.documentElement.clientWidth * FrameItem.RATIO_TO_WIDTH) /
          this.#width;
  }

  get #frameHalfSize() {
    return {
      w: this.#width / (this.detailSizeRatio * 2),
      h: this.#height / (this.detailSizeRatio * 2),
    };
  }

  get style() {
    switch (this.props.displayType) {
      case 'detail':
        return {
          left: '50%',
          top: '50%',
          transform: `
            scale(${this.detailSizeRatio}) 
            translate(-${this.#frameHalfSize.w}px, -${this.#frameHalfSize.h}px)`,
        }; // prettier-ignore
      case 'disappear':
        return {
          transform: `
            translateX(${(this.props.posX + this.#left + this.#width) * - 1}px `,
        }; // prettier-ignore
      default:
        return {
          transform: `translateX(${this.props.posX * this.#speed}px `,
        };
    }
  }

  render() {
    return (
      <li className={this.className} ref={this.rootRef} style={this.style}>
        <div className={styles.frame}>
          <div className={styles.content}></div>
        </div>
        <p className={styles.title}>{this.props.frame.title}</p>
      </li>
    );
  }
}

export default FrameItem;
