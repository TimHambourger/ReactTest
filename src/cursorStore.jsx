define(function (require) {
    var EventEmitter = require('EventEmitter2'),
        messageTypes = require('./messageTypes'),
        dispatcher = require('./appDispatcher');

    var CHANGE_EVENT = 'change';

    var screenWidth, screenHeight, cursorWidth, cursorHeight;

    var cursorX, cursorY, cursorDx, cursorDy;

    var cursorStore = new EventEmitter();

    dispatcher.subscribe(function (message) {
        if (message.type !== messageTypes.SET_CURSOR_VELOCITY) return;
        cursorDx = message.data.dx;
        cursorDy = message.data.dy;
    });

    dispatcher.subscribe(function (message) {
        if (message.type !== messageTypes.ADVANCE_TIME) return;
        cursorX += cursorDx * message.data.dt;
        cursorY += cursorDy * message.data.dt;
        if (cursorX >= screenWidth) cursorX = cursorX - screenWidth;
        if (cursorX < 0) cursorX = cursorX + screenWidth;
        if (cursorY + cursorHeight >= screenHeight) cursorY = screenHeight - cursorHeight;
        if (cursorY < 0) cursorY = 0;
        cursorStore.emit(CHANGE_EVENT);
    });

    return {
        initialize: function (args) {
            screenWidth = args.screenWidth;
            screenHeight = args.screenHeight;
            cursorWidth = args.cursorWidth;
            cursorHeight = args.cursorHeight;
            cursorX = (screenWidth - cursorWidth) / 2;
            cursorY = screenHeight - cursorHeight;
            cursorDx = 0;
            cursorDy = 0;
        },
        getCursorPos: function () {
            return { x: cursorX, y: cursorY };
        },
        getCursorWidth: function () {
            return cursorWidth;
        },
        addChangeListener: function (callback) {
            cursorStore.on(CHANGE_EVENT, callback);
        },
        removeChangeListener: function (callback) {
            cursorStore.off(CHANGE_EVENT, callback);
        }
    };
});