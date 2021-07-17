/**
 * Creates a context that exposes an audio bus to children.
 */

import React from "react";
import * as Tone from "tone";
import Debug from "debug";

const debug = Debug("master:output");

const channel = new Tone.Channel({
  volume: -12,
  pan: 0,
  solo: false,
  mute: false,
});

channel.toDestination();

if (debug.enabled) {
  const meter = new Tone.Meter();
  channel.connect(meter);
  setInterval(() => debug(meter.getValue()), 1000);
}

const MasterOutContext = React.createContext(channel);

export const MasterOutContextProvider = ({ children }) => {
  return (
    <MasterOutContext.Provider value={channel}>
      {children}
    </MasterOutContext.Provider>
  );
};

export default MasterOutContext;
