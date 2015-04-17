var React = require('../lib/react-0.13.1'),
    KeyCodes = require('./keyCodes'),
    actions = require('./actions'),
    cursorStore = require('./cursorStore');

function getCursorState() {
    var cursorPos = cursorStore.getCursorPos();

    return {
        cursorX: cursorPos.x,
        cursorY: cursorPos.y
    };
}

var Cursor = React.createClass({
    propTypes: {
        screenHeight: React.PropTypes.number.isRequired,
        screenWidth: React.PropTypes.number.isRequired,
        cursorHeight: React.PropTypes.number.isRequired,
        cursorWidth: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
        cursorStore.initialize(this.props);

        return getCursorState();
    },
    componentDidMount: function () {
        document.body.addEventListener('keydown', this.handleKeydown);
        document.body.addEventListener('keyup', this.handleKeyup);
        cursorStore.addChangeListener(this.onChange);
    },
    componentWillUnmount: function () {
        document.body.removeEventListener('keydown', this.handleKeydown);
        document.body.removeEventListener('keyup', this.handleKeyup);
        cursorStore.removeChangeListener(this.onChange);
    },
    handleKeydown: function (e) {
        var key = e.keyCode || e.which;

        var dx = 1, dy = 1, multiplier;

        switch (key) {
            case KeyCodes.LEFT:
                multiplier = -1;
                dy = 0;
                break;
            case KeyCodes.RIGHT:
                multiplier = 1;
                dy = 0;
                break;
            case KeyCodes.UP:
                multiplier = -1;
                dx = 0;
                break;
            case KeyCodes.DOWN:
                multiplier = 1;
                dx = 0;
                break;
            default: return;
        }

        dx *= multiplier;
        dy *= multiplier;

        this.currArrowKey = key;
        actions.setCursorVelocity(dx, dy);
    },
    handleKeyup: function (e) {
        var key = e.keyCode || e.which;

        if (key !== this.currArrowKey) return;
        actions.setCursorVelocity(0, 0);
    },
    onChange: function () {
        this.setState(getCursorState());
    },
    render: function () {
        return (
    			<rect x={this.state.cursorX} y={this.state.cursorY} height={this.props.cursorHeight} width={this.props.cursorWidth} className="cursor" />
    		);
    }
});

module.exports = Cursor;

