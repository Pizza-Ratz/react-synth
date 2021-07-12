import React from "react";
import { Donut } from 'react-dial-knob'

export const Knob = ({ min, max }) => {
  const [value, setValue] = React.useState(0)
  return <Donut
    diameter={100}
    min={min}
    max={max}
    step={1}
    value={value}
    theme={{
      donutColor: 'cyan'
    }}
    style={{
      position: 'relative',
      margin: '100px auto',
      width: '100px'
    }}
    onValueChange={setValue}
    ariaLabelledBy={'knob-label'}
    spaceMaxFromZero={false}
  >
    <label id={'knob-label'} style={{
      textAlign: 'center',
      width: '200px',
      display: 'block',
      padding: '10px 0'
    }}>Default Knob</label>
  </Donut>
}