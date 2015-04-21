var React = require('react'),
    ko = require('knockout'),
    targetStore = require('./targetStore');

var targetsState = ko.pureComputed(() => ({
         targets: targetStore.targets()
    })),
    stateSubscription;

var Targets = React.createClass({
    propTypes: {
        screenWidth: React.PropTypes.number.isRequired,
        screenHeight: React.PropTypes.number.isRequired,
        targetCount: React.PropTypes.number.isRequired,
        maxInitialY: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
        targetStore.initialize(this.props);

        return targetsState();
    },
    componentDidMount: function () {
        stateSubscription = targetsState.subscribe(val => this.setState(val));
    },
    componentWillUnmount: function () {
        stateSubscription.dispose();
    },
    render: function () {
        return (
            <svg>
                {this.state.targets.map(target =>
                    <circle key={target.id} cx={target.x} cy={target.y} r={target.r} className="target" />)}
            </svg>
       );
    }
});

module.exports = Targets;
