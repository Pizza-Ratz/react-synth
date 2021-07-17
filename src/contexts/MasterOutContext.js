/**
 * Creates a context that exposes an audio bus to children.
 */

import React from "react";
import * as Tone from "tone";

const channel = new Tone.Channel({
  volume: -12,
  pan: 0,
  solo: false,
  mute: false,
});

channel.toDestination();
const MasterOutContext = React.createContext(channel);

export const MasterOutContextProvider = ({ children }) => {
  return (
    <MasterOutContext.Provider value={channel}>
      {children}
    </MasterOutContext.Provider>
  );
};

export default MasterOutContext;
