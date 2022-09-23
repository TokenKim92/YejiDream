import React from 'react';
import FrameItem from '../frame_item/frame_item';

const FrameList = (props) => {
  console.log(props);

  return (
    <ul>
      {props.frames.map((frame) => {
        return (
          <FrameItem
            key={frame.id}
            frame={frame}
            onFrameClick={props.onFrameClick}
            displayType={props.getDisplayType(frame)}
          />
        );
      })}
    </ul>
  );
};

export default FrameList;
