import React from 'react'
import PropTypes from 'prop-types'
import { SynthPad1 as SynthPad1Inst } from '../lib/SynthPad1'
import Fader from './Fader'
import Knob from './Knob'
import * as Tone from 'tone'
import '../styles/SynthPad1.scss'

// does log^10(val), where val is in 0-100000 => 0-5
function linearToLog(val) {
  return (val > 0) ? Math.log10(Math.abs(val)) : 0
}

// turns 0-5 into ~ -110-0 db
function scaleGain(val = 0) {
  // console.log(`${val} -> ${linearToLog(val)} => ${(60 * linearToLog(val)) - 300}`)
  return (20 * linearToLog(val)) - 100
}

const SynthPad1 = () => {
  const [synth] = React.useState(new SynthPad1Inst({
    transport: Tone.getTransport() 
    // hook us up to the main transport
  }))

  React.useEffect(() => {
    synth.toDestination()
  })

  return (
    <div className={`synth-pad-1`}>
      <h3>Synth Pad 1</h3>
      <Fader
        range={{ min: [0], max: [100000] }}
        pips={{}}
        onValueChange={(val) => synth.volume.value = scaleGain(val)}
        tooltips={false}
        label='Volume' />
      <hr />
      <Knob min={300} max={3000} step={100} onValueChange={(val) => synth.voice0.filterEnvelope.baseFrequency = val} label="Filter 1" />
      <Knob min={300} max={3000} step={100} onValueChange={(val) => synth.voice1.filterEnvelope.baseFrequency= val} label="Filter 2" />
    </div>
  )
}

SynthPad1.propTypes = {
  className: PropTypes.string
}

export default SynthPad1