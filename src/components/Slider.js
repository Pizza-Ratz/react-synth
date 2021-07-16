import React from "react";
import "../styles/controls/Slider.scss";

const Slider = ({ volume, ...rest }) => (
  <div class="slider-container">
    <input type="range" className="slider" {...rest} />
    <label>{volume}</label>
  </div>
);

export default Slider;
