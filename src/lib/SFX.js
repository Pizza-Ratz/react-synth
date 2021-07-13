const subwayAmbience = new Tone.Player({
  url: "../assets/audio/subway-station-ambience.mp3",
  loop: true,
  volume: -3,
}).toDestination();

const trainArrival1 = new Tone.Player({
  url: "../assets/audio/subway-train-arrival.mp3",
  volume: -14,
}).toDestination();

const trainDeparture = new Tone.Player({
  url: "../assets/audio/subway-train-departure.mp3",
  volume: -14,
}).toDestination();

const trainArrival2 = new Tone.Player({
  url: "../assets/audio/subway-train-departure.mp3",
  volume: -14,
}).toDestination();

const subwayAnnouncements1 = new Tone.Player({
  url: "../assets/audio/subway-ambience-announcements.mp3",
  volume: -7,
}).toDestination();

const subwayAnnouncements2 = new Tone.Player({
  url: "../assets/audio/subway-ambience-announcements-2.mp3",
  volume: -7,
}).toDestination();

const subwayChime = new Tone.Player({
  url: "../assets/audio/subway-doors-chime.mp3",
  volume: -6,
}).toDestination();