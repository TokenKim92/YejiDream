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

    this.state = {
      toBeShowVideo: false,
    };
  }

  componentDidMount() {
    this.#containerRef.current.style.top = `${this.#rect.y}px`;

    this.#frameRef.current.addEventListener('pointerdown', (event) => {
      this.props.onFrameClick(this);
      event.stopPropagation();
    });
  }

  setShowVideoTimer() {
    setTimeout(() => {
      this.setState({ toBeShowVideo: true });
    }, 1500);
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
        return {
          width: `${this.#rect.w}px`,
          height: `${this.#rect.h}px`,
          transform: `translateX(${this.#rect.w * offset}px `,
        };
      case 'reappear':
      default:
        return {
          width: `${this.#rect.w}px`,
          height: `${this.#rect.h}px`,
          transform: `translateX(${this.#rect.x}px `,
        };
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
    const contentsTag = !this.state.toBeShowVideo ? (
      <></>
    ) : (
      <iframe
        className={styles.iframe}
        type='text/html'
        src={`https://www.youtube.com/embed/${this.props.frame.id}?autoplay=1&mute=1`}
        frameBorder='0'
        allowFullScreen
      />
    );
    this.state.toBeShowVideo && (this.state.toBeShowVideo = false);

    return (
      <li
        ref={this.#containerRef}
        className={this.#className}
        style={this.#style}>
        <div ref={this.#frameRef} className={styles.frame}>
          <img src={this.props.frame.url} className={styles.content} />
          {contentsTag}
        </div>
        <p className={styles.title}>{this.props.frame.title}</p>
      </li>
    );
  }
}

export default FrameItem;
