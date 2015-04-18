var React = require('react'),
    messageTypes = require('./messageTypes'),
    dispatcher = require('./appDispatcher'),
    targetStore = require('./targetStore'),
    bulletStore = require('./bulletStore'),
    subscriptionIds = require('./subscriptionIds'),
    subId;

var Perf = React.createClass({
    getInitialState: function () {
        return { fps: 0, fobjps: 0 };
    },
    componentDidMount: function () {
        var self = this;
        subId = dispatcher.subscribe(messageTypes.ADVANCE_TIME, function (message, waitFor) {
            return waitFor([subscriptionIds.updateBulletsView, subscriptionIds.updateTargetsView]).then(function () {
                var objs = targetStore.getTargets().length + bulletStore.getBullets().length + 1, // add 1 for the cursor
                    fps = 1000 / message.dt,
                    fobjps = fps * objs;
                self.setState({
                    fps: Math.round(fps),
                    fobjps: Math.round(fobjps)
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
                <text x="10" y="80">{'frames/s: ' + this.state.fps}</text>
                <text x="10" y="100">{'frames*objs/s: ' + this.state.fobjps}</text>
            </svg>
        );
    }
});

module.exports = Perf;

