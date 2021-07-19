import React from "react";
import PropTypes from "prop-types";
import SynthPad1Inst from "../engines/SynthPad1";
import Dial from "../../components/Dial";
import "../../styles/SynthPad1.scss";
import ControlGroup from "../../components/ControlGroup";
import BusContext from "../../contexts/BusContext";
import { knobToDB, dBToKnob } from "../../lib/transformers";
import * as Tone from "tone";

const SMALL_KNOB_SIZE = 30;

const SynthPad1 = () => {
  const [synth] = React.useState(new SynthPad1Inst());
  const bus = React.useContext(BusContext);
  const [meter] = React.useState(new Tone.Meter());

  React.useEffect(() => {
    synth.chain(
      synth.efx.dist,
      // synth.efx.eq,
      // synth.efx.autoFilter,
      synth.efx.delay,
      synth.efx.reverb,
      // synth.efx.eq2,
      // synth.efx.chorus,
      bus
    );
    // synth.efx.reverb.generate();
    synth.start();
    // synth.postInit();
    // synth.connect(bus);
    //synth.output.connect(bus);
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
      {/* <div style={{ display: "flex" }}>
        <Dial
          size={40}
          min={0}
          max={100}
          val={Math.floor(synth.preEfxVolume.value) * 100}
          onChange={(val) => (synth.preEfxVolume.value = val / 100)}
        >
          <label>pre-efx vol</label>
        </Dial> */}
        {/* <Dial
          size={40}
          val={Math.floor(synth.harmonicity.value) * 100}
          onChange={(val) => (synth.harmonicity.value = val / 100)}
        >
          <label>harmonicity</label>
        </Dial> */}
      {/* </div> */}
      <div className="voices">
        <ControlGroup label="Effects">
          <ControlGroup label="Reverb">
            <Dial
              size={SMALL_KNOB_SIZE}
              min={0}
              max={100}
              val={synth.efx.reverb.wet.value * 100}
              color={false}
              onChange={(val) =>
                (synth.efx.reverb.wet.value = Math.abs(val / 100))
              }
            >
              <label>Reverb Wet</label>
            </Dial>
            <Dial
              size={SMALL_KNOB_SIZE}
              min={0}
              max={100}
              val={Math.floor(synth.efx.delay.wet.value) * 100}
              color={false}
              onChange={(val) =>
                (synth.efx.delay.wet.value = Math.abs(val / 100))
              }
            >
              <label>Delay Wet</label>
            </Dial>
          </ControlGroup>
        </ControlGroup>
      </div>
    </div>
  );
};

SynthPad1.propTypes = {
  className: PropTypes.string,
};

export default SynthPad1;
