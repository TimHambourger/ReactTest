var React = require('react'),
    ko = require('knockout'),
    targetStore = require('./targetStore');

var scoreState = ko.pureComputed(() => ({
        remaining: targetStore.targets().length,
        missed: targetStore.targetsMissed()
    })),
    stateSubscription;

var Score = React.createClass({
    propTypes: {
        targetCount: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
        return scoreState();
    },
    componentDidMount: function () {
        stateSubscription = scoreState.subscribe(val => this.setState(val));
    },
    componentWillUnmount: function () {
        stateSubscription.dispose();
    },
    render: function () {
        var hit = this.props.targetCount - this.state.remaining - this.state.missed;
        return (
            <svg>
                <text x="10" y="20">{'Remaining: ' + this.state.remaining}</text>
                <text x="10" y="40">{'Hit: ' + hit}</text>
                <text x="10" y="60">{'Missed: ' + this.state.missed}</text>
            </svg>
        );
    }
});

module.exports = Score;
