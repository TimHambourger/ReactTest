var React = require('react'),
    messageTypes = require('./messageTypes'),
    dispatcher = require('./appDispatcher'),
    targetStore = require('./targetStore'),
    bulletStore = require('./bulletStore'),
    subscriptionIds = require('./subscriptionIds'),
    subId,
    avgFobjps = 0, // rolling avg of fobjps value
    avgWindow = 60; // do as rolling avg of last n values

var Perf = React.createClass({
    getInitialState: function () {
        return { fps: 0, fobjps: 0, avgFobjps: avgFobjps };
    },
    componentDidMount: function () {
        var self = this;
        subId = dispatcher.subscribe(messageTypes.ADVANCE_TIME, function (message, waitFor) {
            return waitFor([subscriptionIds.updateBulletsView, subscriptionIds.updateTargetsView]).then(function () {
                var objs = targetStore.getTargets().length + bulletStore.getBullets().length + 1, // add 1 for the cursor
                    fps = 1000 / message.dt,
                    fobjps = fps * objs;
                if (message.dt > 0) avgFobjps = avgFobjps * (avgWindow - 1) / avgWindow + fobjps / avgWindow;
                self.setState({
                    fps: Math.round(fps),
                    fobjps: Math.round(fobjps),
                    avgFobjps: Math.round(avgFobjps)
                });
            });
        });
    },
    componentWillUnmount: function () {
        dispatcher.unsubscribe(subid);
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

