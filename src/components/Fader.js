import React from "react";
import PropTypes from 'prop-types'
import "nouislider/dist/nouislider.css";
import noUiSlider from 'nouislider'
import '../styles/Fader.css'

const Fader = ({
  range = { min: [0], max: [100] },
  start = [0],
  step = 1,
  pips = {
    mode: 'range',
    density: 10
  },
  className = "",
  orientation = "vertical",
  direction = "rtl",
  tooltips = true,
  label = 'fader'
}) => {
  const fader = React.useRef()
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    if (fader && fader.current && !initialized) {
      noUiSlider.create(fader.current, {
        orientation,
        direction,
        start,
        step,
        pips,
        connect: true,
        tooltips,
        range
      })

      setInitialized(true)
    }
  }, [start, range, orientation, direction, step, pips, tooltips, initialized])

  return (
    <div className={`fader ${className}`}>
      <div ref={fader} />
      <label className="fader-label">{label}</label>
    </div>
  )
};

Fader.propTypes = {
  range: PropTypes.shape({
    min: PropTypes.arrayOf(PropTypes.number),
    max: PropTypes.arrayOf(PropTypes.number)
  }),
  start: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  direction: PropTypes.oneOf(['ltr', 'rtl']),
  tooltips: PropTypes.bool
}

export default Fader;