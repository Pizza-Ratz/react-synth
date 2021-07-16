import React from 'react'
import PropTypes from 'prop-types'
import { SynthPluck1 as SynthPluck1Inst } from '../lib/SynthPluck1'
import Fader from './Fader'
import Knob from './Knob'
import * as Tone from 'tone'
import '../styles/SynthPluck1.scss'

// does log^10(val), where val is in 0-100000 => 0-5
function linearToLog(val) {
  return (val > 0) ? Math.log10(Math.abs(val)) : 0
}

// turns 0-5 into ~ -110-0 db
function scaleGain(val = 0) {
  // console.log(`${val} -> ${linearToLog(val)} => ${(60 * linearToLog(val)) - 300}`)
  return (20 * linearToLog(val)) - 100
}

const SynthPluck1 = () => {
  const [synth] = React.useState(new SynthPluck1Inst({
    transport: Tone.getTransport() 
    // hook us up to the main transport
  }))

  React.useEffect(() => {
    synth.chain(synth.efx.gain, synth.efx.vibrato, synth.efx.dist, synth.efx.autoFilter, synth.efx.pan, synth.efx.delay, synth.efx.reverb, Tone.Destination)
    synth.start()
  }, [synth])

  return (
    <div className={`synth-pluck-1`}>
      <h3>Synth Pluck 1</h3>
      <Fader
        range={{ min: [0], max: [100000] }}
        start={[synth.volume.value]}
        pips={{}}
        onValueChange={(val) => synth.volume.value = scaleGain(val)}
        tooltips={false}
        label='Volume' />
      <hr />
      <Fader
        range={{ min: [0], max: [1]}}
        start={[synth.efx.reverb.wet.value]}
        step={0.01}
        pips={{}}
        onValueChange={(val) => synth.efx.reverb.wet.value = (val)}
        tooltips={false}
        label='Reverb' />
      <Knob 
        min={100} 
        max={3000} 
        step={1} 
        value={[synth.efx.autoFilter.baseFrequency]}
        onValueChange={(val) => synth.efx.autoFilter.baseFrequency = val} 
        label="Filter" />
    </div>
  )
}

SynthPluck1.propTypes = {
  className: PropTypes.string
}

export default SynthPluck1