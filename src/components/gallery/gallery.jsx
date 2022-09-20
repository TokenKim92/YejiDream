import React, { Component } from 'react';
import FrameItem from '../frame_item/frame_item';
import styles from './gallery.module.css';

class Gallery extends Component {
  static AUTO_MOVING_SPEED = 0.5;
  static MANUAL_MOVING_SPEED = 5;
  static FRAME = 60;
  static FRAME_TIME = Math.floor(1000 / Gallery.FRAME);

  #stopMoveFrameTimer;

  constructor() {
    super();
    this.rootRef = React.createRef();

    this.count = 0;
    this.isClicked = false;
    this.clickedPosX = 0;
    this.posX = 0;
    this.selectedFrame = null;

    this.frames = [
      { id: this.count++, title: 'example1', content: '', isVertical: true },
      { id: this.count++, title: 'example2', content: '', isVertical: false },
      { id: this.count++, title: 'example3', content: '', isVertical: false },
    ];

    this.state = {
      posX: 0,
      selectedFrame: null,
    };
  }

  selectFrame = (frame) => {
    const state = {
      ...this.state,
      selectedFrame: frame,
    };
    this.setState(state);

    this.stopMoveFrameTimer();
  };

  componentDidMount() {
    this.rootRef.current.addEventListener('pointerdown', this.setClickedState);
    this.rootRef.current.addEventListener('pointerup', this.setReleasedState);
    this.rootRef.current.addEventListener('mousemove', this.moveFrame);

    this.stopMoveFrameTimer = this.setMoveFrameTimer();
  }

  setClickedState = (event) => {
    if (!this.isClicked) {
      this.rootRef.current.setPointerCapture(event.pointerId);
      this.isClicked = true;
      this.clickedPosX = event.clientX;
    }
  };

  setReleasedState = (event) => {
    if (this.isClicked) {
      this.rootRef.current.releasePointerCapture(event.pointerId);
      this.isClicked = false;
    }
  };

  moveFrame = (event) => {
    if (this.isClicked) {
      const speed = Gallery.MANUAL_MOVING_SPEED;
      const movedDistance = event.clientX - this.clickedPosX;
      if (movedDistance > 0) {
        const state = { posX: this.state.posX + speed };
        this.setState(state);
      } else if (movedDistance < 0) {
        if (this.state.posX - speed > 0) {
          const state = { posX: this.state.posX - speed };
          this.setState(state);
        }
      }

      this.clickedPosX = event.clientX;
    }
  };

  setMoveFrameTimer = () => {
    const interval = setInterval(() => {
      //this.posX += Gallery.AUTO_MOVING_SPEED;
      const state = {
        ...this.state,
        posX: this.state.posX + Gallery.AUTO_MOVING_SPEED,
      };
      this.setState(state);
    }, Gallery.FRAME_TIME);
    return () => clearInterval(interval);
  };

  getDisplayType(frame) {
    if (!this.state.selectedFrame) {
      return 'list';
    } else {
      return this.state.selectedFrame === frame ? 'detail' : 'disappear';
    }
  }

  render() {
    return (
      <div
        ref={this.rootRef}
        className={this.isClicked ? styles.grabbing : styles.container}
      >
        <ul>
          {this.frames.map((frame, index) => {
            return (
              <FrameItem
                key={frame.id}
                frame={frame}
                index={index}
                posX={this.state.posX}
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
