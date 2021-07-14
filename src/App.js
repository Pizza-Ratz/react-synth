import React from 'react'
import './App.scss';
import * as Tone from 'tone'
import { Knob, Fader, Switch, TransportControls } from './components'
import SynthPad1 from './components/SynthPad1';

function App() {
  const [started, setStarted] = React.useState(false);

  document.documentElement.addEventListener("mousedown", () => {
    if (started) return;
    setStarted(true);
    Tone.start();
  })

  return (
    <div className="App">
      <header className="App-header">
        Kitchen Sink
      </header>
      <main>
        <TransportControls />
        <Knob />
        <Fader />
        <Switch />
        <SynthPad1 />
      </main>
    </div>
  );
}

export default App;
