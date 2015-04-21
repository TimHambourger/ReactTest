var React = require('react'),
    ko = require('knockout'),
    KeyCodes = require('./keyCodes'),
    cursorStore = require('./cursorStore'),
    bulletStore = require('./bulletStore');

var bulletsState = ko.pureComputed(() => ({ bullets: bulletStore.bullets() })),
    stateSubscription;

var Bullets = React.createClass({
    getInitialState: function () {
        return bulletsState();
    },
    componentDidMount: function () {
        document.body.addEventListener('keydown', this.handleKeydown);
        document.body.addEventListener('keyup', this.handleKeyup);
        stateSubscription = bulletsState.subscribe(val => this.setState(val));
    },
    componentWillUnmount: function () {
        document.body.removeEventListener('keydown', this.handleKeydown);
        document.body.removeEventListener('keyup', this.handleKeyup);
        stateSubscription.dispose();        
    },
    handleKeydown: function (e) {
        var self = this,
            key = e.keyCode || e.which;

        if (key !== KeyCodes.SPACE_BAR) return;

        clearInterval(this.currAddBulletInterval);
        this.currAddBulletInterval = setInterval(function () { self.addBullet(); }, 10);
        this.addBullet();
    },
    handleKeyup: function (e) {
        var key = e.keyCode || e.which;

        if (key !== KeyCodes.SPACE_BAR) return;
        clearInterval(this.currAddBulletInterval);
    },
    addBullet: function () {
        var x = cursorStore.cursorX() + cursorStore.getCursorWidth() / 2,
            y = cursorStore.cursorY();
        bulletStore.fireBullet(x, y);
    },
    render: function () {
        return (
            <svg>
                {this.state.bullets.map(bullet =>
                    <rect key={bullet.id} x={bullet.x} y={bullet.y} height="4" width="1" className="bullet" />)}
            </svg>
        );
    }
});

module.exports = Bullets;
