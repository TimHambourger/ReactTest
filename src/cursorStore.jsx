var EventEmitter = require('../lib/eventemitter2').EventEmitter2,
    messageTypes = require('./messageTypes'),
    dispatcher = require('./appDispatcher');

var CHANGE_EVENT = 'change';

var screenWidth, screenHeight, cursorWidth, cursorHeight;

var cursorX, cursorY, cursorDx, cursorDy;

var cursorStore = new EventEmitter();

dispatcher.subscribe(messageTypes.SET_CURSOR_VELOCITY, function (message) {
    cursorDx = message.dx;
    cursorDy = message.dy;
});

dispatcher.subscribe(messageTypes.ADVANCE_TIME, function (message) {
    cursorX += cursorDx * message.dt;
    cursorY += cursorDy * message.dt;
    if (cursorX >= screenWidth) cursorX = cursorX - screenWidth;
    if (cursorX < 0) cursorX = cursorX + screenWidth;
    if (cursorY + cursorHeight >= screenHeight) cursorY = screenHeight - cursorHeight;
    if (cursorY < 0) cursorY = 0;
    cursorStore.emit(CHANGE_EVENT);
});

module.exports = {
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

