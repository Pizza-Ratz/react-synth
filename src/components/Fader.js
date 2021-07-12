import React from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

export const Fader = ({ min, max, start }) => (
  <Nouislider
    range={{ min, max }}
    start={start}
    orientation={"vertical"}
    className={"fader"}
  />
);
