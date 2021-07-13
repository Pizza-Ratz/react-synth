import React from "react";
import { White } from 'react-dial-knob'
import '../styles/Knob.css'

const Knob = ({
  diameter = 70,
  min = 0,
  max = 100,
  step = 1,
  jumpLimit = 0.1,
  value = 0,
  label = 'title',
  onValueChange = () => { }
}) => {
  const [intlValue, setIntlValue] = React.useState(value)

  const handleValueChange = (val) => {
    setIntlValue(val)
    onValueChange(val)
  }

  return (
    <White
      diameter={diameter}
      min={min}
      max={max}
      step={step}
      value={intlValue}
      jumpLimit={jumpLimit}
      className='knob'
      onValueChange={handleValueChange}
      ariaLabelledBy={'knob-label'}
      spaceMaxFromZero={false}
    >
      <label className='knob-label'>{label}</label>
    </White>
  )
}

export default Knob