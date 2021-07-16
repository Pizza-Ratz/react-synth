import React from "react";
import PropTypes from "prop-types";
import { DroneMaker } from "../lib/SynthDrone";
import Dial from "./Dial";
import "../styles/DroneMaker.scss";

// does log^10(val), where val is in 0-100000 => 0-5
function linearToLog(val) {
  return val > 0 ? Math.log10(Math.abs(val)) : 0;
}

// turns 0-5 into ~ -110-0 db
function scaleGain(val = 0) {
  // console.log(`${val} -> ${linearToLog(val)} => ${(60 * linearToLog(val)) - 300}`)
  return 20 * linearToLog(val) - 100;
}

const Drone = () => {
  const [synth] = React.useState(new DroneMaker());

  React.useEffect(() => {
    synth.toDestination();
  });

  console.log(synth);

  return (
    <div className={`drone`}>
      <h3>Drone Maker</h3>
      <Dial onChange={(amt) => (synth.volume.value = amt)}>
        <label>Volume</label>
      </Dial>
      <button onClick={synth.play.bind(synth)}>Start</button>
      <button onClick={synth.stop.bind(synth)}>Stop</button>
    </div>
  );
};

Drone.propTypes = {
  className: PropTypes.string,
};

export default Drone;
