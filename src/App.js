import React from "react";
import "./App.scss";
import { ChannelStrip, TransportControls, Panner3D } from "./components";
import SynthPad1 from "./instruments/interfaces/SynthPad1";
import SynthPluck1 from "./instruments/interfaces/SynthPluck1";
import SynthPluck2 from "./instruments/interfaces/SynthPluck2";
import { BusContextProvider } from "./contexts/BusContext";

function App() {
  return (
    <div className="App">
      <header className="App-header">Kitchen Sink</header>
      <main>
        <BusContextProvider name="master">
          <div id="master-controls">
            <TransportControls />
            <div>
              <ChannelStrip label="Master" />
              <Panner3D />
            </div>
          </div>
          <SynthPad1 />
          <SynthPluck1 />
          {/* <SynthPluck2 /> */}
        </BusContextProvider>
      </main>
    </div>
  );
}

export default App;
