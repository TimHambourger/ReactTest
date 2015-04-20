var ko = require('knockout'),
    dt = require('./dt');

var screenWidth, screenHeight, cursorWidth, cursorHeight;

var cursorX = ko.observable(),
    cursorY = ko.observable(),
    cursorDx = ko.observable(),
    cursorDy = ko.observable();

dt.subscribe(function (val) {
    cursorX(cursorX() + cursorDx() * val);
    cursorY(cursorY() + cursorDy() * val);
    if (cursorX() >= screenWidth) cursorX(cursorX() - screenWidth);
    if (cursorX() < 0) cursorX(cursorX() + screenWidth);
    if (cursorY() + cursorHeight >= screenHeight) cursorY(screenHeight - cursorHeight);
    if (cursorY() < 0) cursorY(0);
});

module.exports = {
    initialize: function (args) {
        screenWidth = args.screenWidth;
        screenHeight = args.screenHeight;
        cursorWidth = args.cursorWidth;
        cursorHeight = args.cursorHeight;
        cursorX((screenWidth - cursorWidth) / 2);
        cursorY(screenHeight - cursorHeight);
        cursorDx(0);
        cursorDy(0);
    },
    cursorX: cursorX,
    cursorY: cursorY,
    cursorDx: cursorDx,
    cursorDy: cursorDy,
    getCursorWidth: function () {
        return cursorWidth;
    }
};

