var App = require('./App'),
    React = require('../lib/react-0.13.1');

React.render(<App height={500} width={500} cursorHeight={17} cursorWidth={10} targetCount={50} />, document.body);
