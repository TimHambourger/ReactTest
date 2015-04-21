var React = require('react'),
    dt = require('./dt'),
    targetStore = require('./targetStore'),
    bulletStore = require('./bulletStore'),
    stateSubscription,
    avgFobjps = 0, // rolling avg of fobjps value
    avgWindow = 6; // do as rolling avg of last n values

var Perf = React.createClass({
    getInitialState: function () {
        return { fps: 0, fobjps: 0, avgFobjps: avgFobjps };
    },
    componentDidMount: function () {
        stateSubscription = dt.subscribe(val => {
            var objs = targetStore.targets().length + bulletStore.bullets().length + 1, // add 1 for the cursor
                fps = 1000 / val,
                fobjps = fps * objs;
                if (val > 0) avgFobjps = avgFobjps * (avgWindow - 1) / avgWindow + fobjps / avgWindow;
            this.setState({
                fps: Math.round(fps),
                fobjps: Math.round(fobjps),
                avgFobjps: Math.round(avgFobjps)
            });
        });
    },
    componentWillUnmount: function () {
        stateSubscription.dispose();
    },
    render: function () {
        return (
            <svg>
                <text x={this.props.x} y="20" textAnchor="end">{'frames/s: ' + this.state.fps}</text>
                <text x={this.props.x} y="40" textAnchor="end">{'frames*objs/s: ' + this.state.fobjps}</text>
                <text x={this.props.x} y="60" textAnchor="end">{'avg f*obj/s: ' + this.state.avgFobjps}</text>
            </svg>
        );
    }
});

module.exports = Perf;

