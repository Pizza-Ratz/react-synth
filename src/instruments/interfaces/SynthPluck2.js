import React from "react";
import PropTypes from "prop-types";
import SynthPluckInst from "../../instruments/engines/SynthPluck2";
import Dial from "../../components/Dial";
import "../../styles/SynthPluck2.scss";
import BusContext from "../../contexts/BusContext";
import { dBToKnob, knobToDB } from "../../lib/transformers";
import * as Tone from "tone";
import ControlGroup from "../../components/ControlGroup";

const SynthPluck2 = () => {
  const [synth] = React.useState(new SynthPluckInst());
  const [meter] = React.useState(new Tone.Meter());
  const bus = React.useContext(BusContext);

  React.useEffect(() => {
    synth.chain(
      synth.efx.gain,
      synth.efx.distortion,
      synth.efx.delay,
      synth.efx.reverb,
      bus
    );
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
        size={50}
        min={0}
        max={1000}
        value={dBToKnob(synth.volume.value)}
        onChange={(val) => (synth.volume.value = knobToDB(val, 1000))}
        color={true}
        colorFn={meter.getValue.bind(meter)}
      >
        <label>Volume</label>
      </Dial>
      <ControlGroup label="filter">
        <Dial
          min={100}
          max={2500}
          value={synth.filter.frequency.baseFrequency}
          onChange={(val) => (synth.filter.frequency.baseFrequency = val)}
        >
          <label>cutoff</label>
        </Dial>
        <Dial
          min={0}
          max={100}
          value={Math.floor(synth.filter.Q.value) * 100}
          onChange={(val) => (synth.filter.Q.value = Math.abs(val / 100))}
        >
          <label>Q</label>
        </Dial>
      </ControlGroup>
      <Dial
        min={1}
        max={100}
        value={Math.floor(synth.efx.distortion.distortion) * 100}
        onChange={(val) =>
          (synth.efx.distortion.distortion = Math.abs(val / 100))
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
