import React from "react";
import { Silver } from 'react-dial-knob'
import '../styles/Knob.scss'

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
  const [snowflake] = React.useState(Math.floor(Math.random() * 1000))

  const handleValueChange = (val) => {
    setIntlValue(val)
    onValueChange(val)
  }


  return (
    <div className="knob-container">
      <Silver
        diameter={diameter}
        min={min}
        max={max}
        step={step}
        value={intlValue}
        jumpLimit={jumpLimit}
        className='knob'
        onValueChange={handleValueChange}
        ariaLabelledBy={`knob-label-${snowflake}`}
        spaceMaxFromZero={false}
      />
      <label id={`knob-label-${snowflake}`}>{label}</label>
    </div>
  )
}

export default Knob