import React from "react";
import "./App.scss";
import * as Tone from "tone";
import { ChannelStrip, TransportControls } from "./components";
import SynthPad1 from "./components/SynthPad1";
import SynthPluck1 from "./components/SynthPluck1";
import { MasterOutContextProvider } from "./contexts/MasterOutContext";

function App() {
  const [started, setStarted] = React.useState(false);

  document.documentElement.addEventListener("mousedown", () => {
    if (started) return;
    setStarted(true);
    Tone.start();
  });

  return (
    <div className="App">
      <header className="App-header">Kitchen Sink</header>
      <main>
        <TransportControls />
        <MasterOutContextProvider>
          <ChannelStrip label="Master" />
          <SynthPad1 />
          <SynthPluck1 />
        </MasterOutContextProvider>
      </main>
    </div>
  );
}

export default App;
