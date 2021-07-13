import React from 'react'
import PropTypes from 'prop-types'
import engine from '../lib/SynthPad1'
import Fader from './Fader'
import Knob from './Knob'

const SynthPad1 = ({
  className = "synthPad1"
}) => {

  const [synth] = React.useState(new engine())

  return (
    <div className={className}>
      <Fader onValueChange={(val) => synth.volume.value = val} label='Volume' />
      <Knob onValueChange={(val) => synth.vibrato.amount.value = val} label="Vib Amount" />
      <Knob onValueChange={(val) => synth.vibrato.rate.value = val} label="Vib Rate" />
    </div>
  )
}

SynthPad1.propTypes = {
  className: PropTypes.string
}

export default SynthPad1