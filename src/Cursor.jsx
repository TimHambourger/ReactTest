var React = require('react'),
    ko = require('knockout'),
    KeyCodes = require('./keyCodes'),
    cursorStore = require('./cursorStore');

var cursorState = ko.pureComputed(() => ({
        cursorX: cursorStore.cursorX(),
        cursorY: cursorStore.cursorY()
    })),
    stateSubscription;

var Cursor = React.createClass({
    propTypes: {
        screenHeight: React.PropTypes.number.isRequired,
        screenWidth: React.PropTypes.number.isRequired,
        cursorHeight: React.PropTypes.number.isRequired,
        cursorWidth: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
        cursorStore.initialize(this.props);

        return cursorState();
    },
    componentDidMount: function () {
        document.body.addEventListener('keydown', this.handleKeydown);
        document.body.addEventListener('keyup', this.handleKeyup);
        var self = this;
        stateSubscription = cursorState.subscribe(val => self.setState(val));
    },
    componentWillUnmount: function () {
        document.body.removeEventListener('keydown', this.handleKeydown);
        document.body.removeEventListener('keyup', this.handleKeyup);
        stateSubscription.dispose();
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
        cursorStore.cursorDx(dx);
        cursorStore.cursorDy(dy);
    },
    handleKeyup: function (e) {
        var key = e.keyCode || e.which;

        if (key !== this.currArrowKey) return;
        cursorStore.cursorDx(0);
        cursorStore.cursorDy(0);
    },
    render: function () {
        return (
            <rect x={this.state.cursorX} y={this.state.cursorY} height={this.props.cursorHeight} width={this.props.cursorWidth} className="cursor" />
        );
    }
});

module.exports = Cursor;

