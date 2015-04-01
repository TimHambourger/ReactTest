define(function (require) {

    var React = require('React'),
        actions = require('./actions'),
        Cursor = require('./Cursor'),
        Bullets = require('./Bullets'),
        Targets = require('./Targets'),
        Score = require('./Score'),
        collisionDetection = require('./collisionDetection');

    var App = React.createClass({
        propTypes: {
            height: React.PropTypes.number.isRequired,
            width: React.PropTypes.number.isRequired,
            cursorHeight: React.PropTypes.number.isRequired,
            cursorWidth: React.PropTypes.number.isRequired,
            targetCount: React.PropTypes.number.isRequired
        },
        componentDidMount: function () {
            collisionDetection.start();
            this.animationFrame = window.requestAnimationFrame(this.advanceTime);
        },
        componentWillUnmount: function () {
            window.cancelAnimationFrame(this.animationFrame);
        },
        advanceTime: function (timestamp) {
            if (!this.lastTimestamp) this.lastTimestamp = timestamp;
            actions.advanceTime(timestamp - this.lastTimestamp);
            this.lastTimestamp = timestamp;
            this.animationFrame = window.requestAnimationFrame(this.advanceTime);
        },
        render: function () {
            return (
                <svg height={this.props.height} width={this.props.width} className="container">
				    <Cursor {... this.props} screenHeight={this.props.height} screenWidth={this.props.width} />
                    <Bullets />
                    <Targets screenHeight={this.props.height} screenWidth={this.props.width} targetCount={this.props.targetCount} maxInitialY={this.props.height / 3} />
                    <Score targetCount={this.props.targetCount} />
			    </svg>
			);
        }
    });

    return App;
});