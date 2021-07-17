import React from "react";
import Dial from "./Dial";
import Slider from "./Slider";
import "../styles/controls/ChannelStrip.scss";
import MasterOutContext from "../contexts/MasterOutContext";

const VOL_SCALING_FACTOR = 10000;
const valToDecibels = (val) => (Math.abs(val % 100) - 100) * VOL_SCALING_FACTOR;
const decibelsToVal = (dB) =>
  Math.abs(Math.floor(dB / VOL_SCALING_FACTOR) + 100);

const ChannelStrip = () => {
  const channel = React.useContext(MasterOutContext);

  return (
    <div className="channel-strip">
      <label>Master</label>
      <Dial
        size={30}
        value={50}
        min={0}
        max={100}
        numTicks={0}
        onChange={(val) => (channel.pan.value = (val - 50) / 100)}
      >
        <label>Pan</label>
      </Dial>
      <Slider
        onChange={(val) => {
          channel.volume.rampTo(val - 95);
          console.log(`[${val}] -> ${val - 90} => ${channel.volume.value}`);
        }}
      />
    </div>
  );
};

export default ChannelStrip;
