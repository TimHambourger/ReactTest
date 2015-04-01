define(function (require) {
    var dispatcher = require('./appDispatcher'),
        messageTypes = require('./messageTypes');

    return {
        setCursorVelocity: function (dx, dy) {
            dispatcher.dispatch({
                type: messageTypes.SET_CURSOR_VELOCITY,
                data: { dx: dx, dy: dy }
            });
        },
        fireBullet: function (x, y) {
            dispatcher.dispatch({
                type: messageTypes.FIRE_BULLET,
                data: { x: x, y: y }
            });
        },
        advanceTime: function (dt) {
            dispatcher.dispatch({
                type: messageTypes.ADVANCE_TIME,
                data: { dt: dt }
            });
        }
    };
});