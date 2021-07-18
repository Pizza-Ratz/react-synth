import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as Tone from "tone";

let started = false;

document.documentElement.addEventListener("mousedown", async () => {
  if (started) return;
  Tone.Context.lookAhead = "2s";
  await Tone.start();
  started = true;

  ReactDOM.render(
    <React.StrictMode>
      <App />,
    </React.StrictMode>,
    document.getElementById("root")
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
