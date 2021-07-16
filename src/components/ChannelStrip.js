import React from "react";
import PropTypes from "prop-types";
import { Channel } from "tone";
// import Fader from "./Fader";
import Dial from "./Dial";
import Slider from "./Slider";
import "../styles/controls/ChannelStrip.scss";

const VOL_SCALING_FACTOR = 10000;
const valToDecibels = (val) => (Math.abs(val % 100) - 100) * VOL_SCALING_FACTOR;
const decibelsToVal = (dB) =>
  Math.abs(Math.floor(dB / VOL_SCALING_FACTOR) + 100);

const ChannelStrip = ({ label, input, output }) => {
  const [channel] = React.useState(
    new Channel({
      volume: -12,
      pan: 0,
      solo: false,
      mute: false,
    })
  );

  React.useEffect(() => {
    if (input) channel.input.connect(input);
  });

  return (
    <div className="channel-strip">
      <label>{label}</label>
      <Dial size={30}>
        <label>Pan</label>
      </Dial>
      <Slider
        onChange={console.log}
        aria-labelledBy="volume-slider-label"
        // start={[decibelsToVal(channel.volume.value)]}
        // range={{
        //   min: 0,
        //   max: 100,
        // }}
        // pips={{
        //   mode: "range",
        //   density: 10,
        // }}
        // onValueChange={(val) => channel.volume.rampTo(valToDecibels(val))}
        // label=""
      />
    </div>
  );
};

export default ChannelStrip;
