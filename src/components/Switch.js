import React from "react";
import Nouislider, { wNumb } from "nouislider-react";
import "nouislider/distribute/nouislider.css";

export const Switch = () => {
  const options = {
    orientation: "vertical",
    start: 0,
    range: {
      'min': [0, 1],
      'max': 1
    },
    format: wNumb({
      decimals: 0
    }),
    className: 'switch'
  }
  return <Nouislider {...options} />
}

