import React, { Component } from 'react';
import FrameItem from '../frame_item/frame_item';
import styles from './gallery.module.css';

class Gallery extends Component {
  static AUTO_MOVING_SPEED = 0.5;
  static MANUAL_MOVING_SPEED = 5;
  static FRAME = 60;
  static FRAME_TIME = Math.floor(1000 / Gallery.FRAME);
  static HORIZONTAL_INTERVAL = 200;
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
        posX: rect.x,
        acceleration: Math.random() + 1,
      };
    });
  }

  #calculateRect(aspectRatio, index) {
    const width = Math.round(Math.random() * 100) + Gallery.HORIZONTAL_INTERVAL;
    const height = Math.round(width * aspectRatio);

    return {
      w: width,
      h: height,
      x: Math.round((Math.random() + index) * Gallery.HORIZONTAL_INTERVAL),
      y: Math.round(Math.random() * (this.#stageSize.h - height)),
    };
  }

  #setClickedState = (event) => {
    if (!this.#isClicked) {
      this.rootRef.current.setPointerCapture(event.pointerId);
      this.#isClicked = true;
      this.#clickedPosX = event.clientX;
    }
  };

  #setReleasedState = (event) => {
    if (this.#isClicked) {
      this.rootRef.current.releasePointerCapture(event.pointerId);
      this.#isClicked = false;
    }
  };

  #moveFrame = (event) => {
    if (this.#isClicked) {
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
      frame.posX += Math.round(velocity * frame.acceleration);
      const offset = -1.3;
      const boundary = {
        left: (frame.rect.x + frame.rect.w) * offset,
        right: this.#stageSize.w - frame.rect.x,
      };

      if (this.state.frames.length - 1 === index && frame.posX < boundary.right) {
        this.#stopMoveFrameTimer && this.#stopMoveFrameTimer();
        this.#stopMoveFrameTimer = undefined;
      } // prettier-ignore

      const isInBoundary = boundary.left < frame.posX && frame.posX < boundary.right; // prettier-ignore
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

  getDisplayType(frame) {
    if (!this.state.selectedFrame) {
      return 'list';
    }

    return this.state.selectedFrame === frame ? 'detail' : 'disappear';
  }

  selectFrame = (frame) => {
    const state = {
      ...this.state,
      selectedFrame: frame,
    };
    this.setState(state);

    this.#stopMoveFrameTimer();
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
