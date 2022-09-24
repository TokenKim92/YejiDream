import React, { PureComponent } from 'react';
import styles from './frame_item.module.css';

class FrameItem extends PureComponent {
  static RATIO_TO_HEIGHT = 0.7;
  static RATIO_TO_WIDTH = 0.5;

  #rect;
  #containerRef;
  #frameRef;

  constructor(props) {
    super(props);

    this.#rect = this.props.frame.rect;
    this.#containerRef = React.createRef();
    this.#frameRef = React.createRef();
  }

  componentDidMount() {
    this.#containerRef.current.style.top = `${this.#rect.y}px`;
    this.#containerRef.current.style.width = `${this.#rect.w}px`;
    this.#containerRef.current.style.height = `${this.#rect.h}px`;

    this.#frameRef.current.addEventListener('pointerdown', (event) => {
      this.props.onFrameClick(this.props.frame);
      event.stopPropagation();
    });
  }

  get #className() {
    switch (this.props.displayType) {
      case 'detail':
        return `${styles.container} ${styles.detail}`;
      case 'disappear':
      case 'reappear':
        return `${styles.container} ${styles.appear}`;
      default:
        return `${styles.container} ${styles.default}`;
    }
  }

  get #style() {
    switch (this.props.displayType) {
      case 'detail':
        return {
          width: `${this.#rect.w * this.#detailSizeRatio}px`,
          height: `${this.#rect.h * this.#detailSizeRatio}px`,
          transform: `translate(${this.#centerPosition.x}px, ${this.#centerPosition.y}px)`,
        }; // prettier-ignore
      case 'disappear':
        const offset = -1.3;
        return { transform: `translateX(${this.#rect.w * offset}px ` };
      case 'reappear':
        return {
          transform: `translateX(${this.#rect.x}px `,
        };
      default:
        return { transform: `translateX(${this.#rect.x}px ` };
    }
  }

  get #centerPosition() {
    return {
      x: Math.round(
        (document.documentElement.clientWidth - this.#rect.w * this.#detailSizeRatio) / 2
      ),
      y: Math.round(
        (document.documentElement.clientHeight - this.#rect.h * this.#detailSizeRatio) / 2 - this.#rect.y
      )
    }; // prettier-ignore
  }

  get #detailSizeRatio() {
    const isVertical = this.#rect.h / this.#rect.w > 1;

    return isVertical
      ? (document.documentElement.clientHeight * FrameItem.RATIO_TO_HEIGHT) / this.#rect.h
      : (document.documentElement.clientWidth * FrameItem.RATIO_TO_WIDTH) / this.#rect.w; // prettier-ignore
  }

  render() {
    return (
      <li
        className={this.#className}
        ref={this.#containerRef}
        style={this.#style}>
        <div className={styles.frame} ref={this.#frameRef}>
          {this.props.displayType === 'detail' ? (
            // <iframe
            //   className={styles.iframe}
            //   type='text/html'
            //   width='100%'
            //   height='100%'
            //   src={`https://www.youtube.com/embed/${this.props.frame.id}?autoplay=1&loop=1`}
            //   frameBorder='0'
            //   allowFullScreen
            // />
            <div />
          ) : (
            <img src={this.props.frame.url} className={styles.content}></img>
          )}
        </div>
        <p className={styles.title}>{this.props.frame.title}</p>
      </li>
    );
  }
}

export default FrameItem;
