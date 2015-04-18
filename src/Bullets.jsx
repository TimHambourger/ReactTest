var React = require('react'),
    KeyCodes = require('./keyCodes'),
    actions = require('./actions'),
    cursorStore = require('./cursorStore'),
    bulletStore = require('./bulletStore');

function getBulletsState() {
    return {
        bullets: bulletStore.getBullets()
    };
}

var Bullets = React.createClass({
    getInitialState: function () {
        return getBulletsState();
    },
    componentDidMount: function () {
        document.body.addEventListener('keydown', this.handleKeydown);
        document.body.addEventListener('keyup', this.handleKeyup);
        bulletStore.addChangeListener(this.onChange);
    },
    componentWillUnmount: function () {
        document.body.removeEventListener('keydown', this.handleKeydown);
        document.body.removeEventListener('keyup', this.handleKeyup);
        bulletStore.removeChangeListener(this.onChange);
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
        var cursorPos = cursorStore.getCursorPos(),
            x = cursorPos.x + cursorStore.getCursorWidth() / 2,
            y = cursorPos.y;
        actions.fireBullet(x, y);
    },
    onChange: function () {
        this.setState(getBulletsState());
    },
    render: function () {
        var bullets = [];

        for (var i = 0; i < this.state.bullets.length; i++) {
            var bullet = this.state.bullets[i];
            bullets.push(<rect key={bullet.id} x={bullet.x} y={bullet.y} height="4" width="1" className="bullet" />);
        }

        return <svg>{bullets}</svg>;
    }
});

module.exports = Bullets;
