import React from "react";
import PropTypes from "prop-types";
import engine from "../engines/SynthPad1";
import Dial from "../../components/Dial";
import "../../styles/SynthPad1.scss";
import ControlGroup from "../../components/ControlGroup";
import BusContext from "../../contexts/BusContext";
import { knobToDB, dBToKnob } from "../../lib/transformers";
import * as Tone from "tone";

const SMALL_KNOB_SIZE = 30;

const SynthPad1 = () => {
  const [synth] = React.useState(new engine());
  const [meter] = React.useState(new Tone.Meter());
  const bus = React.useContext(BusContext);

  React.useEffect(() => {
    synth.postInit();
    synth.output.connect(bus);
    synth.output.connect(meter);
    meter.normalRange = true;
    return () => {
      synth.stop();
    };
  }, [synth, bus, meter]);

  return (
    <div className={`synth-pad-1`}>
      <h3>Sizzle</h3>
      <Dial
        min={0}
        max={1000}
        color={true}
        colorFn={meter.getValue.bind(meter)}
        value={dBToKnob(synth.volume.value)}
        onChange={(val) => (synth.volume.value = knobToDB(val))}
      >
        <label>Volume</label>
      </Dial>
      <div style={{ display: "flex" }}>
        <Dial
          size={40}
          min={0}
          max={100}
          value={synth.harmonicity.value * 100}
          onChange={(val) => (synth.harmonicity.value = Math.abs(val / 100))}
        >
          <label>harmonicity</label>
        </Dial>
      </div>
      <ControlGroup label="Effects">
        <Dial
          size={SMALL_KNOB_SIZE}
          min={0}
          max={100}
          val={Math.floor(synth.efx.distortion.distortion) * 100}
          color={false}
          onChange={(val) =>
            (synth.efx.distortion.distortion = Math.abs(val / 100))
          }
        >
          <label>Dist Amt</label>
        </Dial>
        <Dial
          size={SMALL_KNOB_SIZE}
          min={0}
          max={100}
          val={Math.floor(synth.efx.distortion.wet.value) * 100}
          color={false}
          onChange={(val) =>
            (synth.efx.distortion.wet.value = Math.abs(val / 100))
          }
        >
          <label>Dist Wet</label>
        </Dial>
        <Dial
          size={SMALL_KNOB_SIZE}
          min={0}
          max={100}
          val={synth.efx.reverb.wet.value * 100}
          color={false}
          onChange={(val) => (synth.efx.reverb.wet.value = Math.abs(val / 100))}
        >
          <label>Reverb Wet</label>
        </Dial>
        <Dial
          size={SMALL_KNOB_SIZE}
          min={0}
          max={100}
          val={Math.floor(synth.efx.delay.wet.value) * 100}
          color={false}
          onChange={(val) => (synth.efx.delay.wet.value = Math.abs(val / 100))}
        >
          <label>Delay Wet</label>
        </Dial>
      </ControlGroup>
    </div>
  );
};

SynthPad1.propTypes = {
  className: PropTypes.string,
};

export default SynthPad1;
