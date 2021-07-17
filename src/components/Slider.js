import React from "react";
import "../styles/controls/Slider.scss";

const Slider = ({ volume, onChange, ...rest }) => {
  const getValue = (evt) => {
    value = +evt.target.value;
    return value;
  };

  let value = 50;
  return (
    <div className="slider-container">
      <input
        type="range"
        className="slider"
        onChange={(evt) => (onChange ? onChange(100 - getValue(evt)) : 0)}
        {...rest}
        aria-orientation="vertical"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={100 - value} // because the slider is upside-down
      />
      <label>{volume}</label>
    </div>
  );
};

export default Slider;
