import React, { Component } from 'react';
import FrameItem from '../frame_item/frame_item';
import ProgressSheep from '../progress_sheep/progress_sheep';
import styles from './gallery.module.css';

class Gallery extends Component {
  static AUTO_MOVING_SPEED = 0.5;
  static MANUAL_MOVING_SPEED = 7;
  static FRAME = 60;
  static FRAME_TIME = Math.floor(1000 / Gallery.FRAME);
  static RIGHT = 1;
  static LEFT = -1;

  #frameOffset;
  #isClicked;
  #clickedPosX;
  #stageSize;
  #stopMoveFrameTimer;
  #toBeReappear = false;
  #lastFrameRect;
  #orgLastFramePosX;

  constructor(props) {
    super(props);
    this.rootRef = React.createRef();

    this.#frameOffset = 1.3;
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

    this.#lastFrameRect = this.state.frames[this.state.frames.length - 1].rect;
    this.#orgLastFramePosX = this.#lastFrameRect.x;
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
    const minWidth = this.#stageSize.w / 7;
    const width = Math.round(Math.random() * minWidth * 0.7) + minWidth;
    const height = Math.round(width * aspectRatio);
    const horizontalInterval = 300;
    const basicPosX = this.#stageSize.w / 2;
    const divider = 3;

    return {
      w: width,
      h: height,
      x: Math.round((Math.random() + index) * horizontalInterval) + basicPosX,
      y: Math.round(
        ((Math.random() + (index % divider)) * (this.#stageSize.h - height)) /
          divider
      ),
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

      this.#toBeReappear = true;
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
      const frameRect = frame.rect;
      frameRect.x += Math.round(velocity * frame.acceleration);

      const isLastFrame = this.state.frames.length - 1 === index;
      isLastFrame && this.#onLastFrameShowed(frameRect);

      const offset = this.#frameOffset * Gallery.LEFT;
      const isInStage = frameRect.w * offset < frameRect.x && frameRect.x < this.#stageSize.w; // prettier-ignore
      if (isInStage) {
        return { ...frame };
      }

      return frame;
    });

    this.setState({ ...this.state, frames });
  }

  #onLastFrameShowed(frameRect) {
    const isCameIntoStage = frameRect.x < this.#stageSize.w - frameRect.w * this.#frameOffset; // prettier-ignore
    if (isCameIntoStage) {
      this.#isMoving && this.#stopMoveFrameTimer();
      this.#stopMoveFrameTimer = undefined;
    }
  }

  get #isMoving() {
    return this.#stopMoveFrameTimer !== undefined;
  }

  getDisplayType(frame) {
    if (!this.state.selectedFrame) {
      if (!this.#toBeReappear) {
        return 'default';
      }

      this.rootRef.current.removeEventListener('mousemove', this.#moveFrame);

      const lastFrame = this.state.frames[this.state.frames.length - 1];
      if (lastFrame === frame) {
        this.#toBeReappear = false;
        // this time should be same the 'transition' of .container.appear in frame_item.module.css.
        setTimeout(() => {
          this.#setMoveFrameTimer();
          this.rootRef.current.addEventListener('mousemove', this.#moveFrame);
        }, 800);
      }

      return 'reappear';
    }

    if (this.state.selectedFrame === frame) {
      return 'detail';
    }

    const offset = this.#frameOffset * Gallery.LEFT;
    const isInStage = frame.rect.w * offset < frame.rect.x && frame.rect.x < this.#stageSize.w; // prettier-ignore
    if (isInStage) {
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

  get #containerClassName() {
    return this.#isClicked
      ? `${styles.container} ${styles.grabbing}`
      : styles.container;
  }

  get #progressPosX() {
    const posOffset =
      -this.#stageSize.w + this.#lastFrameRect.w * this.#frameOffset;
    const posX =
      ((this.#lastFrameRect.x + posOffset) * this.#stageSize.w) /
      (this.#orgLastFramePosX + posOffset);

    return posX;
  }

  render() {
    return (
      <div ref={this.rootRef} className={this.#containerClassName}>
        <p className={styles.title}>
          Yeji <br /> Dream
        </p>
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
        <ProgressSheep
          posX={this.#progressPosX}
          toBeDisappear={!!this.state.selectedFrame}
        />
      </div>
    );
  }
}

export default Gallery;
