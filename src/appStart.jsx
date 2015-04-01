define(function (require) {
    var App = require('./App'),
        React = require('React');

    return function () {
        React.render(<App height={500} width={500} cursorHeight={17} cursorWidth={10} targetCount={50} />, document.getElementById("reactMountNode"));
    };
});