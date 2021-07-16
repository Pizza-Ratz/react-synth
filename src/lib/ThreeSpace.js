
import { Listener, Panner3D, Context } from 'tone'

export default class ThreeSpace {
  constructor(sources = [{
    name: '',
    instrument: {},
    lat: 0,
    lon: 0,
  }], listener = {lat: 0, lon: 0}) 
  {
    this.sources = sources.reduce((accum, src) => {
      source.panner = new Panner3D(src.lat, src.lon, 0)
      source.instrument.connect(source.panner)
      accum[src.name] = source
      return accum
    })
    this.listener = Listener(listener.lat, listener.lon, 0)
    return this
  }

  // adds a source to the 3-d environment
  addSource(source = { name: '', instrument: {}, lat: 0, lon: 0}) {
    source.panner = new Panner3D(source.lat, source.lon, 0)
    instrument.connect(source.panner)
    this.sources[source.name] = source
    return this
  }

  removeSource(sourceName) {
    const source = this.sources[sourceName]
    if (!source) throw new Error('Source doesn\'t exist')
    instrument.disconnect(source.panner)
    source.panner.dispose()
    delete this.source[sourceName];
    return this
  }

  moveListener(destination = [0, 0], tripTime, startTime = Context.now()) {
    const [ destX, destY ] = destination
    const dX = destX - Listener.positionX.value
    const dY = destY - Listener.positionY.value
    Listener.positionX.rampTo(dX, tripTime, startTime)
    Listener.positionY.rampTo(dY, tripTime, startTime)
// use rampTo

  
  }
}
