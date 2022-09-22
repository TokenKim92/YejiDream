import React, { Component } from 'react';
import FrameItem from '../frame_item/frame_item';
import styles from './gallery.module.css';

class Gallery extends Component {
  static AUTO_MOVING_SPEED = 0.5;
  static MANUAL_MOVING_SPEED = 5;
  static FRAME = 60;
  static FRAME_TIME = Math.floor(1000 / Gallery.FRAME);
  static RIGHT = 1;
  static LEFT = -1;

  #isClicked;
  #clickedPosX;
  #stageSize;
  #stopMoveFrameTimer;

  constructor(props) {
    super(props);
    this.rootRef = React.createRef();

    this.#isClicked = false;
    this.#clickedPosX = 0;
    this.#stageSize = {
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    };

    this.state = {
      frames: this.#initFrames(),
      selectedFrame: undefined,
    };
  }

  componentDidMount() {
    this.rootRef.current.addEventListener('pointerdown', this.#setClickedState);
    this.rootRef.current.addEventListener('pointerup', this.#setReleasedState);
    this.rootRef.current.addEventListener('mousemove', this.#moveFrame);

    this.#setMoveFrameTimer();
  }

  #initFrames() {
    const youtubeItems = this.props.youtube.getItems();

    return youtubeItems.map((item, index) => {
      const aspectRatio =
        item.snippet.thumbnails.high.height /
        item.snippet.thumbnails.high.width;

      const rect = this.#calculateRect(aspectRatio, index);

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        url: item.snippet.thumbnails.high.url,
        rect: rect,
        acceleration: Math.random() + 1,
      };
    });
  }

  #calculateRect(aspectRatio, index) {
    const minWidth = 200;
    const width = Math.round(Math.random() * 200) + minWidth;
    const height = Math.round(width * aspectRatio);
    const horizontalInterval = 300;

    return {
      w: width,
      h: height,
      x: Math.round((Math.random() + index) * horizontalInterval),
      y: Math.round(Math.random() * (this.#stageSize.h - height)),
    };
  }

  #setClickedState = (event) => {
    if (this.#isClicked) {
      return;
    }

    this.rootRef.current.setPointerCapture(event.pointerId);
    this.#isClicked = true;
    this.#clickedPosX = event.clientX;

    if (this.state.selectedFrame) {
      const state = {
        ...this.state,
        selectedFrame: null,
      };
      this.setState(state);
      this.#setMoveFrameTimer();
    }
  };

  #setReleasedState = (event) => {
    if (this.#isClicked) {
      this.rootRef.current.releasePointerCapture(event.pointerId);
      this.#isClicked = false;
    }
  };

  #moveFrame = (event) => {
    if (!this.#isClicked || this.state.selectedFrame) {
      return;
    }

    const movingDirection =
      event.clientX - this.#clickedPosX > 0 ? Gallery.RIGHT : Gallery.LEFT;
    this.#clickedPosX = event.clientX;

    if (this.#isMoving) {
      this.#updateFrames(Gallery.MANUAL_MOVING_SPEED * movingDirection);
      return;
    }

    if (movingDirection === Gallery.RIGHT) {
      this.#updateFrames(Gallery.MANUAL_MOVING_SPEED * movingDirection);
      this.#setMoveFrameTimer();
    }
  };

  #setMoveFrameTimer = () => {
    const interval = setInterval(() => {
      this.#updateFrames(-Gallery.AUTO_MOVING_SPEED);
    }, Gallery.FRAME_TIME);

    this.#stopMoveFrameTimer = () => clearInterval(interval);
  };

  #updateFrames(velocity) {
    const frames = this.state.frames.map((frame, index) => {
      frame.rect.x += Math.round(velocity * frame.acceleration);

      const boundary = this.#getBoundary(frame);
      if (this.state.frames.length - 1 === index && frame.rect.x < boundary.right) {
        this.#isMoving && this.#stopMoveFrameTimer();
        this.#stopMoveFrameTimer = undefined;
      } // prettier-ignore

      const isInBoundary = boundary.left < frame.rect.x && frame.rect.x < boundary.right; // prettier-ignore
      if (isInBoundary) {
        return { ...frame };
      }

      return frame;
    });

    this.setState({ ...this.state, frames });
  }

  get #isMoving() {
    return this.#stopMoveFrameTimer !== undefined;
  }

  #getBoundary(frame) {
    const offset = -1.3;
    return {
      left: frame.rect.w * offset,
      right: this.#stageSize.w,
    };
  }

  getDisplayType(frame) {
    if (!this.state.selectedFrame) {
      return 'default';
    }

    if (this.state.selectedFrame === frame) {
      return 'detail';
    }

    const boundary = this.#getBoundary(frame);
    const isInBoundary =
      boundary.left < frame.rect.x && frame.rect.x < boundary.right;

    if (isInBoundary) {
      return 'disappear';
    }
  }

  selectFrame = (frame) => {
    const state = {
      ...this.state,
      selectedFrame: frame,
    };
    this.setState(state);

    this.#isMoving && this.#stopMoveFrameTimer();
  };

  render() {
    return (
      <div
        ref={this.rootRef}
        className={this.#isClicked ? styles.grabbing : styles.container}>
        <ul>
          {this.state.frames.map((frame) => {
            return (
              <FrameItem
                key={frame.id}
                frame={frame}
                onFrameClick={this.selectFrame}
                displayType={this.getDisplayType(frame)}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Gallery;
