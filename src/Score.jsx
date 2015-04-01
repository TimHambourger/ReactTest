define(function (require) {

    var React = require('React'),
        targetStore = require('./targetStore');

    function getScoreState() {
        return {
            remaining: targetStore.getTargets().length,
            missed: targetStore.getTargetsMissed()
        };
    }

    var Score = React.createClass({
        propTypes: {
            targetCount: React.PropTypes.number.isRequired
        },
        getInitialState: function () {
            return getScoreState();
        },
        componentDidMount: function () {
            targetStore.addChangeListener(this.onChange);
        },
        componentWillUnmount: function () {
            targetStore.removeChangeListener(this.onChange);
        },
        onChange: function () {
            this.setState(getScoreState());
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

    return Score;
});