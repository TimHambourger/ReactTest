var React = require('../lib/react-0.13.1'),
    targetStore = require('./targetStore');

function getTargetsState() {
    return {
        targets: targetStore.getTargets()
    };
}

var Targets = React.createClass({
    propTypes: {
        screenWidth: React.PropTypes.number.isRequired,
        screenHeight: React.PropTypes.number.isRequired,
        targetCount: React.PropTypes.number.isRequired,
        maxInitialY: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
        targetStore.initialize(this.props);

        return getTargetsState();
    },
    componentDidMount: function () {
        targetStore.addChangeListener(this.onChange);
    },
    componentWillUnmount: function () {
        targetStore.removeChangeListener(this.onChange);
    },
    onChange: function () {
        this.setState(getTargetsState());
    },
    render: function () {
        var targets = [];

        for (var i = 0; i < this.state.targets.length; i++) {
            var target = this.state.targets[i];
            targets.push(<circle key={target.id} cx={target.x} cy={target.y} r={target.r} className="target" />);
        }

        return <svg>{targets}</svg>;
    }
});

module.exports = Targets;
