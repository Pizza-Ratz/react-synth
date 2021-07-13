import React from 'react'
import PropTypes from 'prop-types'
import engine from '../lib/SynthPad1'
import Fader from './Fader'
import Knob from './Knob'

// does log^10(val), where val is in 0-100000 => 0-5
function linearToLog(val) {
  return (val > 0) ? Math.log10(Math.abs(val)) : 0
}

// turns 0-5 into ~ -110-0 db
function scaleGain(val = 0) {
  // console.log(`${val} -> ${linearToLog(val)} => ${(60 * linearToLog(val)) - 300}`)
  return (20 * linearToLog(val)) - 100
}


const SynthPad1 = ({
  className = "synthPad1"
}) => {

  const [synth] = React.useState(new engine())

  return (
    <div className={className}>
      <Fader
        range={{ min: [0], max: [100000] }}
        pips={{}}
        onValueChange={(val) => synth.volume.value = scaleGain(val)}
        tooltips={false}
        label='Volume' />
      <Knob onValueChange={(val) => synth.vibrato.amount.value = val} label="Vib Amount" />
      <Knob onValueChange={(val) => synth.vibrato.rate.value = val} label="Vib Rate" />
    </div>
  )
}

SynthPad1.propTypes = {
  className: PropTypes.string
}

export default SynthPad1