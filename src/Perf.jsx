var React = require('react'),
    dt = require('./dt'),
    targetStore = require('./targetStore'),
    bulletStore = require('./bulletStore'),
    stateSubscription;

var Perf = React.createClass({
    getInitialState: function () {
        return { fps: 0, fobjps: 0 };
    },
    componentDidMount: function () {
        stateSubscription = dt.subscribe(val => {
            var objs = targetStore.targets().length + bulletStore.bullets().length + 1, // add 1 for the cursor
                fps = 1000 / val,
                fobjps = fps * objs;
            this.setState({
                fps: Math.round(fps),
                fobjps: Math.round(fobjps)
            });
        });
    },
    componentWillUnmount: function () {
        stateSubscription.dispose();
    },
    render: function () {
        return (
            <svg>
                <text x="10" y="80">{'frames/s: ' + this.state.fps}</text>
                <text x="10" y="100">{'frames*objs/s: ' + this.state.fobjps}</text>
            </svg>
        );
    }
});

module.exports = Perf;

