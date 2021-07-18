import React from "react";
import PropTypes from "prop-types";
import engine from "../engines/SynthLead1";
import Dial from "../../components/Dial";
import "../../styles/SynthLead1.scss";
import ControlGroup from "../../components/ControlGroup";
import BusContext from "../../contexts/BusContext";

const SMALL_KNOB_SIZE = 30;

const SynthLead1 = () => {
  const [synth] = React.useState(new engine());
  const master = React.useContext(BusContext);

  React.useEffect(() => {
    synth.start();
    synth.output.connect(master);
    return () => {
      synth.stop();
    };
  }, [synth, master]);

  return (
    <div className={`synth-lead-1`}>
      <h3>Cello</h3>
      <Dial
        min={0}
        max={1000}
        val={Math.floor(synth.volume.value) * 1000}
        onChange={(val) => (synth.volume.value = val / 1000)}
      >
        <label>Volume</label>
      </Dial>
      <div style={{ display: "flex" }}>
        <Dial
          size={40}
          min={0}
          max={100}
          val={Math.floor(synth.preEfxVolume.value) * 100}
          color={false}
          onChange={(val) => (synth.preEfxVolume.value = val / 100)}
        >
          <label>pre-efx gain</label>
        </Dial>
        <Dial
          size={40}
          min={0}
          max={100}
          val={Math.floor(synth.harmonicity.value) * 100}
          color={true}
          onChange={(val) => (synth.harmonicity.value = val / 100)}
        >
          <label>harmonicity</label>
        </Dial>
      </div>
      <div className="voices">
        <ControlGroup label="Voice 0">
          <ControlGroup label="filterEnv">
            <Dial
              size={SMALL_KNOB_SIZE}
              min={0}
              max={100}
              val={Math.floor(synth.voice0.filterEnvelope.value) * 100}
              color={false}
              onChange={(val) =>
                synth.voice0.filterEnvelope.set({
                  baseFrequency: Math.abs(val * 100),
                })
              }
            >
              <label>frequency</label>
            </Dial>
            <Dial
              size={SMALL_KNOB_SIZE}
              min={0}
              max={200}
              val={Math.floor(synth.voice0.filterEnvelope.exponent) * 100}
              color={false}
              onChange={(val) =>
                (synth.voice0.filterEnvelope.exponent = Math.floor(val / 100))
              }
            >
              <label>exponent</label>
            </Dial>
          </ControlGroup>
        </ControlGroup>
        <ControlGroup label="Voice 1">
          <ControlGroup label="filterEnv">
            <Dial
              size={SMALL_KNOB_SIZE}
              min={0}
              max={100}
              val={Math.floor(synth.voice1.filterEnvelope.value) * 100}
              color={false}
              onChange={(val) =>
                synth.voice1.filterEnvelope.set({
                  baseFrequency: Math.abs(val * 100),
                })
              }
            >
              <label>frequency</label>
            </Dial>
            <Dial
              size={SMALL_KNOB_SIZE}
              min={0}
              max={200}
              val={Math.floor(synth.voice1.filterEnvelope.exponent) * 200}
              color={false}
              onChange={(val) =>
                (synth.voice1.filterEnvelope.exponent = Math.floor(val / 100))
              }
            >
              <label>exponent</label>
            </Dial>
          </ControlGroup>
        </ControlGroup>
      </div>
    </div>
  );
};

SynthLead1.propTypes = {
  className: PropTypes.string,
};

export default SynthLead1;
