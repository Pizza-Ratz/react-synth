import React from "react";
import PropTypes from "prop-types";
import "../styles/controls/Dial.scss";

// taken from https://codepen.io/bbx/pen/QBKYOy

class Dial extends React.Component {
  constructor(props = Dial.defaultProps) {
    super(props);
    this.fullAngle = props.degrees;
    this.startAngle = (360 - props.degrees) / 2;
    this.endAngle = this.startAngle + props.degrees;
    this.margin = props.size * 0.15;
    this.currentDeg = Math.floor(
      this.convertRange(
        props.min,
        props.max,
        this.startAngle,
        this.endAngle,
        props.value
      )
    );
    this.state = { deg: this.currentDeg };
  }

  startDrag = (e) => {
    e.preventDefault();
    const knob = e.target.getBoundingClientRect();
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2,
    };
    const moveHandler = (e) => {
      this.currentDeg = this.getDeg(e.clientX, e.clientY, pts);
      if (this.currentDeg === this.startAngle) this.currentDeg--;
      let newValue = Math.floor(
        this.convertRange(
          this.startAngle,
          this.endAngle,
          this.props.min,
          this.props.max,
          this.currentDeg
        )
      );
      this.setState({ deg: this.currentDeg });
      typeof this.props.onChange === "function" &&
        this.props.onChange(newValue);
    };
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", (e) => {
      document.removeEventListener("mousemove", moveHandler);
    });
  };

  getDeg = (cX, cY, pts) => {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = (Math.atan(y / x) * 180) / Math.PI;
    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      deg += 90;
    } else {
      deg += 270;
    }
    let finalDeg = Math.min(Math.max(this.startAngle, deg), this.endAngle);
    return finalDeg;
  };

  convertRange = (oldMin, oldMax, newMin, newMax, oldValue) => {
    return (
      ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
    );
  };

  renderTicks = () => {
    let ticks = [];
    const incr = this.fullAngle / this.props.numTicks;
    const size = this.margin + this.props.size / 2;
    for (let deg = this.startAngle; deg <= this.endAngle; deg += incr) {
      const tick = {
        deg: deg,
        tickStyle: {
          height: size + 10,
          left: size - 1,
          top: size + 2,
          transform: "rotate(" + deg + "deg)",
          transformOrigin: "top",
        },
      };
      ticks.push(tick);
    }
    return ticks;
  };

  dcpy = (o) => {
    return JSON.parse(JSON.stringify(o));
  };

  render() {
    let { numTicks, size } = this.props;
    let kStyle = {
      width: size,
      height: size,
    };
    let iStyle = this.dcpy(kStyle);
    let oStyle = this.dcpy(kStyle);
    oStyle.margin = this.margin;
    if (this.props.color) {
      oStyle.backgroundImage =
        "radial-gradient(100% 70%,hsl(210, " +
        this.currentDeg +
        "%, " +
        this.currentDeg / 5 +
        "%),hsl(" +
        Math.random() * 100 +
        ",20%," +
        this.currentDeg / 36 +
        "%))";
    }
    iStyle.transform = "rotate(" + this.state.deg + "deg)";

    // let margin = size + numTicks ? "5px" : 0;
    // let marginBottom = this.props.children ? "0px" : "5px";
    let classes =
      "dial-container" +
      (numTicks ? " has-ticks" : "") +
      (this.props.children ? " has-children" : "");

    return (
      // <div className={classes} style={{ margin, marginBottom }}>
      <div className={classes}>
        <div className="dial">
          <div className="ticks">
            {numTicks
              ? this.renderTicks().map((tick, i) => (
                  <div
                    key={i}
                    className={
                      "tick" + (tick.deg <= this.currentDeg ? " active" : "")
                    }
                    style={tick.tickStyle}
                  />
                ))
              : null}
          </div>
          <div
            className="dial outer"
            style={oStyle}
            onMouseDown={this.startDrag}
          >
            <div className="dial inner" style={iStyle}>
              <div className="grip" />
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

Dial.defaultProps = {
  size: 50,
  min: 10,
  max: 30,
  numTicks: 25,
  degrees: 270,
  value: 10,
};

Dial.propTypes = {
  degrees: PropTypes.number,
  size: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  numTicks: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default Dial;
