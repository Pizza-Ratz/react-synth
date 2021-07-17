import React from "react";
import "./App.scss";
import * as Tone from "tone";
import { ChannelStrip, TransportControls } from "./components";
import SynthPad1 from "./instruments/interfaces/SynthPad1";
import SynthPluck1 from "./instruments/interfaces/SynthPluck1";
import SynthPluck2 from "./instruments/interfaces/SynthPluck2";

import { MasterOutContextProvider } from "./contexts/MasterOutContext";

function App() {
  const [started, setStarted] = React.useState(false);

  document.documentElement.addEventListener("mousedown", async () => {
    if (started) return;
    setStarted(true);
    await Tone.start();
    Tone.Context.lookAhead = 2;
  });

  return (
    <div className="App">
      <header className="App-header">Kitchen Sink</header>
      <main>
        <MasterOutContextProvider>
          <div>
            <TransportControls />
            <ChannelStrip label="Master" id="master" />
          </div>
          <SynthPad1 />
          <SynthPluck1 />
          <SynthPluck2 />
        </MasterOutContextProvider>
      </main>
    </div>
  );
}

export default App;
