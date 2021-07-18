import React from "react";
import PropTypes from "prop-types";
import SynthPluckInst from "../../instruments/engines/SynthPluck2";
import Dial from "../../components/Dial";
import "../../styles/SynthPluck2.scss";
import BusContext from "../../contexts/BusContext";
import { dBToKnob, knobToDB } from "../../lib/transformers";
import * as Tone from "tone";

const SynthPluck2 = () => {
  const [synth] = React.useState(new SynthPluckInst());
  const [meter] = React.useState(new Tone.Meter());
  const bus = React.useContext(BusContext);

  React.useEffect(() => {
    meter.normalRange = true;
    synth.output.connect(bus);
    synth.output.connect(meter);
    synth.start();
    return () => {
      synth.stop();
    };
  }, [synth, bus, meter]);

  return (
    <div className={`synth-pluck-2`}>
      <h3>Fantasy</h3>
      <Dial
        min={0}
        max={1000}
        value={dBToKnob(synth.volume.value)}
        onChange={(val) => (synth.volume.value = knobToDB(val, 1000))}
        color={true}
        colorFn={meter.getValue.bind(meter)}
      >
        <label>Volume</label>
      </Dial>
      <Dial
        min={1}
        max={100}
        value={Math.floor(synth.efx.distortion.wet.value) * 100}
        onChange={(val) =>
          (synth.efx.distortion.wet.value = Math.abs(val / 100))
        }
      >
        <label>distortion</label>
      </Dial>
      <Dial
        min={0}
        max={100}
        value={Math.floor(synth.efx.reverb.wet.value) * 100}
        onChange={(val) => (synth.efx.reverb.wet.value = Math.abs(val / 100))}
      >
        <label>reverb</label>
      </Dial>
      <Dial
        min={0}
        max={100}
        value={Math.floor(synth.efx.delay.feedback.value) * 100}
        onChange={(val) =>
          (synth.efx.delay.feedback.value = Math.abs(val / 100))
        }
      >
        <label>delay feedback</label>
      </Dial>
    </div>
  );
};

SynthPluck2.propTypes = {
  className: PropTypes.string,
};

export default SynthPluck2;
